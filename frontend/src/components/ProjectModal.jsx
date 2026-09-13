import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Avatar,
  Row,
  Col,
  message,
} from "antd";
import {
  createProjectService,
  updateProjectService,
} from "../services/ProjectService";
import getInitials from "../helpers/ProfileName";

const { Text } = Typography;
const { TextArea } = Input;

export default function ProjectModal({
  open,
  onClose,
  onSuccess,
  teamMembers = [],
  editingProject,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (editingProject) {
      form.setFieldsValue({
        name: editingProject.name || "",
        description: editingProject.description || "",
        team_member_ids:
          editingProject.teamMembers?.map((member) =>
            typeof member === "string" ? member : member._id,
          ) || [],
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        name: "",
        description: "",
        team_member_ids: [],
      });
    }
  }, [editingProject, open, form]);

  const handleFinish = async (values) => {
    setLoading(true);

    try {
      const projectData = {
        name: values.name?.trim() || "",
        description: values.description?.trim() || "",
        teamMembers: values.team_member_ids || [],
      };

      let response;

      if (editingProject) {
        response = await updateProjectService(
          editingProject.projectID,
          projectData,
        );
      } else {
        response = await createProjectService(projectData);
      }

      if (response.success) {
        message.success(
          editingProject
            ? "Project updated successfully"
            : "Project created successfully",
        );

        onSuccess?.(response.data);

        form.resetFields();
        onClose();
      } else {
        message.error(
          response.message ||
            (editingProject
              ? "Failed to update project"
              : "Failed to create project"),
        );
      }
    } catch (error) {
      message.error(
        error.message ||
          (editingProject
            ? "Something went wrong while updating the project"
            : "Something went wrong while creating the project"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      centered
      width={672}
      footer={null}
      closable={false}
      maskClosable
      keyboard
      styles={{
        content: {
          padding: 0,
          borderRadius: 16,
          overflow: "hidden",
        },
        mask: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
        },
      }}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <Typography.Title
            level={5}
            className="!m-0 !font-bold !text-slate-900"
          >
            {editingProject ? "Edit Project" : "Add New Project"}
          </Typography.Title>

          <Text type="secondary" className="!text-sm">
            {editingProject
              ? "Update project details and team assignments"
              : "Create a new project and assign team members"}
          </Text>
        </div>

        <Button
          type="text"
          onClick={handleClose}
          icon={<X size={20} />}
          className="flex !h-9 !w-9 !min-w-9 items-center justify-center !rounded-lg !text-slate-400"
        />
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          team_member_ids: [],
        }}
        className="max-h-[calc(90vh-82px)] overflow-y-auto px-6 py-5"
      >
        <Form.Item
          label="Project Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Project name is required",
            },
          ]}
        >
          <Input
            placeholder="e.g. Customer Portal Redesign"
            size="large"
            maxLength={100}
            minLength={2}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Project description is required",
            },
          ]}
        >
          <TextArea
            rows={3}
            placeholder="Brief description of the project scope and goals..."
            className="resize-none"
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="Assign Team Members"
          name="team_member_ids"
          rules={[
            {
              required: true,
              message: "At least one team member is required",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select team members"
            size="large"
            optionFilterProp="label"
            options={teamMembers.map((member) => ({
              value: member._id,
              label: `${member.firstName ?? ""} ${
                member.lastName ?? ""
              }`.trim(),
            }))}
          />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.team_member_ids !== currentValues.team_member_ids
          }
        >
          {({ getFieldValue }) => {
            const selectedIds = getFieldValue("team_member_ids") || [];

            const selectedTeamMembers = teamMembers.filter((member) =>
              selectedIds.includes(member._id),
            );

            if (selectedTeamMembers.length === 0) {
              return null;
            }

            return (
              <div className="mb-6">
                <Text type="secondary" className="mb-2.5 !block">
                  Selected Team Members
                </Text>

                <Row gutter={[8, 8]}>
                  {selectedTeamMembers.map((member) => (
                    <Col xs={24} sm={12} key={member._id}>
                      <div className="flex items-center gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5">
                        <Avatar
                          size={32}
                          style={{
                            backgroundColor: member.avatar_color || "#64748b",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {getInitials(member.firstName, member.lastName)}
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <Text
                            ellipsis
                            className="!block !font-semibold !text-slate-800"
                          >
                            {member.firstName} {member.lastName}
                          </Text>

                          <Text
                            type="secondary"
                            ellipsis
                            className="!block !text-xs"
                          >
                            {member.role || "Team Member"}
                          </Text>
                        </div>

                        <Check size={16} className="text-blue-600" />
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            );
          }}
        </Form.Item>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Button
            onClick={handleClose}
            size="large"
            disabled={loading}
            className="!rounded-lg !font-medium"
          >
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="!rounded-lg !font-semibold"
          >
            {editingProject ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
