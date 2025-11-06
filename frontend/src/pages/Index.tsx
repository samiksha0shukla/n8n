import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Workflow, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-2xl px-6">
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Workflow className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            WorkflowBuilder
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Automate your workflows with our powerful visual builder. Connect webhooks, send messages, and streamline your processes.
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link to="/workflows">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/workflows/new">
            <Button variant="outline" size="lg">
              Create Workflow
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
