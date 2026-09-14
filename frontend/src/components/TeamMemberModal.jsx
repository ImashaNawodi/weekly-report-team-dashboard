import { useEffect, useRef, useState } from "react";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Modal, Input, Button, Form, Select } from "antd";
import { updateUserRoleService } from "../services/TeamService";

export default function TeamMemberModal({
  open,
  onClose,
  editingMember,
  onSaved,
}) {
  const [form] = Form.useForm();
  const [status, setStatus] = useState("active");
  const [saving, setSaving] = useState(false);

  const nameRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    if (editingMember) {
      form.setFieldsValue({
        name: `${editingMember.firstName || ""} ${
          editingMember.lastName || ""
        }`.trim(),
        email: editingMember.email || "",
        role: editingMember.role || "",
      });

      setStatus(editingMember.isActive ? "active" : "inactive");
    } else {
      form.resetFields();
      setStatus("active");
    }

    setTimeout(() => {
      nameRef.current?.focus();
    }, 100);
  }, [open, editingMember, form]);

  const handleSubmit = async (values) => {
    if (!editingMember) {
      return;
    }

    setSaving(true);

    try {
      const userAccountID = editingMember?._id || editingMember?._id;

      const result = await updateUserRoleService(userAccountID, values.role);
      if (!result.success) {
        console.error(result.message);
        return;
      }

      await onSaved();
      onClose();
    } catch (err) {
      console.error(
        err instanceof Error ? err.message : "Failed to update team member",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
      centered
      destroyOnClose={false}
      closeIcon={<CloseOutlined className="text-slate-400" />}
    >
      <div className="border-b border-slate-200 pb-4">
        <h3 className="mb-1 text-lg font-bold text-slate-900">
          Edit Team Member
        </h3>

        <p className="mb-0 text-sm text-slate-500">Update the member's role</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="pt-5"
        requiredMark={false}
      >
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Form.Item
            name="name"
            label={
              <span className="text-sm font-semibold text-slate-700">
                Full Name
              </span>
            }
            rules={[
              {
                required: true,
                message: "Full name is required",
              },
            ]}
            className="mb-0"
          >
            <Input
              ref={nameRef}
              size="large"
              disabled={!!editingMember}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <span className="text-sm font-semibold text-slate-700">
                Email
              </span>
            }
            rules={[
              {
                required: true,
                message: "Email is required",
              },
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
            className="mb-0"
          >
            <Input
              type="email"
              size="large"
              disabled={!!editingMember}
              className="w-full"
            />
          </Form.Item>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Form.Item
            name="role"
            label={
              <span className="text-sm font-semibold text-slate-700">Role</span>
            }
            rules={[
              {
                required: true,
                message: "Please select a role",
              },
            ]}
            className="mb-0"
          >
            <Select
              size="large"
              placeholder="Select a role"
              className="w-full"
              options={[
                {
                  label: "Team Member",
                  value: "TEAM_MEMBER",
                },
                {
                  label: "Manager",
                  value: "MANAGER",
                },
              ]}
            />
          </Form.Item>
        </div>

        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Account Status
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={!!editingMember}
              onClick={() => setStatus("active")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all sm:max-w-[200px] ${
                status === "active"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              } ${editingMember ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <CheckOutlined />
              Active
            </button>

            <button
              type="button"
              disabled={!!editingMember}
              onClick={() => setStatus("inactive")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all sm:max-w-[200px] ${
                status === "inactive"
                  ? "border-slate-400 bg-slate-100 text-slate-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              } ${editingMember ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <CloseOutlined />
              Inactive
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
          <Button type="default" size="large" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={saving}
            className="bg-blue-600"
          >
            {editingMember ? "Update Role" : "Save Changes"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
