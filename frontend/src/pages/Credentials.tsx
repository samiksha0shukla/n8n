import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/services/api";
import { toast } from "sonner";

export default function Credentials() {
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCredentials();
      setCredentials(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (credentialId: number) => {
    if (!confirm('Are you sure you want to delete this credential?')) return;

    try {
      await apiService.deleteCredential(credentialId);
      toast.success('Credential deleted successfully!');
      fetchCredentials(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete credential');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading credentials...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">
            Manage your service credentials
          </p>
        </div>
        <Link to="/credentials/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Credential
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {credentials.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No credentials found. Create your first credential to get started!
            </CardContent>
          </Card>
        ) : (
          credentials.map((credential) => (
            <Card key={credential.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">{credential.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{credential.platform}</Badge>
                  <div className="flex gap-1">
                    <Link to={`/credentials/${credential.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(credential.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(credential.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}