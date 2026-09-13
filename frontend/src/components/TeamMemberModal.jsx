import { useEffect, useRef, useState } from "react";
import {
  CloseOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Modal, Input, Select, Button, Alert, Checkbox } from "antd";
import { updateUserRoleService } from "../services/TeamService";

export default function TeamMemberModal({
  open,
  onClose,
  onSaved,
  departments,
  projects,
  editingMember,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("active");
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const nameRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    if (editingMember) {
      setName(editingMember.name || "");
      setEmail(editingMember.email || "");
      setRole(editingMember.role || "");
      setDepartment(editingMember.department || "");
      setStatus(editingMember.status || "active");
      setSelectedProjects(
        editingMember.projects?.map((project) => project.id) || []
      );
    } else {
      setName("");
      setEmail("");
      setRole("");
      setDepartment("");
      setStatus("active");
      setSelectedProjects([]);
    }

    setError(null);
    setNameTouched(false);
    setEmailTouched(false);

    setTimeout(() => {
      nameRef.current?.focus();
    }, 100);
  }, [open, editingMember]);

  const nameError =
    nameTouched && name.trim().length === 0
      ? "Name is required"
      : null;

  const emailError =
    emailTouched && email.trim().length === 0
      ? "Email is required"
      : emailTouched &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Please enter a valid email"
      : null;

  const toggleProject = (id) => {
    setSelectedProjects((prev) =>
      prev.includes(id)
        ? prev.filter((projectId) => projectId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setNameTouched(true);
    setEmailTouched(true);

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name.trim() || !email.trim() || !validEmail) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const input = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: role.trim(),
        department: department || null,
        status,
        project_ids: selectedProjects,
      };

      if (editingMember) {
        await updateUserRoleService(editingMember.id, input);
      } else {
        await updateUserRoleService(input);
      }

      onSaved();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to save team member";

      setError(
        message.includes("unique") || message.includes("duplicate")
          ? "A member with this email already exists"
          : message
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
          {editingMember
            ? "Edit Team Member"
            : "Add New Team Member"}
        </h3>

        <p className="mb-0 text-sm text-slate-500">
          {editingMember
            ? "Update member details and project assignments"
            : "Create a new team member profile and assign projects"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="pt-5">
        {error && (
          <Alert
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
            message={error}
            className="mb-5"
          />
        )}

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Full Name <span className="text-red-500">*</span>
            </label>

            <Input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setNameTouched(true)}
              placeholder="e.g. Sarah Chen"
              status={nameError ? "error" : ""}
              size="large"
              className="w-full"
            />

            {nameError && (
              <p className="mt-1.5 mb-0 text-sm text-red-600">
                {nameError}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Email <span className="text-red-500">*</span>
            </label>

            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              placeholder="sarah.chen@workpulse.internal"
              status={emailError ? "error" : ""}
              size="large"
              className="w-full"
            />

            {emailError && (
              <p className="mt-1.5 mb-0 text-sm text-red-600">
                {emailError}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Role
            </label>

            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              size="large"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Department / Team
            </label>

            <Select
              value={department || undefined}
              onChange={(value) => setDepartment(value || "")}
              placeholder="Select a department"
              size="large"
              className="w-full"
              allowClear
              options={departments.map((departmentItem) => ({
                value: departmentItem.name,
                label: departmentItem.name,
              }))}
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Account Status
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStatus("active")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all sm:max-w-[200px] ${
                status === "active"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <CheckOutlined />
              Active
            </button>

            <button
              type="button"
              onClick={() => setStatus("inactive")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all sm:max-w-[200px] ${
                status === "inactive"
                  ? "border-slate-400 bg-slate-100 text-slate-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <CloseOutlined />
              Inactive
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Assigned Projects
          </label>

          <p className="mb-3 text-sm text-slate-400">
            Select which projects this member belongs to
          </p>

          {projects.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
              No projects available. Create projects first.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {projects.map((project) => {
                const selected = selectedProjects.includes(project.id);

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => toggleProject(project.id)}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="mb-0 truncate text-sm font-medium text-slate-800">
                        {project.name}
                      </p>

                      <p className="mb-0 text-xs capitalize text-slate-400">
                        {project.status}
                      </p>
                    </div>

                    <Checkbox
                      checked={selected}
                      onChange={() => toggleProject(project.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
          <Button
            type="default"
            size="large"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={saving}
            className="bg-blue-600"
          >
            {editingMember ? "Save Changes" : "Add Member"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}