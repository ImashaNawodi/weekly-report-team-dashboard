import {
  MoreOutlined,
  EditOutlined,
  StopOutlined,
} from "@ant-design/icons";

import { Button, Dropdown } from "antd";

export default function TeamMemberRow({
  member,
  onToggleStatus,
  onEdit,
  toggling,
}) {
  const menuItems = [
    /* {
      key: "Profile",
      label: "View Profile",
      icon: <FileTextOutlined />,
      onClick: () => {
        onViewProfile(member);
      },
    }, */

    {
      key: "edit",
      label: "Assign Role",
      icon: <EditOutlined />,
      onClick: () => {
        onEdit(member);
      },
    },

    {
      key: "status",
      label: member.isActive ? "Deactivate" : "Activate",

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
