import { useState, useEffect } from "react";
import { Play, Edit, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/services/api";
import { getWorkflows } from "@/services/workflow.service"
import { toast } from "sonner";

export default function Workflows() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const data = await getWorkflows();
      setWorkflows(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async (workflowId: number) => {
    try {
      const result = await apiService.executeWorkflow(workflowId);
      toast.success('Workflow executed successfully!');
      console.log('Execution result:', result);
    } catch (error: any) {
      toast.error(error.message || 'Failed to execute workflow');
    }
  };

  const handleDelete = async (workflowId: number) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    
    try {
      // Note: Backend doesn't have delete endpoint, you'll need to add it
      toast.info('Delete functionality needs to be implemented in backend');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete workflow');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading workflows...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">
            Manage your automation workflows
          </p>
        </div>
        <Link to="/workflows/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {workflows.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No workflows found. Create your first workflow to get started!
            </CardContent>
          </Card>
        ) : (
          workflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{workflow.title}</CardTitle>
                  <Badge variant={workflow.enabled ? "default" : "secondary"}>
                    {workflow.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleExecute(workflow.id)}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Link to={`/workflows/${workflow.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(workflow.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{workflow.nodes?.length || 0} nodes</span>
                  <span>{workflow.edges?.length || 0} connections</span>
                  <span>Created: {new Date(workflow.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
