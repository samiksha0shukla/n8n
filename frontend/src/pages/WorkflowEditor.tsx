import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { NodeConfigPanel } from "@/components/workflow/NodeConfigPanel";
import { useWorkflowStore } from "@/store/workflowStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Play, ArrowLeft, Loader2, Copy, CheckCheck } from "lucide-react";
import { toast } from "sonner";

export default function WorkflowEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const {
    currentWorkflow,
    workflowTitle,
    setWorkflowTitle,
    selectedNodeId,
    isLoading,
    isSaving,
    isExecuting,
    loadWorkflow,
    saveWorkflow,
    createWorkflow,
    executeWorkflow,
    resetWorkflow,
  } = useWorkflowStore();
  
  // Load workflow if editing
  useEffect(() => {
    if (id) {
      loadWorkflow(parseInt(id)).catch((error) => {
        toast.error("Failed to load workflow");
        navigate("/workflows");
      });
    } else {
      resetWorkflow();
    }
    
    return () => {
      // Clean up on unmount
    };
  }, [id]);
  
  const handleSave = async () => {
    try {
      const workflow = await (currentWorkflow ? saveWorkflow() : createWorkflow());
      toast.success("Workflow saved successfully!");
      
      // Navigate to edit mode if this was a new workflow
      if (!id && workflow.id) {
        navigate(`/workflows/${workflow.id}/edit`, { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save workflow");
    }
  };
  
  const handleExecute = async () => {
    if (!currentWorkflow) {
      toast.error("Please save the workflow first");
      return;
    }
    
    try {
      const result = await executeWorkflow();
      if (result.status === "success") {
        toast.success(`Workflow executed in ${result.execution_time_ms}ms`);
      } else {
        toast.error(`Execution failed: ${result.error}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Execution failed");
    }
  };
  
  const copyWebhookUrl = () => {
    if (currentWorkflow?.webhook_path) {
      const webhookUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8001'}/webh/webhook/${currentWorkflow.webhook_path}`;
      navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Webhook URL copied!");
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading workflow...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/workflows")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Input
            value={workflowTitle}
            onChange={(e) => setWorkflowTitle(e.target.value)}
            placeholder="Workflow name..."
            className="w-64 bg-background/50 border-border/50 focus:border-primary"
          />
          
          {currentWorkflow?.webhook_path && (
            <Button
              variant="outline"
              size="sm"
              onClick={copyWebhookUrl}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <CheckCheck className="w-3 h-3 mr-1.5 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 mr-1.5" />
              )}
              Copy Webhook URL
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>
          
          <Button
            onClick={handleExecute}
            disabled={isExecuting || !currentWorkflow}
            className="bg-primary hover:bg-primary/90"
          >
            {isExecuting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Execute
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1">
          <WorkflowCanvas />
        </div>
        
        {/* Config Panel */}
        {selectedNodeId && (
          <div className="w-80 border-l border-border bg-card/30">
            <NodeConfigPanel />
          </div>
        )}
      </div>
    </div>
  );
}