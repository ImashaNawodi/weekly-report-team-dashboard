import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles }) => {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/manager-home/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;