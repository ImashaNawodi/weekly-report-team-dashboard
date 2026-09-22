import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";
const mainNav = [

  {
    key: "managerDashboard",
    label: "Manager Dashboard",
    icon: <LayoutDashboard size={18} />,
    roles: ["MANAGER"],
  },
  {
    key: "projects",
    label: "Projects",
    icon: <FolderKanban size={18} />,
    roles: ["MANAGER"],
  },
  {
    key: "team",
    label: "Team Members",
    icon: <Users size={18} />,
    roles: ["ADMIN"],
  },
  {
    key: "reports",
    label: "Weekly Reports",
    icon: <FileText size={18} />,
    roles: ["TEAM_MEMBER"],
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: <BarChart3 size={18} />,
    roles: ["MANAGER"],
  },
];

const bottomNav = [
  {
    key: "settings",
    label: "Settings",
    icon: <Settings size={18} />,
    roles: ["MANAGER", "TEAM_MEMBER","ADMIN"],
  },
  {
    key: "help",
    label: "Help & Support",
    icon: <HelpCircle size={18} />,
    roles: ["MANAGER", "TEAM_MEMBER","ADMIN"],
  },
];

const pageHeaders = {

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

export { mainNav, bottomNav, pageHeaders };