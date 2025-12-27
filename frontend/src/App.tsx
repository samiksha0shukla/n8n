import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Workflows from "./pages/Workflows";
import Credentials from "./pages/Credentials";
import WorkflowEditor from "./pages/WorkflowEditor";
import CredentialForm from "./components/credentials/CredentialForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/workflows" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Workflows />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workflows/new" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <WorkflowEditor />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workflows/:id/edit" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <WorkflowEditor />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/credentials" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Credentials />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/credentials/new" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CredentialForm />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
