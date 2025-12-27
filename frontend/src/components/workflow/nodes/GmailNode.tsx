import { Handle, Position } from 'reactflow';
import { Mail } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

interface GmailNodeData {
  label?: string;
  config?: {
    to_email?: string;
    subject?: string;
    body?: string;
  };
  credential_id?: string;
}

export function GmailNode({ data, id }: { data: GmailNodeData; id: string }) {
  const { selectedNodeId } = useWorkflowStore();
  const isSelected = selectedNodeId === id;
  
  return (
    <div className={`
      bg-card border-2 rounded-xl p-4 min-w-[200px] shadow-lg
      transition-all duration-200
      ${isSelected 
        ? 'border-red-400 ring-2 ring-red-400/20 shadow-red-400/20' 
        : 'border-red-400/50 hover:border-red-400/80'
      }
    `}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-gradient-to-br from-red-400 to-red-500 rounded-lg flex items-center justify-center shadow-md">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-semibold text-card-foreground text-sm">
            {data.label || 'Email'}
          </span>
          <p className="text-xs text-muted-foreground">Send email</p>
        </div>
      </div>
      
      <div className="space-y-1.5 text-xs">
        {data.config?.to_email && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="opacity-60">To:</span>
            <span className="text-foreground/80 truncate max-w-[120px]">
              {data.config.to_email}
            </span>
          </div>
        )}
        {data.config?.subject && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="opacity-60">Subject:</span>
            <span className="text-foreground/80 truncate max-w-[120px]">
              {data.config.subject}
            </span>
          </div>
        )}
        {!data.config?.to_email && !data.config?.subject && (
          <p className="text-muted-foreground/60 italic">Click to configure</p>
        )}
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-red-400 !border-2 !border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-red-400 !border-2 !border-background"
      />
    </div>
  );
}