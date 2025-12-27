// TypeScript types matching backend schemas

export type PlatformType = 'telegram' | 'email' | 'slack' | 'trigger';

export interface Node {
  id: string;
  platform: PlatformType;
  name: string;
  data: Record<string, any>;
  credential_id?: string;
  // ReactFlow specific
  position?: { x: number; y: number };
  type?: string;
}

export interface Connection {
  source: string;
  target: string;
}

export interface Workflow {
  id: number;
  title: string;
  enabled: boolean;
  nodes: Node[] | null;
  connections: Connection[] | null;
  user_id: number;
  webhook_path?: string;
  created_at?: string;
  updated_at?: string;
  last_executed_at?: string;
}

export interface WorkflowCreate {
  title: string;
  enabled?: boolean;
  nodes?: Node[];
  connections?: Connection[];
}

export interface WorkflowUpdate {
  title?: string;
  enabled?: boolean;
  nodes?: Node[];
  connections?: Connection[];
}

export interface Credential {
  id: number;
  title: string;
  platform: PlatformType;
  data: Record<string, any>;
  user_id: number;
  created_at?: string;
}

export interface CredentialCreate {
  title: string;
  platform: PlatformType;
  data: Record<string, any>;
}

// Execution types
export interface ExecutionResult {
  workflow_id: number;
  webhook_path?: string;
  status: 'success' | 'failed';
  test_mode: boolean;
  execution_time_ms: number;
  result?: {
    status: string;
    executed_nodes: Array<{
      id: string;
      name: string;
      status: 'success' | 'skipped' | 'error';
      error?: string;
    }>;
    context: Record<string, any>;
  };
  error?: string;
}

// User types
export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
