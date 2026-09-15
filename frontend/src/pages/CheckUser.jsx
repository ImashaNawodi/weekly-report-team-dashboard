
import { useEffect, useRef, useState } from "react";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BarChart3,
  Users,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";
import { Button, Form, Input, notification } from "antd";
import WorkPulseLogo from "../components/WorkPlusLogo";
import { forgotPasswordService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export default function CheckUser() {
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValue = email.trim();

    if (!emailValue) {
      notification.error({
        message: "Email is required",
        placement: "bottomRight",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailValue)) {
      notification.error({
        message: "Enter a valid email address",
        placement: "bottomRight",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPasswordService({
        email: emailValue,
      });

      if (!response.success) {
        notification.error({
          message:
            response.message ||
            "Unable to send reset email. Please try again.",
          placement: "bottomRight",
        });
        return;
      }

      notification.success({
        message: "Password reset link sent successfully",
        placement: "bottomRight",
      });

      setSent(true);
    } catch (error) {
      console.error("FORGOT PASSWORD ERROR:", error);

      notification.error({
        message:
          "Something went wrong. Please check your connection and try again.",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateLogin = () => {
    navigate("/login");
  };

  if (sent) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-4">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/30 blur-3xl" />
        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-purple-400/30 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-pink-400/20 blur-3xl" />
        <div className="absolute left-[15%] top-[25%] h-24 w-24 rounded-full bg-green-400/20 blur-2xl" />
        <div className="absolute bottom-[20%] right-[15%] h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />

        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-8 text-center shadow-2xl shadow-indigo-300/30 backdrop-blur-xl">
          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400" />

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-50 shadow-sm">
            <CheckCircle2
              className="h-8 w-8 text-blue-600"
              strokeWidth={2}
            />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Check your Email
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            We've sent a password reset link to{" "}
            <span className="font-semibold text-slate-700">{email}</span>.
            Follow the link in the email to reset your password.
          </p>

          <Button
            type="primary"
            onClick={handleNavigateLogin}
            icon={
              <ArrowLeft
                className="h-4 w-4"
                strokeWidth={2.5}
              />
            }
            className="mt-6 !inline-flex !h-auto !items-center !gap-2 !rounded-lg !border-0 !bg-gradient-to-r !from-blue-600 !to-indigo-600 !px-5 !py-2.5 !text-sm !font-semibold !text-white"
          >
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

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
            <div className="absolute inset-0 animate-pulse rounded-full border-2 border-blue-400/30" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-blue-500/30 backdrop-blur-sm" />
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <WorkPulseLogo
            variant="light"
            iconSize={28}
          />
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Reset your
            <br />
            <span className="text-blue-400">password.</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Enter your work email and we'll send you a secure link to reset
            your password and get back to your team.
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
            ].map((feature, i) => {
              const Icon = feature.icon;

              return (
                <div
                  key={i}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                    <Icon
                      className="h-4 w-4 text-blue-400"
                      strokeWidth={2}
                    />
                  </div>

                  <span className="text-sm text-slate-200">
                    {feature.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8">
          <div>
            <div className="flex items-center gap-1.5 text-2xl font-bold text-white">
              <TrendingUp
                className="h-5 w-5 text-blue-400"
                strokeWidth={2.5}
              />
              98%
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Report submission rate
            </p>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div>
            <div className="text-2xl font-bold text-white">12k+</div>

            <p className="mt-1 text-xs text-slate-400">
              Teams onboarded
            </p>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div>
            <div className="text-2xl font-bold text-white">4.9/5</div>

            <p className="mt-1 text-xs text-slate-400">
              User satisfaction
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-7 shadow-[0_20px_50px_rgba(37,99,235,0.10)] transition-all duration-300 hover:border-blue-200 hover:shadow-[0_25px_60px_rgba(37,99,235,0.15)]">
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />

            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-100/50 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-32 w-32 rounded-full bg-indigo-100/40 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-8 flex justify-center lg:hidden">
                <WorkPulseLogo iconSize={28} />
              </div>

              <button
                type="button"
                onClick={handleNavigateLogin}
                className="mb-6 flex items-center gap-1.5 text-sm font-medium text-blue-500 transition-colors hover:text-blue-700"
              >
                <ArrowLeft
                  className="h-4 w-4"
                  strokeWidth={2}
                />
                Back to sign in
              </button>

              <div>
                <h2 className="text-center text-2xl font-bold tracking-tight text-blue-700">
                  Forgot Password
                </h2>

                <p className="mt-2 text-center text-sm leading-relaxed text-slate-500">
                  Enter your work email and we'll send you a link to reset
                  your password.
                </p>

                <Form
                  onFinish={handleSubmit}
                  layout="vertical"
                  requiredMark={false}
                  className="mt-6"
                >
                  <Form.Item
                    name="email"
                    label={
                      <span className="text-sm font-medium text-slate-700">
                        Work email
                      </span>
                    }
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
                      ref={emailRef}
                      prefix={
                        <Mail className="h-4 w-4 text-slate-400" />
                      }
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      size="large"
                      onChange={(e) => setEmail(e.target.value)}
                      className="!rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item className="!mb-0">
                    <Button
                      htmlType="submit"
                      type="primary"
                      loading={loading}
                      block
                      className="!h-auto !rounded-lg !border-0 !bg-gradient-to-r !from-blue-600 !to-indigo-600 !py-2.5 !text-sm !font-semibold"
                    >
                      {!loading && (
                        <>
                          Send Reset Link
                          <ArrowRight
                            className="ml-2 inline h-4 w-4"
                            strokeWidth={2.5}
                          />
                        </>
                      )}
                    </Button>
                  </Form.Item>
                </Form>

                <p className="mt-6 text-center text-sm text-slate-500">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={handleNavigateLogin}
                    className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>

              <p className="mt-8 text-center text-xs text-slate-400">
                &copy; 2026 WorkPulse. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

