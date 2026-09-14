import { Pencil, Trash2, Power, Eye, MoreVertical } from "lucide-react";
import { Dropdown, Button } from "antd";

export default function ProjectRow({
  project,
  onEdit,
  onToggleStatus,
  onView,
}) {
  const menuItems = [
    {
      key: "view",
      icon: <Eye size={16} />,
      label: "View Project",
    },
    {
      key: "edit",
      icon: <Pencil size={16} />,
      label: "Edit",
    },
    {
      key: "toggle",
      icon: <Power size={16} />,
      label: project.isActive ? "Deactivate" : "Activate",
    },
    {
      type: "divider",
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "view") {
      onView(project);
    }

    if (key === "edit") {
      onEdit(project);
    }

    if (key === "toggle") {
      onToggleStatus(project);
    }
  };

  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: handleMenuClick,
      }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Button
        type="text"
        aria-label="Project actions"
        icon={<MoreVertical size={16} />}
        style={{
          width: 32,
          height: 32,
          minWidth: 32,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          borderRadius: 8,
        }}
      />
    </Dropdown>
  );
}
