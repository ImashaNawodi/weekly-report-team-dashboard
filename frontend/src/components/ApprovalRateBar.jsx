import { Progress } from "antd";

export default function ApprovalRateBar({ rate }) {
  const color =
    rate >= 80 ? "#10b981" : rate >= 50 ? "#f59e0b" : "#ef4444";

  const textColor =
    rate >= 80
      ? "text-emerald-600"
      : rate >= 50
      ? "text-amber-600"
      : "text-red-600";

  return (
    <div className="flex items-center gap-2">
      <Progress
        percent={rate}
        showInfo={false}
        strokeColor={color}
        trailColor="#f1f5f9"
        size="small"
        className="w-16"
      />

      <span className={`text-sm font-semibold ${textColor}`}>
        {rate}%
      </span>
    </div>
  );
}