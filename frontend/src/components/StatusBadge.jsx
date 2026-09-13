import { CheckCircle2, PauseCircle } from "lucide-react";
import { Tag } from "antd";

export default function StatusBadge({ status }) {
  if (status === true) {
    return (
      <Tag
        icon={<CheckCircle2 size={13} />}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          margin: 0,
          padding: "3px 8px",
          border: "none",
          borderRadius: 6,
          backgroundColor: "#ecfdf5",
          color: "#047857",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        Active
      </Tag>
    );
  }

  return (
    <Tag
      icon={<PauseCircle size={13} />}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        margin: 0,
        padding: "3px 8px",
        border: "none",
        borderRadius: 6,
        backgroundColor: "#f1f5f9",
        color: "#64748b",
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      Inactive
    </Tag>
  );
}