import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/SideBar";

function ManagerHome() {
  const [header, setHeader] = useState({
    title: "Dashboard",
    subtitle: "Manage your team and projects",
  });

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar setHeader={setHeader} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          title={header.title}
          subtitle={header.subtitle}
        />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ManagerHome;