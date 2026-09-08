import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

const DEV_SKIP_AUTH = import.meta.env.VITE_DEV_SKIP_AUTH === "true";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (DEV_SKIP_AUTH) return <Outlet />;
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/workouts" replace />;

  return <Outlet />;
}
