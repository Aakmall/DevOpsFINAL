import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { isLocalPreview } from "@/lib/preview";

export function SessionLoading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background"
      role="status"
    >
      <Loader2
        className="h-7 w-7 animate-spin text-primary"
        aria-hidden="true"
      />
      <span className="sr-only">Memuat sesi...</span>
    </div>
  );
}

export function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();
  if (isLocalPreview) return <Outlet />;
  if (loading) return <SessionLoading />;
  if (!session)
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  return <Outlet key={session.user.id} />;
}
