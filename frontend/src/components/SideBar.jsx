import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  Zap,
} from "lucide-react";

import { Layout, Menu, Button, Badge, Tooltip } from "antd";

const { Sider } = Layout;

const mainNav = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "managerDashboard",
    label: "Manager Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "projects",
    label: "Projects",
    icon: <FolderKanban size={18} />,
  },
  {
    key: "team",
    label: "Team Members",
    icon: <Users size={18} />,
  },
  {
    key: "reports",
    label: "Weekly Reports",
    icon: <FileText size={18} />,
    badge: "3",
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: <BarChart3 size={18} />,
  },
];

const bottomNav = [
  {
    key: "settings",
    label: "Settings",
    icon: <Settings size={18} />,
  },
  {
    key: "help",
    label: "Help & Support",
    icon: <HelpCircle size={18} />,
  },
];

const pageHeaders = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview of your team's activity",
  },
  managerDashboard: {
    title: "Manager Dashboard",
    subtitle: "Overview of your team's activity",
  },
  projects: {
    title: "Projects",
    subtitle: "Manage your team's projects easily and efficiently",
  },
  team: {
    title: "Team Members",
    subtitle: "Manage your team members and their information",
  },
  reports: {
    title: "Weekly Reports",
    subtitle: " team's weekly reports",
  },
  analytics: {
    title: "Analytics",
    subtitle: "Track your team's performance and progress",
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your account and application settings",
  },
  help: {
    title: "Help & Support",
    subtitle: "Get help and support when you need it",
  },
};

export default function Sidebar({ setHeader }) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("dashboard");

  const navigate = useNavigate();

  const menuItems = mainNav.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: (
      <div className="flex w-full items-center justify-between">
        <span>{item.label}</span>

        {item.badge && (
          <Badge
            count={item.badge}
            size="small"
            className="
              [&_.ant-badge-count]:!bg-blue-100
              [&_.ant-badge-count]:!text-blue-700
              [&_.ant-badge-count]:!shadow-none
            "
          />
        )}
      </div>
    ),
  }));

  const bottomMenuItems = bottomNav.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }));

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    setHeader(pageHeaders[key]);
    navigate(`/manager-home/${key}`);
  };

  return (
    <Sider
      collapsed={collapsed}
      collapsedWidth={68}
      width={248}
      breakpoint="md"
      trigger={null}
      className="!h-screen !border-r !border-slate-200 !bg-white"
    >
      <div className="flex h-full flex-col">
        <div
          className={`
            flex h-16 shrink-0 items-center border-b border-slate-100
            ${collapsed ? "justify-center px-2" : "px-5"}
          `}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-xl bg-blue-600 text-white
              "
            >
              <Zap size={19} fill="currentColor" />
            </div>

            {!collapsed && (
              <span className="text-lg font-bold tracking-tight text-slate-900">
                WorkPulse
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {!collapsed && (
            <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Main Menu
            </div>
          )}

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={handleMenuClick}
            inlineCollapsed={collapsed}
            className="
              !border-none
              [&_.ant-menu-item]:!mb-1
              [&_.ant-menu-item]:!h-10
              [&_.ant-menu-item]:!rounded-lg
              [&_.ant-menu-item]:!px-3
              [&_.ant-menu-item]:!text-slate-600
              [&_.ant-menu-item-selected]:!bg-blue-50
              [&_.ant-menu-item-selected]:!text-blue-600
              [&_.ant-menu-item:hover]:!bg-slate-50
            "
          />

          {!collapsed && (
            <div className="mb-2 mt-7 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Other
            </div>
          )}

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={bottomMenuItems}
            onClick={handleMenuClick}
            inlineCollapsed={collapsed}
            className="
              !border-none
              [&_.ant-menu-item]:!mb-1
              [&_.ant-menu-item]:!h-10
              [&_.ant-menu-item]:!rounded-lg
              [&_.ant-menu-item]:!px-3
              [&_.ant-menu-item]:!text-slate-600
              [&_.ant-menu-item-selected]:!bg-blue-50
              [&_.ant-menu-item-selected]:!text-blue-600
              [&_.ant-menu-item:hover]:!bg-slate-50
            "
          />
        </div>

        <div className="shrink-0 border-t border-slate-100 p-3">
          <Tooltip
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            placement="right"
          >
            <Button
              type="text"
              onClick={() => setCollapsed(!collapsed)}
              className="
                !flex !h-10 !w-full !items-center
                !justify-center !rounded-lg
                !text-slate-500
                hover:!bg-slate-100
              "
            >
              <ChevronLeft
                size={18}
                className={`transition-transform ${
                  collapsed ? "rotate-180" : ""
                }`}
              />

              {!collapsed && (
                <span className="ml-2 text-sm">Collapse sidebar</span>
              )}
            </Button>
          </Tooltip>
        </div>
      </div>
    </Sider>
  );
}
