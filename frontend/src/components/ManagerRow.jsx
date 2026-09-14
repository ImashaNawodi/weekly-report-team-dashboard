import { Eye, MoreVertical, CheckCircle, RotateCcw } from "lucide-react";

import { Dropdown, Button, Modal, Input, message } from "antd";

export default function ManagerRow({ report, onView, onApprove, onSendBack }) {
  const [modal, modalContextHolder] = Modal.useModal();

  const isSubmitted = report.status === "SUBMITTED";

  const menuItems = [
    {
      key: "view",
      icon: <Eye size={16} />,
      label: "View Report",
    },

    ...(isSubmitted
      ? [
          {
            type: "divider",
          },
          {
            key: "approve",
            icon: <CheckCircle size={16} />,
            label: "Approve Report",
          },
          {
            key: "send-back",
            icon: <RotateCcw size={16} />,
            label: "Send Back for Correction",
          },
        ]
      : []),
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "view") {
      onView?.(report);
      return;
    }

    if (key === "approve") {
      handleApprove();
      return;
    }

    if (key === "send-back") {
      handleSendBack();
    }
  };

  const handleApprove = () => {
    modal.confirm({
      title: "Approve Report?",
      content:
        "Are you sure you want to approve this report? The team member will no longer be able to edit it unless it is sent back for correction.",
      okText: "Approve",
      cancelText: "Cancel",
      centered: true,

      okButtonProps: {
        className: "!bg-green-600",
      },

      onOk: async () => {
        try {
          if (!onApprove) {
            throw new Error("Approve action is not configured");
          }

          await onApprove(report);

          message.success("Report approved successfully");
        } catch (error) {
          message.error(error?.message || "Failed to approve report");

          throw error;
        }
      },
    });
  };

  const handleSendBack = () => {
    let managerFeedback = "";

    modal.confirm({
      title: "Send Back for Correction",

      width: 500,

      content: (
        <div className="mt-4">
          <p className="mb-2 text-sm text-slate-600">
            Please provide the reason why this report needs correction.
          </p>

          <Input.TextArea
            rows={4}
            placeholder="Enter correction instructions..."
            onChange={(e) => {
              managerFeedback = e.target.value;
            }}
          />
        </div>
      ),

      okText: "Send Back",
      cancelText: "Cancel",
      centered: true,

      okButtonProps: {
        className: "!bg-orange-500",
      },

      onOk: async () => {
        if (!managerFeedback.trim()) {
          message.warning("Please provide a correction reason");

          return Promise.reject();
        }

        try {
          if (!onSendBack) {
            throw new Error("Correction action is not configured");
          }

          await onSendBack(report, managerFeedback.trim());

          message.success("Report sent back for correction");
        } catch (error) {
          message.error(error?.message || "Failed to send report back");

          throw error;
        }
      },
    });
  };

  return (
    <>
      {modalContextHolder}

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
          className="
            !flex
            !h-8
            !w-8
            !min-w-8
            items-center
            justify-center
            !rounded-lg
            !text-slate-400
            hover:!bg-slate-100
            hover:!text-slate-700
          "
        />
      </Dropdown>
    </>
  );
}
