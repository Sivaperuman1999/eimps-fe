import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "./store/authStore";

interface RoleRouteProps {
  allowedRoles: string[];
}

function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasPermission = allowedRoles.includes(user.role);

  if (!hasPermission) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
