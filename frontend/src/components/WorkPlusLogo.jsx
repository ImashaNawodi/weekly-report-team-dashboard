import { Activity } from "lucide-react";

export default function WorkPulseLogo({
  className = "",
  iconSize = 24,
  showText = true,
  variant = "dark",
}) {
  const textColor =
    variant === "light" ? "text-white" : "text-slate-900";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex items-center justify-center rounded-xl bg-blue-600 shadow-sm">
        <Activity
          size={iconSize}
          className="text-white"
          strokeWidth={2.5}
        />
      </div>

      {showText && (
        <span className={`text-xl font-bold tracking-tight ${textColor}`}>
          Work<span className="text-blue-600">Pulse</span>
        </span>
      )}
    </div>
  );
}