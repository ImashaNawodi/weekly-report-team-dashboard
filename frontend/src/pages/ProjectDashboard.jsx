import { useState, useEffect } from "react";
import { Plus, Search, FolderOpen, ChevronDown, X } from "lucide-react";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Table,
  Empty,
  Typography,
  Spin,
  notification,
} from "antd";

import ProjectRow from "../components/ProjectRow";
import ProjectModal from "../components/ProjectModal";
import ProjectDetailDrawer from "../components/ProjectDetailDrawer";
import AvatarGroup from "../components/Avatar";
import StatusBadge from "../components/StatusBadge";
import { useMembers } from "../context/MembersContext.jsx";
import {
  getAllProjectsService,
  updateProjectStatusService,
} from "../services/ProjectService";

const { Text, Title, Paragraph } = Typography;

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewProject, setViewProject] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const { members } = useMembers();
  
  useEffect(() => {
    handViewAllProjects();
  }, []);

  const handViewAllProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllProjectsService();

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch projects");
      }
      setProjects(response.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSuccess = (updatedProject) => {
    if (!updatedProject?.projectID) {
      return;
    }

    const projectWithMembers = {
      ...updatedProject,
      teamMembers: (updatedProject.teamMembers || []).map((memberId) => {
        const member = members.find(
          (item) =>
            String(item?._id) === String(memberId) ||
            String(item?.id) === String(memberId) ||
            String(item?.userID) === String(memberId),
        );

        return member || memberId;
      }),
    };

    setProjects((prevProjects) => {
      const exists = prevProjects.some(
        (project) =>
          String(project?.projectID) === String(projectWithMembers.projectID),
      );

      if (exists) {
        return prevProjects.map((project) =>
          String(project?.projectID) === String(projectWithMembers.projectID)
            ? projectWithMembers
            : project,
        );
      }

      return [projectWithMembers, ...prevProjects];
    });

    setEditingProject(null);
    setModalOpen(false);
  };
  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      project.name?.toLowerCase().includes(query) ||
      (project.description ?? "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && project.isActive === true) ||
      (statusFilter === "inactive" && project.isActive === false);

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: projects.length,
    active: projects.filter((project) => project.isActive === true).length,
    inactive: projects.filter((project) => project.isActive === false).length,
  };

  const handleAdd = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleView = (project) => {
    setViewProject(project);
    setDrawerOpen(true);
  };

const updateProjectStatus = async (projectID, isActive) => {
  try {
    const response = await updateProjectStatusService(projectID, {
      isActive,
    });

    if (!response.success) {
      throw new Error(response.message || "Failed to update project status");
    }

    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to update project status",
    );
  }
};

  const handleToggleStatus = async (project) => {
  setTogglingId(project.projectID);
  setError(null);

  const newStatus = !project.isActive;

  try {
    await updateProjectStatus(project.projectID, newStatus);

    notification.success({
      message: `Project ${newStatus ? "activated" : "deactivated"} successfully`,
      placement: "bottomRight",
    });

    await handViewAllProjects();
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Failed to update project status";

    setError(errorMessage);

    notification.error({
      message: errorMessage,
      placement: "bottomRight",
    });
  } finally {
    setTogglingId(null);
  }
};

  const statusOptions = [
    {
      value: "all",
      label: "All Status",
    },
    {
      value: "active",
      label: "Active",
    },
    {
      value: "inactive",
      label: "Inactive",
    },
  ];

  const columns = [
    {
      title: "Project Name",
      key: "name",
      width: 180,
      render: (_, project) => (
        <Button
          type="link"
          onClick={() => handleView(project)}
          className="!truncate !p-0 !font-semibold !text-slate-800"
        >
          {project.name}
        </Button>
      ),
    },

    {
      title: "Description",
      key: "description",
      width: 250,
      ellipsis: true,
      render: (_, project) => (
        <Text
          type="secondary"
          ellipsis={{
            tooltip: project.description ?? "",
          }}
        >
          {project.description ?? "—"}
        </Text>
      ),
    },

    {
      title: "Team Members",
      key: "team_members",
      width: 150,
      render: (_, project) => (
        <AvatarGroup members={project.teamMembers ?? []} />
      ),
    },

    {
      title: "Status",
      key: "status",
      width: 100,
      render: (_, project) => <StatusBadge status={project.isActive} />,
    },

    {
      title: "Created Date",
      key: "created_at",
      width: 130,
      render: (_, project) =>
        new Date(project.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },

    {
      title: "Actions",
      key: "actions",
      width: 90,
      align: "left",
      render: (_, project) => (
        <ProjectRow
          project={project}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onView={handleView}
          toggling={togglingId === project.projectID}
        />
      ),
    },
  ];
  const currentEditingProjectId = editingProject?.projectID;

  const assignedMemberIds = new Set(
    projects
      .filter(
        (project) =>
          String(project.projectID) !== String(currentEditingProjectId),
      )
      .flatMap((project) =>
        (project.teamMembers ?? []).map((member) => {
          if (typeof member === "string") {
            return String(member);
          }

          return String(member?._id || member?.id);
        }),
      )
      .filter(Boolean),
  );

  const availableMembers = members.filter((member) => {
    const memberId = String(member?._id || member?.id);

    return memberId && !assignedMemberIds.has(memberId);
  });
 
  return (
    <div className="min-h-full">
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <Row gutter={[12, 12]} className="mb-5">
          <Col xs={24} sm={8}>
            <Card bordered={false} className="h-full !bg-blue-50">
              <Text className="!text-blue-700">Total Projects</Text>

              <Title level={2} className="!mb-0 !mt-1 !text-blue-700">
                {stats.total}
              </Title>
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card bordered={false} className="h-full !bg-emerald-50">
              <Text className="!text-emerald-700">Active Projects</Text>

              <Title level={2} className="!mb-0 !mt-1 !text-emerald-700">
                {stats.active}
              </Title>
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card bordered={false} className="h-full !bg-slate-100">
              <Text className="!text-slate-600">Inactive Projects</Text>

              <Title level={2} className="!mb-0 !mt-1 !text-slate-600">
                {stats.inactive}
              </Title>
            </Card>
          </Col>
        </Row>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-1 sm:flex-row">
            <Input
              prefix={<Search size={16} className="text-slate-400" />}
              suffix={
                searchQuery ? (
                  <Button
                    type="text"
                    size="small"
                    icon={<X size={14} />}
                    onClick={() => setSearchQuery("")}
                    className="!text-slate-400"
                  />
                ) : null
              }
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="!h-10 !w-full !rounded-lg sm:!max-w-[320px]"
            />

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              suffixIcon={<ChevronDown size={16} />}
              className="!h-10 !w-full sm:!w-[150px]"
            />
          </div>

          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={handleAdd}
            className="!h-10 !w-full sm:!w-auto sm:!min-w-[150px]"
          >
            Add Project
          </Button>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <Card
          bordered={false}
          styles={{
            body: {
              padding: 0,
            },
          }}
        >
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center sm:min-h-[400px]">
              <Spin size="large" />
            </div>
          ) : projects.length === 0 ? (
            <div className="px-4 py-8 sm:py-12">
              <Empty
                image={<FolderOpen size={48} className="text-slate-400" />}
                description={
                  <>
                    <Title level={5}>No projects yet</Title>

                    <Paragraph type="secondary">
                      Get started by creating your first project. You can assign
                      team members and track weekly reports.
                    </Paragraph>

                    <Button
                      type="primary"
                      icon={<Plus size={16} />}
                      onClick={handleAdd}
                      className="!mb-4"
                    >
                      Add Project
                    </Button>
                  </>
                }
              />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="px-4 py-8 sm:py-12">
              <Empty
                image={<Search size={48} className="text-slate-400" />}
                description={
                  <>
                    <Title level={5}>No matching projects</Title>

                    <Paragraph type="secondary">
                      Try adjusting your search or filter criteria.
                    </Paragraph>

                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                    >
                      Clear filters
                    </Button>
                  </>
                }
              />
            </div>
          ) : (
            <Table
              rowKey="projectID"
              dataSource={filteredProjects}
              columns={columns}
              pagination={false}
              scroll={{ x: 900 }}
              size="middle"
            />
          )}
        </Card>

        {!loading && !error && filteredProjects.length > 0 && (
          <Text type="secondary" className="mt-3 block px-1 text-sm">
            Showing {filteredProjects.length} of {projects.length} projects
          </Text>
        )}
      </div>

      <ProjectModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProject(null);
        }}
        onSuccess={handleProjectSuccess}
        editingProject={editingProject}
        members={availableMembers}
      />

      <ProjectDetailDrawer
        project={viewProject}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
