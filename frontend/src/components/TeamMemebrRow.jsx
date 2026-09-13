import React from "react";

import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  StopOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import {
  Button,
  Dropdown,
} from "antd";

export default function TeamMemberRow({
  member,
  onToggleStatus,
  onEdit,
  onViewProfile,
  onViewReports,
  toggling,
}) {
  const menuItems = [
   
    {
      key: "reports",
      label: "View Reports",
      icon: <FileTextOutlined />,
      onClick: () => {
        onViewReports(member);
      },
    },

    /* {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => {
        onEdit(member);
      },
    }, */

    {
      key: "status",
      label: member.isActive
        ? "Deactivate"
        : "Activate",

      icon: <StopOutlined />,

      disabled: toggling,

      onClick: () => {
        onToggleStatus(member);
      },
    },
  ];

  return (
    <Dropdown
      menu={{
        items: menuItems,
      }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Button
        type="text"
        icon={<MoreOutlined />}
        loading={toggling}
        className="flex items-center justify-center"
      />
    </Dropdown>
  );
}