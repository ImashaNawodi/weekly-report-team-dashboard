import Header from "../components/Header";
import Sidebar from "../components/SideBar";
import ProjectsDashboard from "./ProjectDashboard";


function ManagerHome() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Projects" subtitle="Manage your team's projects easily and efficiently" />
        <main className="flex-1 overflow-y-auto">
          <ProjectsDashboard />
        </main>
      </div>
    </div>
  );
}

export default ManagerHome;
