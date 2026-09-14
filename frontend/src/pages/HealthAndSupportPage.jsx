import { Wrench, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HealthAndSupport() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50">
          <Wrench className="h-10 w-10 text-amber-500" strokeWidth={1.5} />
        </div>

        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-20 w-20 animate-ping rounded-2xl border-2 border-amber-200 opacity-60" />
        </span>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        We're under maintenance
      </h1>

      <p className="mt-2 max-w-md text-sm text-slate-400">
        Help &amp; Support is temporarily unavailable while we make some
        improvements. We'll be back up shortly — sorry for the inconvenience!
      </p>

      <div className="mt-5 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
        <Mail className="h-4 w-4 text-slate-400" />

        <span>
          Need something urgent? Email{" "}
          <a
            href="mailto:support@workpulse.io"
            className="font-medium text-blue-600 hover:underline"
          >
            support@workpulse.io
          </a>
        </span>
      </div>
    </div>
  );
}
