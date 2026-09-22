import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const DashboardRedirect = () => {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "MANAGER":
      return <Navigate to="/manager-home/projects" replace />;

    case "TEAM_MEMBER":
      return <Navigate to="/manager-home/reports" replace />;

    case "ADMIN":
      return <Navigate to="/manager-home/team" replace />;

    default:
      return <Navigate to="/login" replace />;
  }
};

export default DashboardRedirect;