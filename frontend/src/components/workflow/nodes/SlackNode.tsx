import { Handle, Position } from 'reactflow';
import { Hash } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

interface SlackNodeData {
  label?: string;
  config?: {
    channel?: string;
    message?: string;
  };
  credential_id?: string;
}

export function SlackNode({ data, id }: { data: SlackNodeData; id: string }) {
  const { selectedNodeId } = useWorkflowStore();
  const isSelected = selectedNodeId === id;
  
  return (
    <div className={`
      bg-card border-2 rounded-xl p-4 min-w-[200px] shadow-lg
      transition-all duration-200
      ${isSelected 
        ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-purple-500/20' 
        : 'border-purple-500/50 hover:border-purple-500/80'
      }
    `}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
          <Hash className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-semibold text-card-foreground text-sm">
            {data.label || 'Slack'}
          </span>
          <p className="text-xs text-muted-foreground">Send message</p>
        </div>
      </div>
      
      <div className="space-y-1.5 text-xs">
        {data.config?.channel && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="opacity-60">Channel:</span>
            <span className="text-foreground/80 truncate max-w-[120px]">
              {data.config.channel}
            </span>
          </div>
        )}
        {data.config?.message && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="opacity-60">Message:</span>
            <span className="text-foreground/80 truncate max-w-[120px]">
              {data.config.message.substring(0, 20)}...
            </span>
          </div>
        )}
        {!data.config?.channel && !data.config?.message && (
          <p className="text-muted-foreground/60 italic">Click to configure</p>
        )}
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-background"
      />
    </div>
  );
}
