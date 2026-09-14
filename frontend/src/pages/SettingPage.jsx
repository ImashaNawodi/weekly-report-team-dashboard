import { useContext, useEffect, useState } from "react";
import {
  UserOutlined,
  MailOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Spin,
  Typography,
  message,
  notification,
} from "antd";
import { AuthContext } from "../context/AuthContext";
import { updateUserProfileService } from "../services/TeamService";

const { Title, Text } = Typography;

export default function SettingsPage() {
  const { user, setUser, authLoading } = useContext(AuthContext);

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      form.setFieldsValue({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });

      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, authLoading, form]);

const handleSave = async (values) => {
  try {
    setSaving(true);

    const response = await updateUserProfileService({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
    });

    if (!response.success) {
      throw new Error(response.message || "Failed to update settings");
    }

    setUser(response.user);
    setLastUpdated(new Date());

    notification.success({
      message: "Settings saved successfully",
      placement: "bottomRight",
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    notification.error({
      message: error.message || "Could not save your settings",
      placement: "bottomRight",
    });
  } finally {
    setSaving(false);
  }
};
  if (loading || authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <Alert
          message="User information unavailable"
          description="Please log in again to access your settings."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
   <div className="flex min-h-full w-full items-center justify-center p-4 sm:p-6 lg:p-10">
  <Card
    className="w-full max-w-3xl overflow-hidden rounded-xl border-slate-200 shadow-sm"
    styles={{
      body: {
        padding: 0,
      },
    }}
  >
    <div className="border-b border-slate-100 px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UserOutlined className="text-base" />
          </div>

          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-slate-900">
              Personal Information
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Your name and email are used across your reports
            </p>
          </div>
        </div>

        <div
          className={`flex w-fit shrink-0 items-center gap-3 rounded-xl border px-3.5 py-2 ${
            user.role === "MANAGER"
              ? "border-violet-100 bg-violet-50"
              : "border-blue-100 bg-blue-50"
          }`}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              user.role === "MANAGER"
                ? "bg-violet-100 text-violet-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            <UserOutlined className="text-sm" />
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Account Role
            </p>

            <p
              className={`mt-0.5 text-sm font-semibold ${
                user.role === "MANAGER"
                  ? "text-violet-700"
                  : "text-blue-700"
              }`}
            >
              {user.role === "MANAGER" ? "Manager" : "Team Member"}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="px-4 py-6 sm:px-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        requiredMark={false}
        validateTrigger="onBlur"
      >
        <Row gutter={[20, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "First name is required",
                },
                {
                  min: 2,
                  message: "First name must be at least 2 characters",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your first name"
                className="!rounded-lg"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Last name is required",
                },
                {
                  min: 2,
                  message: "Last name must be at least 2 characters",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your last name"
                className="!rounded-lg"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Email is required",
            },
            {
              type: "email",
              message: "Enter a valid email address",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<MailOutlined className="text-slate-400" />}
            placeholder="you@example.com"
            className="!rounded-lg"
          />
        </Form.Item>

        <div className="flex items-center justify-center pt-2">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={saving}
            icon={!saving && <SaveOutlined />}
            className="!rounded-lg"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Form>
    </div>
  </Card>
</div>
  );
}
