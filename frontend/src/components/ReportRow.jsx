import { Eye, Pencil, MoreVertical, Send } from "lucide-react";
import { Dropdown, Button, Modal, message } from "antd";

export default function ReportRow({
  report,
  onEdit,
  onView,
  onSend,
}) {
  const isDraft = report.status === "DRAFT";
  const isNeedCorrection = report.status === "NEEDS_CORRECTION";

  const menuItems = [
    {
      key: "view",
      icon: <Eye size={16} />,
      label: "View Report",
    },

   ...(
  isDraft || isNeedCorrection
    ? [
        {
          key: "edit",
          icon: <Pencil size={16} />,
          label: "Edit Report",
        },
        {
          key: "send",
          icon: <Send size={16} />,
          label: "Send to Manager",
        },
      ]
    : []
),
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "view") {
      onView(report);
      return;
    }

    if (key === "edit") {
      onEdit(report);
      return;
    }

    if (key === "send") {
      handleSendReport();
    }
  };

  const handleSendReport = () => {
    Modal.confirm({
      title: "Send report to manager?",
      content:
        "Once submitted, this report will be sent to your manager for review. You will no longer be able to edit it until it is returned for correction.",
      okText: "Send Report",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: {
        className: "!bg-blue-600",
      },

      onOk: async () => {
        try {
          if (!onSend) {
            throw new Error("Submit action is not configured");
          }

          await onSend(report);

          message.success(
            "Report sent to manager successfully"
          );
        } catch (error) {
          message.error(
            error?.message ||
              "Failed to send report"
          );

          throw error;
        }
      },
    });
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
        aria-label="Report actions"
        icon={<MoreVertical size={16} />}
        className="!flex !h-8 !w-8 !min-w-8 items-center justify-center !rounded-lg !text-slate-400 hover:!bg-slate-100 hover:!text-slate-700"
      />
    </Dropdown>
  );
}