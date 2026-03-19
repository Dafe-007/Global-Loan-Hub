import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setLocation("/dashboard");
    } else if (!isAuthenticated && !isLoading) {
      // Auto-trigger Replit login since we don't have custom forms
      login();
    }
  }, [isAuthenticated, isLoading, setLocation, login]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-primary">Authenticating...</h2>
        <p className="text-muted-foreground">Please wait while we securely log you in.</p>
      </div>
    </div>
  );
}
