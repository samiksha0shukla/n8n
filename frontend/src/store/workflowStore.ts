import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { Workflow, WorkflowCreate, WorkflowUpdate, ExecutionResult, PlatformType } from '@/types/workflow';
import { apiCaller } from '@/services/api-caller';

interface WorkflowState {
  // Current workflow being edited
  currentWorkflow: Workflow | null;
  workflowTitle: string;
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  
  // UI State
  isLoading: boolean;
  isSaving: boolean;
  isExecuting: boolean;
  error: string | null;
  lastExecutionResult: ExecutionResult | null;
  
  // Actions
  setWorkflowTitle: (title: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (type: PlatformType, position?: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Record<string, any>) => void;
  selectNode: (nodeId: string | null) => void;
  
  // API Actions
  loadWorkflow: (id: number) => Promise<void>;
  saveWorkflow: () => Promise<Workflow>;
  createWorkflow: () => Promise<Workflow>;
  executeWorkflow: () => Promise<ExecutionResult>;
  deleteWorkflow: (id: number) => Promise<void>;
  
  // Reset
  resetWorkflow: () => void;
}

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Map platform types to node types for ReactFlow
const platformToNodeType: Record<PlatformType, string> = {
  trigger: 'webhook',
  telegram: 'telegram',
  email: 'gmail',
  slack: 'slack',
};

// Map ReactFlow node types back to platform types
const nodeTypeToPlatform: Record<string, PlatformType> = {
  webhook: 'trigger',
  telegram: 'telegram',
  gmail: 'email',
  slack: 'slack',
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  currentWorkflow: null,
  workflowTitle: 'Untitled Workflow',
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  isLoading: false,
  isSaving: false,
  isExecuting: false,
  error: null,
  lastExecutionResult: null,
  
  setWorkflowTitle: (title: string) => set({ workflowTitle: title }),
  
  setNodes: (nodes: Node[]) => set({ nodes }),
  
  setEdges: (edges: Edge[]) => set({ edges }),
  
  addNode: (type: PlatformType, position?: { x: number; y: number }) => {
    const { nodes } = get();
    const id = `node_${Date.now()}`;
    const nodeType = platformToNodeType[type] || type;
    
    const newNode: Node = {
      id,
      type: nodeType,
      position: position || { x: Math.random() * 300 + 200, y: Math.random() * 300 + 100 },
      data: {
        label: `${type} Node`,
        platform: type,
        config: {},
        credential_id: null,
      },
    };
    
    set({ nodes: [...nodes, newNode] });
  },
  
  updateNodeData: (nodeId: string, data: Record<string, any>) => {
    const { nodes } = get();
    set({
      nodes: nodes.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
  },
  
  selectNode: (nodeId: string | null) => set({ selectedNodeId: nodeId }),
  
  loadWorkflow: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiCaller.get<Workflow>(`/workf/workflow/${id}`);
      const workflow = response.data;
      
      // Transform backend nodes to ReactFlow format
      const nodes: Node[] = (workflow.nodes || []).map((node, index) => ({
        id: node.id,
        type: platformToNodeType[node.platform] || node.platform,
        position: node.position || { x: 100 + index * 200, y: 100 },
        data: {
          label: node.name,
          platform: node.platform,
          config: node.data,
          credential_id: node.credential_id,
        },
      }));
      
      // Transform backend connections to ReactFlow edges
      const edges: Edge[] = (workflow.connections || []).map((conn, index) => ({
        id: `edge_${index}`,
        source: conn.source,
        target: conn.target,
      }));
      
      set({
        currentWorkflow: workflow,
        workflowTitle: workflow.title,
        nodes,
        edges,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to load workflow', isLoading: false });
      throw error;
    }
  },
  
  saveWorkflow: async () => {
    const { currentWorkflow, workflowTitle, nodes, edges } = get();
    
    if (!currentWorkflow) {
      return get().createWorkflow();
    }
    
    set({ isSaving: true, error: null });
    
    try {
      // Transform ReactFlow nodes to backend format
      const backendNodes = nodes.map(node => ({
        id: node.id,
        platform: node.data.platform || nodeTypeToPlatform[node.type || ''] || 'trigger',
        name: node.data.label || `${node.type} Node`,
        data: node.data.config || {},
        credential_id: node.data.credential_id || null,
        position: node.position,
      }));
      
      // Transform ReactFlow edges to backend connections
      const connections = edges.map(edge => ({
        source: edge.source,
        target: edge.target,
      }));
      
      const updateData: WorkflowUpdate = {
        title: workflowTitle,
        nodes: backendNodes,
        connections,
      };
      
      const response = await apiCaller.put<Workflow>(
        `/workf/workflow/${currentWorkflow.id}`,
        updateData
      );
      
      set({ currentWorkflow: response.data, isSaving: false });
      return response.data;
    } catch (error: any) {
      set({ error: error.message || 'Failed to save workflow', isSaving: false });
      throw error;
    }
  },
  
  createWorkflow: async () => {
    const { workflowTitle, nodes, edges } = get();
    set({ isSaving: true, error: null });
    
    try {
      // Transform ReactFlow nodes to backend format
      const backendNodes = nodes.map(node => ({
        id: node.id,
        platform: node.data.platform || nodeTypeToPlatform[node.type || ''] || 'trigger',
        name: node.data.label || `${node.type} Node`,
        data: node.data.config || {},
        credential_id: node.data.credential_id || null,
        position: node.position,
      }));
      
      // Transform ReactFlow edges to backend connections
      const connections = edges.map(edge => ({
        source: edge.source,
        target: edge.target,
      }));
      
      const createData: WorkflowCreate = {
        title: workflowTitle,
        enabled: true,
        nodes: backendNodes,
        connections,
      };
      
      const response = await apiCaller.post<Workflow>('/workf/workflow', createData);
      
      set({ currentWorkflow: response.data, isSaving: false });
      return response.data;
    } catch (error: any) {
      set({ error: error.message || 'Failed to create workflow', isSaving: false });
      throw error;
    }
  },
  
  executeWorkflow: async () => {
    const { currentWorkflow } = get();
    
    if (!currentWorkflow) {
      throw new Error('No workflow to execute');
    }
    
    set({ isExecuting: true, error: null });
    
    try {
      const response = await apiCaller.post<ExecutionResult>(
        `/webh/webhook/test/${currentWorkflow.id}`,
        {}
      );
      
      set({ lastExecutionResult: response.data, isExecuting: false });
      return response.data;
    } catch (error: any) {
      const errorResult: ExecutionResult = {
        workflow_id: currentWorkflow.id,
        status: 'failed',
        test_mode: true,
        execution_time_ms: 0,
        error: error.message || 'Execution failed',
      };
      set({ lastExecutionResult: errorResult, isExecuting: false });
      throw error;
    }
  },
  
  deleteWorkflow: async (id: number) => {
    try {
      await apiCaller.delete(`/workf/workflow/${id}`);
    } catch (error: any) {
      throw error;
    }
  },
  
  resetWorkflow: () => set({
    currentWorkflow: null,
    workflowTitle: 'Untitled Workflow',
    nodes: initialNodes,
    edges: initialEdges,
    selectedNodeId: null,
    error: null,
    lastExecutionResult: null,
  }),
}));
