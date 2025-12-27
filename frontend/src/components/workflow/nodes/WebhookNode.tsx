import { Handle, Position } from 'reactflow';
import { Webhook } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

interface WebhookNodeData {
  label?: string;
}

export function WebhookNode({ data, id }: { data: WebhookNodeData; id: string }) {
  const { selectedNodeId } = useWorkflowStore();
  const isSelected = selectedNodeId === id;
  
  return (
    <div className={`
      bg-card border-2 rounded-xl p-4 min-w-[200px] shadow-lg
      transition-all duration-200
      ${isSelected 
        ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-orange-500/20' 
        : 'border-orange-500/50 hover:border-orange-500/80'
      }
    `}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
          <Webhook className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-semibold text-card-foreground text-sm">
            {data.label || 'Webhook Trigger'}
          </span>
          <p className="text-xs text-muted-foreground">Start workflow</p>
        </div>
      </div>
      
      <div className="p-2 bg-secondary/30 rounded-lg">
        <p className="text-xs text-muted-foreground">
          Triggers on HTTP request
        </p>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-background"
      />
    </div>
  );
}