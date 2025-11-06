import { Handle, Position } from 'reactflow';
import { Mail } from 'lucide-react';

export function GmailNode({ data }: { data: any }) {
  return (
    <div className="bg-card border-2 border-node-gmail rounded-lg p-4 min-w-[180px] shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-node-gmail rounded flex items-center justify-center">
          <Mail className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium text-card-foreground">Send Gmail</span>
      </div>
      
      <div className="text-sm text-muted-foreground mb-2">
        Send email via Gmail
      </div>
      
      <div className="text-xs text-muted-foreground">
        Send
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-node-gmail border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-node-gmail border-2 border-background"
      />
    </div>
  );
}