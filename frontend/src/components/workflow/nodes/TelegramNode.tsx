import { Handle, Position } from 'reactflow';
import { MessageCircle } from 'lucide-react';

export function TelegramNode({ data }: { data: any }) {
  return (
    <div className="bg-card border-2 border-node-telegram rounded-lg p-4 min-w-[180px] shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-node-telegram rounded flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium text-card-foreground">Send a text message</span>
      </div>
      
      <div className="text-sm text-muted-foreground mb-2">
        Send message via Telegram
      </div>
      
      <div className="text-xs text-muted-foreground">
        sendMessage: message
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-node-telegram border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-node-telegram border-2 border-background"
      />
    </div>
  );
}