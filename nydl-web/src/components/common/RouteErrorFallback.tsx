import { useRouteError, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store"; // Import your store

export default function RouteErrorFallback() {
  const error = useRouteError() as any;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore(); // Check login status

  // Log to your error tracking service (e.g., Sentry)
  console.error("Layout Error Caught:", error);

  const handleHomeRedirect = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-destructive">Something went wrong</h1>
        <p className="text-muted-foreground">
          {error?.statusText || error?.message || "An unexpected application error occurred."}
        </p>
        <div className="flex gap-4 justify-center pt-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/80 transition-colors"
          >
            Reload Page
          </button>
          <button
            onClick={handleHomeRedirect}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            {isAuthenticated ? "Go to Dashboard" : "Go Home"}
          </button>
        </div>
      </div>
    </div>
  );
}
