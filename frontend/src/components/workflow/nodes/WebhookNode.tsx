import { Handle, Position } from 'reactflow';
import { Webhook } from 'lucide-react';

export function WebhookNode({ data }: { data: any }) {
  return (
    <div className="bg-card border-2 border-node-webhook rounded-lg p-4 min-w-[180px] shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-node-webhook rounded flex items-center justify-center">
          <Webhook className="w-4 h-4 text-black" />
        </div>
        <span className="font-medium text-card-foreground">Webhook</span>
      </div>
      
      <div className="text-sm text-muted-foreground mb-2">
        Trigger workflow on HTTP request
      </div>
      
      <div className="text-xs text-muted-foreground">
        Method: POST
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-node-webhook border-2 border-background"
      />
    </div>
  );
}