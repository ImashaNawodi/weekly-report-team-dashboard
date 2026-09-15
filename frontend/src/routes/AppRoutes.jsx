import { Routes, Route} from "react-router-dom";

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
import CheckUser from "../pages/CheckUser";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import WeeklyReport from "../pages/WeeklyReport";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/check-user" element={<CheckUser />} />
      <Route path="/forget-pw" element={<ResetPasswordPage />} />
      <Route path="/manager-home" element={<ManagerHome />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="settings" element={<SettingsPage />} />

        <Route element={<RoleRoute allowedRoles={["MANAGER"]} />}>
          <Route path="projects" element={<ProjectDashboard />} />
          <Route path="managerDashboard" element={<ManagerDashboard />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["TEAM_MEMBER"]} />}>
          <Route path="reports" element={<ReportDashboard />} />
          <Route path="reportForm" element={<WeeklyReport />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
          <Route path="team" element={<TeamDashboard />} />
        </Route>

        <Route path="help" element={<HealthAndSupport />} />
      </Route>
       <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
