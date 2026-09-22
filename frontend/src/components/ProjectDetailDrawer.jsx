import { Calendar, FileText, Users, AlignLeft, X } from "lucide-react";
import { Drawer, Button, Typography, Space } from "antd";
import StatusBadge from "./StatusBadge";
import getInitials from "../helpers/ProfileName";
import colors from "../helpers/BackgroundColor";
import AvatarGroup from "./Avatar";

const { Text, Paragraph } = Typography;

export default function ProjectDetailDrawer({ project, open, onClose }) {
  if (!project) return null;

  const createdDate = new Date(project.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={448}
      closable={false}
      styles={{
        body: {
          padding: 0,
        },
        header: {
          display: "none",
        },
      }}
    >
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Typography.Title
              level={5}
              className="!m-0 !font-bold !text-slate-900"
            >
              {project.name}
            </Typography.Title>

            <Space size={8} wrap className="mt-2">
              <StatusBadge status={project.isActive} />
            </Space>
          </div>

          <Button
            type="text"
            onClick={onClose}
            icon={<X size={20} />}
            className="flex !h-9 !w-9 !min-w-9 items-center justify-center !rounded-lg !text-slate-400"
          />
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-600">
            <AlignLeft size={14} />
            Description
          </div>

          <Paragraph className="!m-0 !text-sm !leading-7 !text-slate-500">
            {project.description}
          </Paragraph>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-600">
            <Users size={14} />
            Team Members ({project.teamMembers.length})
          </div>

          {project.teamMembers.length > 0 ? (
            <div className="flex flex-col gap-2">
              {project.teamMembers.map((member, index) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
                >
                  <AvatarGroup members={member} />

                  <div>
                    <Text className="!block !text-sm !font-medium !text-slate-800">
                      {member.firstName} {member.lastName}
                    </Text>

                    <Text type="secondary" className="!text-xs">
                      {member.role}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Text type="secondary">No team members assigned.</Text>
          )}
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-600">
            <FileText size={14} />
            Active Reports
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-blue-50 px-3 text-sm font-bold text-blue-700">
              {project.active_reports}
            </div>

            <Text type="secondary" className="!text-sm">
              {project.active_reports === 1
                ? "submitted report"
                : "submitted reports"}
            </Text>
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-600">
            <Calendar size={14} />
            Created
          </div>

          <Text className="!text-sm !text-slate-500">{createdDate}</Text>
        </div>
      </div>
    </Drawer>
  );
}
