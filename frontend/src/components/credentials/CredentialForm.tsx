import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createCredential } from "@/services/credential.service";
import { PlatformType } from "@/types/workflow";
import { toast } from "sonner";

const platformConfigs: Record<PlatformType, { 
  label: string; 
  icon: string; 
  fields: { key: string; label: string; type: string; placeholder: string }[] 
}> = {
  telegram: {
    label: "Telegram",
    icon: "💬",
    fields: [
      { key: "access_token", label: "Bot Access Token", type: "password", placeholder: "Enter your Telegram bot token" },
    ],
  },
  email: {
    label: "Email (Gmail)",
    icon: "📧",
    fields: [
      { key: "from_email", label: "From Email", type: "email", placeholder: "your@gmail.com" },
      { key: "app_password", label: "App Password", type: "password", placeholder: "Enter Gmail app password" },
    ],
  },
  slack: {
    label: "Slack",
    icon: "#️⃣",
    fields: [
      { key: "webhook_url", label: "Webhook URL", type: "url", placeholder: "https://hooks.slack.com/..." },
    ],
  },
  trigger: {
    label: "Trigger",
    icon: "⚡",
    fields: [],
  },
};

export function CredentialForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<PlatformType | "">("");
  const [data, setData] = useState<Record<string, string>>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !platform) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await createCredential({
        title,
        platform: platform as PlatformType,
        data,
      });
      toast.success("Credential created successfully!");
      navigate("/credentials");
    } catch (error: any) {
      toast.error(error.message || "Failed to create credential");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFieldChange = (key: string, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };
  
  const selectedConfig = platform ? platformConfigs[platform] : null;
  
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate("/credentials")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Credentials
      </Button>
      
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create Credential</CardTitle>
          <CardDescription>
            Add credentials for your integrations. These will be securely stored.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Credential Name *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Telegram Bot"
                className="bg-background/50"
                required
              />
            </div>
            
            {/* Platform */}
            <div className="space-y-2">
              <Label>Platform *</Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as PlatformType)}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(platformConfigs)
                    .filter(([key]) => key !== 'trigger')
                    .map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <span>{config.icon}</span>
                          <span>{config.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Platform-specific fields */}
            {selectedConfig && selectedConfig.fields.length > 0 && (
              <div className="space-y-4 p-4 bg-secondary/20 rounded-lg border border-border/30">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {selectedConfig.label} Configuration
                </h4>
                {selectedConfig.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <Input
                      id={field.key}
                      type={field.type}
                      value={data[field.key] || ""}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="bg-background/50"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/credentials")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Credential"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CredentialForm;
