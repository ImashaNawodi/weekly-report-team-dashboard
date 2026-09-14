import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Users,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";
import { Form, Input, Button, Checkbox, Alert, Typography } from "antd";
import WorkPulseLogo from "../components/WorkPlusLogo";
import { userSignInService } from "../services/AuthService";
import { emailFieldValidation } from "../helpers/EmailValidation";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await userSignInService(values);
      if (response.success) {
        console.log("Login successful:", response);
        navigate("/manager-home/dashboard");
      } else {
        console.error("Login failed:", response.message);
      }
      console.log("Login values:", values);
    } catch (error) {
      console.error("Login error:", error);
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

            <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-pulse" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-blue-500/30 backdrop-blur-sm" />
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <WorkPulseLogo variant="light" iconSize={28} />
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Weekly reporting,
            <br />
            <span className="text-blue-400">simplified for teams.</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-slate-300">
            WorkPulse helps your team track progress, surface blockers, and stay
            aligned — all in one clean, professional workspace.
          </p>

          <div className="mt-10 space-y-4">
            {[
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
            ].map((feature, index) => {
              const FeatureIcon = feature.icon;

              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                    <FeatureIcon
                      className="h-4 w-4 text-blue-400"
                      strokeWidth={2}
                    />
                  </div>

                  <span className="text-sm text-slate-200">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8">
          <div>
            <div className="flex items-center gap-1.5 text-2xl font-bold text-white">
              <TrendingUp className="h-5 w-5 text-blue-400" strokeWidth={2.5} />
              98%
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Report submission rate
            </p>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div>
            <div className="text-2xl font-bold text-white">12k+</div>

            <p className="mt-1 text-xs text-slate-400">Teams onboarded</p>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div>
            <div className="text-2xl font-bold text-white">4.9/5</div>

            <p className="mt-1 text-xs text-slate-400">User satisfaction</p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <WorkPulseLogo iconSize={28} />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to your WorkPulse account to continue.
            </p>

            <Form
              layout="vertical"
              className="mt-6"
              requiredMark={true}
              onFinish={handleSubmit}
            >
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
                rules={[{ required: true, message: "Password is required!" }]}
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
                      placeholder="Enter your password"
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
                </div>
              </Form.Item>

              <div className="mb-5 flex items-center justify-between">
                <Checkbox>
                  <span className="text-sm text-slate-600">Remember me</span>
                </Checkbox>

                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                htmlType="submit"
                loading={loading}
                className="!flex !h-auto !w-full !items-center !justify-center !gap-2 !rounded-lg !border-0 !bg-blue-600 !px-4 !py-2.5 !text-sm !font-semibold !text-white !shadow-sm hover:!bg-blue-700"
                disabled={loading}
              >
                {loading ? "Signing in..." : " Sign In"}

                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Button>
            </Form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
              >
                Create account
              </button>
            </p>
          </div>

          <p className="mt-10 text-center text-xs text-slate-400">
            &copy; 2026 WorkPulse. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
