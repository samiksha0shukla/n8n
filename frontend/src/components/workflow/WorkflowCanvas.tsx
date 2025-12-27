import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { WebhookNode } from './nodes/WebhookNode';
import { TelegramNode } from './nodes/TelegramNode';
import { GmailNode } from './nodes/GmailNode';
import { SlackNode } from './nodes/SlackNode';
import { Button } from '@/components/ui/button';
import { Webhook, MessageCircle, Mail, Hash } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { PlatformType } from '@/types/workflow';

const nodeTypes = {
  webhook: WebhookNode,
  telegram: TelegramNode,
  gmail: GmailNode,
  slack: SlackNode,
};

export function WorkflowCanvas() {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
    addNode,
    selectNode,
    selectedNodeId,
  } = useWorkflowStore();
  
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  // Sync local state with store
  useEffect(() => {
    setNodes(storeNodes);
  }, [storeNodes, setNodes]);
  
  useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges, setEdges]);

  // Update store when local state changes
  useEffect(() => {
    setStoreNodes(nodes);
  }, [nodes, setStoreNodes]);
  
  useEffect(() => {
    setStoreEdges(edges);
  }, [edges, setStoreEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({
        ...params,
        animated: true,
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 }
      }, eds));
    },
    [setEdges]
  );

  const handleAddNode = (type: PlatformType) => {
    addNode(type);
  };

  const onNodeClick = useCallback((_: any, node: Node) => {
    selectNode(node.id);
  }, [selectNode]);
  
  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="h-full w-full bg-canvas-background">
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          selected: node.id === selectedNodeId,
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-canvas-background"
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
        }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="hsl(var(--canvas-grid))"
        />
        <Controls className="bg-card border border-border rounded-lg" />
        <MiniMap
          className="bg-card border border-border rounded-lg"
          nodeColor={(node) => {
            switch (node.type) {
              case 'webhook': return 'hsl(25 95% 53%)';
              case 'telegram': return 'hsl(199 89% 48%)';
              case 'gmail': return 'hsl(4 90% 58%)';
              case 'slack': return 'hsl(280 65% 60%)';
              default: return 'hsl(var(--muted))';
            }
          }}
        />
        
        <Panel position="top-left" className="m-4">
          <div className="flex gap-2 bg-card/80 backdrop-blur-sm p-3 rounded-xl border border-border/50 shadow-lg">
            <Button 
              size="sm" 
              onClick={() => handleAddNode('trigger')}
              className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30 border border-orange-500/30"
              variant="outline"
            >
              <Webhook className="w-4 h-4 mr-2" />
              Trigger
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleAddNode('telegram')}
              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
              variant="outline"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Telegram
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleAddNode('email')}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
              variant="outline"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleAddNode('slack')}
              className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30"
              variant="outline"
            >
              <Hash className="w-4 h-4 mr-2" />
              Slack
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}