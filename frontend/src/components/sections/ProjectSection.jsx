import { FolderOpen } from "lucide-react";

import SectionCard from "../ui/SectionsCard";

export default function ProjectSection({
  project,
  loading = false,
}) {
  const projectName =
    project?.name ||
    project?.projectName ||
    project?.title ||
    "No project assigned";

  return (
    <SectionCard
      number="1"
      title="Project"
      description="Your assigned project for this report."
      icon={
        <FolderOpen
          size={16}
          className="text-slate-400"
        />
      }
    >
      <div className="w-full">
        <div
          className={`flex min-h-[40px] w-full items-center rounded-lg border px-3 py-2 text-sm ${
            loading
              ? "border-slate-200 bg-slate-100 text-slate-400"
              : "border-slate-300 bg-slate-100 text-slate-700"
          }`}
        >
          {loading ? "Loading project..." : projectName}
        </div>

        {!loading && !project && (
          <p className="mt-2 text-xs text-red-500">
            You are not assigned to any project.
          </p>
        )}
      </div>
    </SectionCard>
  );
}