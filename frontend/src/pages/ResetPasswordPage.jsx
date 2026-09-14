import { useState, useRef, useEffect } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  BarChart3,
  Users,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import WorkPulseLogo from "../components/WorkPlusLogo";
import {
  PASSWORD_RULES,
  passwordFieldValidation,
} from "../helpers/PasswordValidation";
import { resetPasswordService } from "../services/AuthService";

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

export default function ResetPasswordPage({ onNavigateLogin }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [authError, setAuthError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordRef = useRef(null);

  useEffect(() => {
    passwordRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAuthError(null);
    setPasswordError("");
    setConfirmError("");

    let hasError = false;

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else {
      try {
        await passwordFieldValidation(null, password);
      } catch (error) {
        setPasswordError(
          error?.message || "Password doesn't meet all requirements",
        );
        hasError = true;
      }
    }

    if (!confirmPassword) {
      setConfirmError("Confirm password is required");
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmError("Passwords do not match");
      hasError = true;
    }

    if (!token) {
      setAuthError(
        "This password reset link is invalid or has expired. Please request a new one.",
      );
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);

      const response = await resetPasswordService({
        token,
        password,
      });

      if (!response.success) {
        setAuthError(
          response.message ||
            "Unable to update your password. The reset link may have expired.",
        );
        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

      setAuthError(
        "Something went wrong. Please try again or request a new reset link.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateLogin = () => {
    if (onNavigateLogin) {
      onNavigateLogin();
      return;
    }

    navigate("/login");
  };

  if (success) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-4">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/30 blur-3xl" />

        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-purple-400/30 blur-3xl" />

        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl" />

        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-pink-400/20 blur-3xl" />

        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-8 text-center shadow-2xl shadow-indigo-300/30 backdrop-blur-xl">
          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400" />

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2
              className="h-8 w-8 text-green-600"
              strokeWidth={2}
            />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Password updated!
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Your password has been changed successfully. You can now sign in
            with your new password.
          </p>

          <button
            onClick={handleNavigateLogin}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            Continue to Sign In
            <ArrowRight
              className="h-4 w-4"
              strokeWidth={2.5}
            />
          </button>
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

            <div
              className="absolute inset-0 animate-pulse rounded-full border-2 border-blue-400/20"
              style={{ animationDelay: "1s" }}
            />

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
            Set a new
            <br />
            <span className="text-blue-400">password.</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Choose a strong password to secure your WorkPulse account and get
            back to your team.
          </p>

          <div className="mt-10 space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                    <Icon
                      className="h-5 w-5 text-blue-400"
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
            <div className="text-2xl font-bold text-white">
              12k+
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Teams onboarded
            </p>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div>
            <div className="text-2xl font-bold text-white">
              98%
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Report submission rate
            </p>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div>
            <div className="text-2xl font-bold text-white">
              4.9/5
            </div>

            <p className="mt-1 text-xs text-slate-400">
              User satisfaction
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center lg:hidden">
            <WorkPulseLogo iconSize={28} />
          </div>

          <button
            onClick={handleNavigateLogin}
            className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
          >
            <ArrowLeft
              className="h-4 w-4"
              strokeWidth={2}
            />
            Back to sign in
          </button>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Reset your password
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter your new password below to secure your account.
            </p>
          </div>

          {authError && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                strokeWidth={2}
              />

              <p className="text-sm text-red-700">
                {authError}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-4"
            noValidate
          >
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                New Password
              </label>

              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 ${
                    passwordError
                      ? "text-red-400"
                      : "text-slate-400"
                  }`}
                />

                <input
                  ref={passwordRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    if (passwordError) {
                      setPasswordError("");
                    }

                    if (authError) {
                      setAuthError(null);
                    }
                  }}
                  className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 ${
                    passwordError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
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
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(password);

                    return (
                      <li
                        key={rule.key}
                        className="flex items-center gap-1.5"
                      >
                        {passed ? (
                          <CheckCircle2
                            className="h-3.5 w-3.5 shrink-0 text-green-500"
                            strokeWidth={2.5}
                          />
                        ) : (
                          <XCircle
                            className="h-3.5 w-3.5 shrink-0 text-slate-300"
                            strokeWidth={2}
                          />
                        )}

                        <span
                          className={`text-xs ${
                            passed
                              ? "text-green-600"
                              : "text-slate-400"
                          }`}
                        >
                          {rule.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {passwordError && (
                <p className="mt-1.5 text-xs text-red-600">
                  {passwordError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 ${
                    confirmError
                      ? "text-red-400"
                      : "text-slate-400"
                  }`}
                />

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);

                    if (confirmError) {
                      setConfirmError("");
                    }

                    if (authError) {
                      setAuthError(null);
                    }
                  }}
                  className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 ${
                    confirmError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : confirmPassword &&
                        confirmPassword === password
                      ? "border-green-400 focus:border-green-500 focus:ring-green-100"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev,
                    )
                  }
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {confirmError && (
                <p className="mt-1.5 text-xs text-red-600">
                  {confirmError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>

                  Updating...
                </>
              ) : (
                <>
                  Update Password
                  <ArrowRight
                    className="h-4 w-4"
                    strokeWidth={2.5}
                  />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Remember your password?{" "}
            <button
              onClick={handleNavigateLogin}
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