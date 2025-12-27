import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Workflow, Lock, Sparkles } from "lucide-react";

const features = [
  {
    icon: <Workflow className="w-6 h-6" />,
    title: "Visual Workflow Builder",
    description: "Drag and drop nodes to create powerful automation workflows",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Multiple Integrations",
    description: "Connect Telegram, Email, Slack, and more services seamlessly",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Secure Credentials",
    description: "Your API keys and tokens are stored securely",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">WorkflowBuilder</span>
        </div>
        <Link to="/auth">
          <Button variant="outline" className="border-border/50 hover:bg-secondary/50">
            Sign In
          </Button>
        </Link>
      </header>
      
      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-8 pt-20 pb-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Build automations visually</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-center max-w-4xl leading-tight mb-6">
          Automate Your Workflows
          <span className="block bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
            Without Code
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground text-center max-w-2xl mb-10">
          Connect your favorite apps and services. Create powerful automations 
          with our intuitive visual builder. No coding required.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/auth">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 shadow-lg shadow-primary/20 group">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline" className="text-lg px-8 border-border/50 hover:bg-secondary/50">
              View Demo
            </Button>
          </Link>
        </div>
        
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card/30 border border-border/30 backdrop-blur-sm hover:bg-card/50 hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8 text-center text-sm text-muted-foreground">
        <p>Built with ❤️ for automation enthusiasts</p>
      </footer>
    </div>
  );
}
