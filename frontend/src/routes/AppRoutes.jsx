import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ManagerHome from "../pages/ManagerHome";
import DashboardPage from "../pages/DashbaordPage";
import ProjectDashboard from "../pages/ProjectDashboard";
import TeamDashboard from "../pages/TeamDashbaord";
import ReportDashboard from "../pages/ReportDashboard";
import ManagerDashboard from "../pages/ManagerDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/manager-home" element={<ManagerHome />}>
        <Route index element={<Navigate to="projects" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="projects" element={<ProjectDashboard />} />
        <Route path="team" element={<TeamDashboard />} />
        <Route path="reports" element={<ReportDashboard />} />
        <Route path="managerDashboard" element={<ManagerDashboard />} />


      </Route>
    </Routes>
  );
};

export default AppRoutes;
