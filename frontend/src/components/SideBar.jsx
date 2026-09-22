import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Zap,
  LogOut,
} from "lucide-react";
import { Layout, Menu, Button, Badge, Tooltip } from "antd";
import { AuthContext } from "../context/AuthContext";
import { bottomNav, mainNav, pageHeaders } from "../helpers/SideBarOptions";

const { Sider } = Layout;

export default function Sidebar({ setHeader }) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const role = user?.role;

  const filteredMainNav = useMemo(() => {
    return mainNav.filter((item) => item.roles.includes(role));
  }, [role]);

  const filteredBottomNav = useMemo(() => {
    return bottomNav.filter((item) => item.roles.includes(role));
  }, [role]);

  const menuItems = filteredMainNav.map((item) => ({
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

  const bottomMenuItems = filteredBottomNav.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }));

  const handleMenuClick = ({ key }) => {
    const allowedItem = [...filteredMainNav, ...filteredBottomNav].find(
      (item) => item.key === key
    );

    if (!allowedItem) {
      return;
    }

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

          {!collapsed && filteredBottomNav.length > 0 && (
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
          <Tooltip title={collapsed ? "Logout" : ""} placement="right">
            <Button
              type="text"
              danger
              onClick={handleLogout}
              className="
                !mb-2 !flex !h-10 !w-full !items-center
                !justify-start !rounded-lg !px-3
                !text-red-500
                hover:!bg-red-50
                hover:!text-red-600
              "
            >
              <LogOut size={18} />

              {!collapsed && (
                <span className="ml-2 text-sm font-medium">Logout</span>
              )}
            </Button>
          </Tooltip>

          <Tooltip
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            placement="right"
          >
            <Button
              type="text"
              onClick={() => setCollapsed(!collapsed)}
              className="
                !flex !h-10 !w-full !items-center
                !justify-end !rounded-lg
                !text-slate-500
                hover:!bg-slate-100
              "
            >
              <div className="flex items-center -space-x-2">
                <ChevronLeft
                  size={18}
                  className={`transition-transform ${
                    collapsed ? "rotate-180" : ""
                  }`}
                />
                <ChevronLeft
                  size={18}
                  className={`transition-transform ${
                    collapsed ? "rotate-180" : ""
                  }`}
                />
              </div>
            </Button>
          </Tooltip>
        </div>
      </div>
    </Sider>
  );
}