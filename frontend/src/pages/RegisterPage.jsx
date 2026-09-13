import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  User,
  BarChart3,
  Users,
  CalendarCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Form, Input, Checkbox, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { userSignUpService } from "../services/UserService";
import {
  PASSWORD_RULES,
  passwordFieldValidation,
} from "../helpers/PasswordValidation";
import { emailFieldValidation } from "../helpers/EmailValidation";
const features = [
  {
    icon: CalendarCheck,
    text: "Submit weekly reports in minutes",
  },
  {
    icon: BarChart3,
    text: "Track team progress with live dashboards",
  },
  {
    icon: Users,
    text: "Keep everyone aligned and accountable",
  },
  {
    icon: ShieldCheck,
    text: "Secure, role-based access for your team",
  },
];

export default function RegisterPage({ onNavigateLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const password = Form.useWatch("password", form);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await userSignUpService(values);
      if (response.success) {
        console.log("Registration successful:", response);
        navigate("/login");
      } else {
        console.error("Registration failed:", response.message);
      }
      console.log("Registration values:", values);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 lg:flex">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute right-20 top-1/3">
          <div className="relative h-32 w-32">
            <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-pulse" />

            <div className="absolute inset-0 scale-75 rounded-full border-2 border-blue-400/20 animate-pulse" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-blue-500/30 backdrop-blur-sm" />
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>

            <span className="text-xl font-bold text-white">WorkPulse</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Join your team
            <br />
            <span className="text-blue-400">on WorkPulse.</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Create your account to start submitting weekly reports, tracking
            team progress, and staying aligned with your colleagues.
          </p>

          <div className="mt-10 space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-blue-400" strokeWidth={2} />
                  </div>

                  <span className="text-sm text-slate-200">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8">
          <div>
            <div className="text-2xl font-bold text-white">12k+</div>

            <p className="mt-1 text-xs text-slate-400">Teams onboarded</p>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div>
            <div className="text-2xl font-bold text-white">98%</div>

            <p className="mt-1 text-xs text-slate-400">
              Report submission rate
            </p>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div>
            <div className="text-2xl font-bold text-white">4.9/5</div>

            <p className="mt-1 text-xs text-slate-400">User satisfaction</p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>

              <span className="text-xl font-bold text-slate-900">
                WorkPulse
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateLogin}
            className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </button>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Get started with WorkPulse in just a few steps.
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleSubmit}
            className="mt-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="firstName"
                className="!mb-4"
                rules={[{ required: true, message: "First name is required!" }]}
              >
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    First Name
                  </label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="firstName"
                      placeholder="Jane"
                      className="!h-[42px] !rounded-lg !border-slate-300 !pl-10 !text-sm"
                      maxLength={50}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </Form.Item>

              <Form.Item
                name="lastName"
                className="!mb-4"
                rules={[{ required: true, message: "Last name is required!" }]}
              >
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Last Name
                  </label>

                  <Input
                    id="lastName"
                    placeholder="Smith"
                    autoComplete="off"
                    className="!h-[42px] !rounded-lg !border-slate-300 !px-3 !text-sm"
                    maxLength={50}
                  />
                </div>
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              className="!mb-4"
              rules={[
                {
                  validator: emailFieldValidation,
                },
              ]}
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Work Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="!h-[42px] !rounded-lg !border-slate-300 !pl-10 !text-sm"
                  />
                </div>
              </div>
            </Form.Item>

            <Form.Item
              name="password"
              className="!mb-4"
              rules={[
                {
                  validator: passwordFieldValidation,
                },
              ]}
            >
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="!h-[42px] !rounded-lg !border-slate-300 !pl-10 !pr-10 !text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {password && (
                  <ul className="mt-2.5 space-y-1">
                    {PASSWORD_RULES.map((rule, index) => {
                      const passed = rule.test(password);

                      return (
                        <li key={index} className="flex items-center gap-1.5">
                          {passed ? (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                          )}

                          <span
                            className={`text-xs ${
                              passed ? "text-green-600" : "text-slate-400"
                            }`}
                          >
                            {rule.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              className="!mb-4"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Confirm password is required!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    className="!h-[42px] !rounded-lg !border-slate-300 !pl-10 !pr-10 !text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </Form.Item>

            <Form.Item
              name="agreeToTerms"
              valuePropName="checked"
              className="!mb-4"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "You must agree to the Terms of Service and Privacy Policy!",
                          ),
                        ),
                },
              ]}
            >
              <label className="flex cursor-pointer items-start gap-2.5">
                <Checkbox />

                <span className="text-sm text-slate-600">
                  I agree to the
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </a>
                  and
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            </Form.Item>

            <Form.Item className="!mb-0">
              <Button
                htmlType="submit"
                loading={loading}
                className="!flex !h-auto !w-full !items-center !justify-center !gap-2 !rounded-lg !border-0 !bg-blue-600 !px-4 !py-2.5 !text-sm !font-semibold !text-white !shadow-sm hover:!bg-blue-700"
                disabled={loading}
              >
                {loading ? "Creating..." : " Create Account"}

                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Button>
            </Form.Item>
          </Form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              Sign in
            </button>
          </p>

          <p className="mt-8 text-center text-xs text-slate-400">
            © 2026 WorkPulse. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
