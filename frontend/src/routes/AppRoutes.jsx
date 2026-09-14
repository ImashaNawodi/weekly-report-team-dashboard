import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ManagerHome from "../pages/ManagerHome";
import DashboardPage from "../pages/DashbaordPage";
import ProjectDashboard from "../pages/ProjectDashboard";
import TeamDashboard from "../pages/TeamDashbaord";
import ReportDashboard from "../pages/ReportDashboard";
import ManagerDashboard from "../pages/ManagerDashboard";
import RoleRoute from "./RoleRoute";
import SettingsPage from "../pages/SettingPage";
import NotFoundPage from "../pages/NotFoundPage";
import HealthAndSupport from "../pages/HealthAndSupportPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/manager-home" element={<ManagerHome />}>
  <Route index element={<Navigate to="dashboard" replace />} />

  <Route path="dashboard" element={<DashboardPage />} />
  <Route path="settings" element={<SettingsPage />} />

  <Route
    element={
      <RoleRoute allowedRoles={["MANAGER", "TEAM_MEMBER"]} />
    }
  >
    <Route path="projects" element={<ProjectDashboard />} />
    <Route path="reports" element={<ReportDashboard />} />
  </Route>

  <Route
    element={<RoleRoute allowedRoles={["MANAGER"]} />}
  >
    <Route path="team" element={<TeamDashboard />} />
    <Route
      path="managerDashboard"
      element={<ManagerDashboard />}
    />
  </Route>

  <Route path="help" element={<HealthAndSupport />} />
</Route>

     // <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;