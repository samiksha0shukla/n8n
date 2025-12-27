import { useState, useEffect } from "react";
import { useWorkflowStore } from "@/store/workflowStore";
import { getCredentialsByPlatform } from "@/services/credential.service";
import { Credential, PlatformType } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Webhook, MessageCircle, Mail, Hash } from "lucide-react";

interface NodeData {
  label: string;
  platform: PlatformType;
  config: Record<string, any>;
  credential_id: string | null;
}

export function NodeConfigPanel() {
  const { nodes, selectedNodeId, updateNodeData, selectNode } = useWorkflowStore();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loadingCredentials, setLoadingCredentials] = useState(false);
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const nodeData = selectedNode?.data as NodeData | undefined;
  
  // Load credentials for the selected platform
  useEffect(() => {
    if (nodeData?.platform && nodeData.platform !== 'trigger') {
      setLoadingCredentials(true);
      getCredentialsByPlatform(nodeData.platform)
        .then(setCredentials)
        .catch(() => setCredentials([]))
        .finally(() => setLoadingCredentials(false));
    }
  }, [nodeData?.platform]);
  
  if (!selectedNode || !nodeData) {
    return null;
  }
  
  const updateConfig = (key: string, value: any) => {
    updateNodeData(selectedNode.id, {
      config: { ...nodeData.config, [key]: value },
    });
  };
  
  const updateLabel = (label: string) => {
    updateNodeData(selectedNode.id, { label });
  };
  
  const updateCredential = (credentialId: string) => {
    updateNodeData(selectedNode.id, { credential_id: credentialId });
  };
  
  const getIcon = () => {
    switch (nodeData.platform) {
      case 'trigger':
        return <Webhook className="w-5 h-5 text-orange-500" />;
      case 'telegram':
        return <MessageCircle className="w-5 h-5 text-blue-400" />;
      case 'email':
        return <Mail className="w-5 h-5 text-red-400" />;
      case 'slack':
        return <Hash className="w-5 h-5 text-purple-400" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-sm">Node Configuration</h3>
            <p className="text-xs text-muted-foreground capitalize">{nodeData.platform}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => selectNode(null)}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Node Label */}
        <div className="space-y-2">
          <Label htmlFor="label" className="text-xs text-muted-foreground">Node Name</Label>
          <Input
            id="label"
            value={nodeData.label || ''}
            onChange={(e) => updateLabel(e.target.value)}
            placeholder="Enter node name..."
            className="bg-background/50"
          />
        </div>
        
        {/* Credential Selector (for non-trigger nodes) */}
        {nodeData.platform !== 'trigger' && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Credential</Label>
            <Select
              value={nodeData.credential_id || ''}
              onValueChange={updateCredential}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder={loadingCredentials ? "Loading..." : "Select credential"} />
              </SelectTrigger>
              <SelectContent>
                {credentials.map((cred) => (
                  <SelectItem key={cred.id} value={String(cred.id)}>
                    {cred.title}
                  </SelectItem>
                ))}
                {credentials.length === 0 && !loadingCredentials && (
                  <SelectItem value="" disabled>
                    No credentials found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Platform-specific fields */}
        {nodeData.platform === 'trigger' && (
          <div className="space-y-4">
            <div className="p-3 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                This webhook trigger will start the workflow when it receives an HTTP request.
              </p>
            </div>
          </div>
        )}
        
        {nodeData.platform === 'telegram' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Chat ID</Label>
              <Input
                value={nodeData.config?.chat_id || ''}
                onChange={(e) => updateConfig('chat_id', e.target.value)}
                placeholder="Enter chat ID..."
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Message</Label>
              <Textarea
                value={nodeData.config?.message || ''}
                onChange={(e) => updateConfig('message', e.target.value)}
                placeholder="Enter message..."
                className="bg-background/50 min-h-[100px]"
              />
            </div>
          </div>
        )}
        
        {nodeData.platform === 'email' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">To Email</Label>
              <Input
                value={nodeData.config?.to_email || ''}
                onChange={(e) => updateConfig('to_email', e.target.value)}
                placeholder="recipient@example.com"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Subject</Label>
              <Input
                value={nodeData.config?.subject || ''}
                onChange={(e) => updateConfig('subject', e.target.value)}
                placeholder="Email subject..."
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Body</Label>
              <Textarea
                value={nodeData.config?.body || ''}
                onChange={(e) => updateConfig('body', e.target.value)}
                placeholder="Email body..."
                className="bg-background/50 min-h-[100px]"
              />
            </div>
          </div>
        )}
        
        {nodeData.platform === 'slack' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Channel</Label>
              <Input
                value={nodeData.config?.channel || ''}
                onChange={(e) => updateConfig('channel', e.target.value)}
                placeholder="#channel-name"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Message</Label>
              <Textarea
                value={nodeData.config?.message || ''}
                onChange={(e) => updateConfig('message', e.target.value)}
                placeholder="Enter message..."
                className="bg-background/50 min-h-[100px]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
