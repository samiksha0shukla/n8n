import { apiCaller } from "./api-caller";
import { Workflow, WorkflowCreate, WorkflowUpdate, ExecutionResult } from "@/types/workflow";

export const getWorkflows = async (): Promise<Workflow[]> => {
  const response = await apiCaller.get("/workf/workflow");
  if (response.status !== 200) {
    throw new Error((response.data as any)?.detail || "Failed to fetch workflows");
  }
  return response.data as Workflow[];
};

export const getWorkflow = async (id: number): Promise<Workflow> => {
  try {
    const response = await apiCaller.get<Workflow>(`/workf/workflow/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch workflow:", error);
    throw error;
  }
};

export const createWorkflow = async (workflow: WorkflowCreate): Promise<Workflow> => {
  try {
    const response = await apiCaller.post<Workflow>("/workf/workflow", workflow);
    return response.data;
  } catch (error) {
    console.error("Failed to create workflow:", error);
    throw error;
  }
};

export const updateWorkflow = async (id: number, workflow: WorkflowUpdate): Promise<Workflow> => {
  try {
    const response = await apiCaller.put<Workflow>(`/workf/workflow/${id}`, workflow);
    return response.data;
  } catch (error) {
    console.error("Failed to update workflow:", error);
    throw error;
  }
};

export const deleteWorkflow = async (id: number): Promise<void> => {
  try {
    await apiCaller.delete(`/workf/workflow/${id}`);
  } catch (error) {
    console.error("Failed to delete workflow:", error);
    throw error;
  }
};

export const executeWorkflow = async (id: number): Promise<ExecutionResult> => {
  console.log('[Workflow] Executing workflow ID:', id);
  if (!id || isNaN(id)) {
    throw new Error("Invalid workflow ID");
  }
  const response = await apiCaller.post(`/webh/webhook/test/${id}`, {});
  if (response.status !== 200) {
    throw new Error((response.data as any)?.detail || "Execution failed");
  }
  return response.data as ExecutionResult;
};