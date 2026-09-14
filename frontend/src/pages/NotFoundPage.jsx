import { Compass, ArrowLeft } from "lucide-react";

export default function NotFoundPage({ onGoHome }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50">
          <Compass
            className="h-10 w-10 text-blue-500"
            strokeWidth={1.5}
          />
        </div>

        <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-400 shadow-sm">
          ?
        </span>
      </div>

      <h1 className="text-5xl font-bold tracking-tight text-slate-900">
        404
      </h1>

      <p className="mt-3 text-lg font-semibold text-slate-700">
        Page not found
      </p>

      <p className="mt-1.5 max-w-sm text-sm text-slate-400">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <button
        onClick={onGoHome}
        className="mt-6 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Weekly Report
      </button>
    </div>
  );
}