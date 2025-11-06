import { useCallback, useState } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';

import { WebhookNode } from './nodes/WebhookNode';
import { TelegramNode } from './nodes/TelegramNode';
import { GmailNode } from './nodes/GmailNode';
import { Button } from '@/components/ui/button';
import { Play, Save } from 'lucide-react';

const nodeTypes = {
  webhook: WebhookNode,
  telegram: TelegramNode,
  gmail: GmailNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'webhook',
    position: { x: 100, y: 100 },
    data: { label: 'Webhook Trigger' },
  },
];

const initialEdges: Edge[] = [];

export function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type,
      position: { x: Math.random() * 300 + 200, y: Math.random() * 300 + 200 },
      data: { label: `${type} Node` },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="h-full w-full bg-canvas-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-canvas-background"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="hsl(var(--canvas-grid))"
        />
        <Controls />
        
        <Panel position="top-left" className="m-4">
          <div className="flex gap-2 bg-card p-2 rounded-lg border">
            <Button 
              size="sm" 
              onClick={() => addNode('webhook')}
              className="bg-node-webhook text-black hover:bg-node-webhook/80"
            >
              Webhook
            </Button>
            <Button 
              size="sm" 
              onClick={() => addNode('telegram')}
              className="bg-node-telegram hover:bg-node-telegram/80"
            >
              Telegram
            </Button>
            <Button 
              size="sm" 
              onClick={() => addNode('gmail')}
              className="bg-node-gmail hover:bg-node-gmail/80"
            >
              Gmail
            </Button>
          </div>
        </Panel>

        <Panel position="top-right" className="m-4">
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button size="sm">
              <Play className="w-4 h-4 mr-2" />
              Execute
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}