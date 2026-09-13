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
import { createProjectService } from "../services/ProjectService";

const { Text } = Typography;
const { TextArea } = Input;

export default function ProjectModal({
  open,
  onClose,
  teamMembers = [],
  editingProject,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const getInitials = (firstName = "", lastName = "") => {
    const first = firstName.trim();
    const last = lastName.trim();

    if (first && last) {
      return `${first[0]}${last[0]}`.toUpperCase();
    }

    if (first) {
      return first.slice(0, 2).toUpperCase();
    }

    if (last) {
      return last.slice(0, 2).toUpperCase();
    }

    return "?";
  };

  useEffect(() => {
    if (editingProject && open) {
      form.setFieldsValue({
        name: editingProject.name,
        description: editingProject.description,
        team_member_ids:
          editingProject.teamMembers?.map((member) =>
            typeof member === "string" ? member : member._id,
          ) || [],
      });
    } else if (!editingProject && open) {
      form.resetFields();

      form.setFieldsValue({
        team_member_ids: [],
      });
    }
  }, [editingProject, open, form]);

  const handleFinish = async (values) => {
    setLoading(true);

    try {
      const input = {
        name: values.name.trim(),
        description: values.description.trim(),
        teamMembers: values.team_member_ids || [],
      };

      const response = await createProjectService(input);

      if (response.success) {
        message.success(
          editingProject
            ? "Project updated successfully"
            : "Project created successfully",
        );

        form.resetFields();
        onClose();
      } else {
        message.error(response.message || "Failed to create project");
      }
    } catch (error) {
      message.error(
        error.message || "Something went wrong while creating the project",
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div>
          <Typography.Title
            level={5}
            style={{
              margin: 0,
              color: "#0f172a",
              fontWeight: 700,
            }}
          >
            {editingProject ? "Edit Project" : "Add New Project"}
          </Typography.Title>

          <Text type="secondary" style={{ fontSize: 14 }}>
            {editingProject
              ? "Update project details and team assignments"
              : "Create a new project and assign team members"}
          </Text>
        </div>

        <Button
          type="text"
          onClick={handleClose}
          icon={<X size={20} />}
          style={{
            width: 36,
            height: 36,
            minWidth: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            borderRadius: 8,
          }}
        />
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          team_member_ids: [],
        }}
        style={{
          maxHeight: "calc(90vh - 82px)",
          overflowY: "auto",
          padding: "20px 24px",
        }}
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
            }
          ]}
        >
          <TextArea
            rows={3}
            placeholder="Brief description of the project scope and goals..."
            style={{
              resize: "none",
            }}
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
              <div style={{ marginBottom: 24 }}>
                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  Selected Team Members
                </Text>

                <Row gutter={[8, 8]}>
                  {selectedTeamMembers.map((member) => (
                    <Col xs={24} sm={12} key={member._id}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 12px",
                          border: "1px solid #bfdbfe",
                          background: "#eff6ff",
                          borderRadius: 8,
                        }}
                      >
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

                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <Text
                            ellipsis
                            style={{
                              display: "block",
                              fontWeight: 600,
                            }}
                          >
                            {member.firstName} {member.lastName}
                          </Text>

                          <Text
                            type="secondary"
                            ellipsis
                            style={{
                              display: "block",
                              fontSize: 12,
                            }}
                          >
                            {member.role || "Team Member"}
                          </Text>
                        </div>

                        <Check size={16} color="#2563eb" />
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            );
          }}
        </Form.Item>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            paddingTop: 20,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <Button
            onClick={handleClose}
            size="large"
            disabled={loading}
            style={{
              borderRadius: 8,
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            style={{
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            {editingProject ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
