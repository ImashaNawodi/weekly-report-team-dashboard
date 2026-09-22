import { useState, useEffect } from "react";

import {
  SearchOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  DownOutlined,
  FolderOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import getInitials from "../helpers/ProfileName";
import TeamMemberModal from "../components/TeamMemberModal";

import {
  Input,
  Button,
  Empty,
  Spin,
  Table,
  Card,
  Statistic,
  Row,
  Col,
  Dropdown,
  Avatar,
  Tooltip,
  notification,
} from "antd";

import {
  getAllUsersService,
  updateUserStatusService,
} from "../services/TeamService";

import TeamMemberDetailDrawer from "../components/TeamMemberDetailDrawer";
import { getAllProjectsService } from "../services/ProjectService";
import TeamMemberRow from "../components/TeamMemebrRow";
import StatusBadge from "../components/StatusBadge";
import AvatarGroup from "../components/Avatar";

const PAGE_SIZE = 8;

export default function TeamDashboard() {
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [viewMember, setViewMember] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    fetchAllUsers();
    handleViewAllProjects();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setError(null);

      const response = await getAllUsersService();

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch users");
      }

      const availableMembers = (response.data?.users || []).filter(
        (user) => user.role !== "ADMIN",
      );

      setMembers(availableMembers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    }
  };

  const handleViewAllProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllProjectsService();

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch projects");
      }

      setProjects(response.data || response.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, projectFilter]);

  const membersWithProjects = members.map((member) => {
    const userProjects = projects.filter((project) =>
      project.teamMembers?.some(
        (teamMember) =>
          teamMember?._id === member._id || teamMember === member._id,
      ),
    );

    return {
      ...member,
      projects: userProjects,
    };
  });

  const filteredMembers = membersWithProjects.filter((member) => {
    const query = searchQuery.toLowerCase().trim();

    const firstName = member.firstName?.toLowerCase() || "";
    const lastName = member.lastName?.toLowerCase() || "";
    const email = member.email?.toLowerCase() || "";
    const role = member.role?.toLowerCase() || "";

    const matchesSearch =
      !query ||
      firstName.includes(query) ||
      lastName.includes(query) ||
      `${firstName} ${lastName}`.includes(query) ||
      email.includes(query) ||
      role.includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && member.isActive === true) ||
      (statusFilter === "inactive" && member.isActive === false);

    const matchesProject =
      projectFilter === "all" ||
      member.projects?.some((project) => project.projectID === projectFilter);

    return matchesSearch && matchesStatus && matchesProject;
  });

  const stats = {
    total: members.length,

    active: members.filter((member) => member.isActive === true).length,

    inactive: members.filter((member) => member.isActive === false).length,

    reportsThisWeek: members.reduce(
      (sum, member) => sum + (member.reports_this_week || 0),
      0,
    ),
  };

  const handleViewProfile = (member) => {
    setViewMember(member);
    setDrawerOpen(true);
  };

  const handleViewReports = (member) => {
    setViewMember(member);
    setDrawerOpen(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setModalOpen(true);
  };

  const updateUserStatus = async (userAccountID, isActive) => {
    try {
      const response = await updateUserStatusService(userAccountID, isActive);

      if (!response.success) {
        notification.error({
          message: response.message || "Failed to update user status",
          placement: "bottomRight",
        });
        return;
      }

      notification.success({
        message: `User ${isActive ? "activated" : "deactivated"} successfully`,
        placement: "bottomRight",
      });

      return response;
    } catch (error) {
      notification.error({
        message: error.message || "Failed to update user status",
        placement: "bottomRight",
      });
    }
  };

  const handleToggleStatus = async (member) => {
    setTogglingId(member._id);
    setError(null);

    const newStatus = !member.isActive;

    try {
      await updateUserStatus(member._id, newStatus);
      await fetchAllUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update user status",
      );
    } finally {
      setTogglingId(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setProjectFilter("all");
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingMember(null);
  };

  const statusItems = [
    {
      key: "all",
      label: "All Status",
    },
    {
      key: "active",
      label: "Active",
    },
    {
      key: "inactive",
      label: "Inactive",
    },
  ];

  const projectItems = [
    {
      key: "all",
      label: "All Projects",
    },
    ...projects.map((project) => ({
      key: project.projectID,
      label: project.name,
    })),
  ];

  const columns = [
    {
      title: "TEAM MEMBER",
      key: "employee",
      width: 240,
      render: (_, member) => {
        return (
          <div className="flex items-center gap-3">
            <AvatarGroup members={member} />

            <div className="min-w-0">
              <p className="m-0 max-w-[180px] truncate text-sm font-semibold text-slate-800">
                {`${member.firstName} ${member.lastName}`.trim()}
              </p>

              <p className="m-0 mt-0.5 max-w-[180px] truncate text-xs text-slate-400">
                {member.role}
              </p>
            </div>
          </div>
        );
      },
    },

    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
      width: 230,
      render: (email) => (
        <span className="text-sm text-slate-600">{email || "—"}</span>
      ),
    },

    {
      title: "ROLE",
      dataIndex: "role",
      key: "role",
      width: 150,
      render: (role) => (
        <span className="text-sm text-slate-600">{role || "—"}</span>
      ),
    },

    {
      title: "PROJECTS",
      key: "projects",
      width: 220,
      render: (_, member) => {
        const userProjects = member.projects || [];

        if (userProjects.length === 0) {
          return <span className="text-sm text-slate-300">—</span>;
        }

        const projectNames = userProjects
          .map((project) => project.name)
          .filter(Boolean)
          .join(", ");

        return (
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-50 px-2 text-xs font-bold text-blue-700">
              {userProjects.length}
            </span>

            <Tooltip title={projectNames}>
              <span className="max-w-[150px] truncate text-xs text-slate-400">
                {projectNames || "Projects"}
              </span>
            </Tooltip>
          </div>
        );
      },
    },

    {
      title: "STATUS",
      key: "status",
      width: 110,
      render: (_, member) => <StatusBadge status={member.isActive} />,
    },

    {
      title: "ACTIONS",
      key: "actions",
      width: 80,
      fixed: "right",
      render: (_, member) => (
        <TeamMemberRow
          member={member}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEdit}
          onViewProfile={handleViewProfile}
          onViewReports={handleViewReports}
          toggling={togglingId === member._id}
        />
      ),
    },
  ];

  const hasActiveFilters =
    searchQuery !== "" || statusFilter !== "all" || projectFilter !== "all";

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]} className="items-stretch p-2">
        <Col xs={24} sm={12} lg={6} className="flex">
          <Card className="w-full rounded-xl border-slate-200 shadow-sm">
            <Statistic
              title="Total Members"
              value={stats.total}
              prefix={<TeamOutlined className="text-cyan-600" />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6} className="flex">
          <Card className="w-full rounded-xl border-slate-200 shadow-sm">
            <Statistic
              title="Active Members"
              value={stats.active}
              prefix={<TeamOutlined className="text-green-600" />}
            />

            <p className="mt-2 mb-0 text-sm text-green-600">Currently active</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6} className="flex">
          <Card className="w-full rounded-xl border-slate-200 shadow-sm">
            <Statistic
              title="Inactive Members"
              value={stats.inactive}
              prefix={<TeamOutlined className="text-slate-400" />}
            />

            <p className="mt-2 mb-0 text-sm text-slate-400">
              Currently inactive
            </p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6} className="flex">
          <Card className="w-full rounded-xl border-slate-200 shadow-sm">
            <Statistic
              title="Reports This Week"
              value={stats.reportsThisWeek}
              prefix={<FileTextOutlined className="text-blue-600" />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <div className="flex items-center gap-2">
            <TeamOutlined />
            <span>Team Members </span>
          </div>
        }
        className="rounded-xl border-slate-200 shadow-sm"
      >
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <Input
              prefix={<SearchOutlined className="text-slate-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              allowClear
              className="h-10 rounded-lg sm:max-w-xs"
            />

            <Dropdown
              menu={{
                items: statusItems,
                selectedKeys: [statusFilter],
                onClick: ({ key }) => setStatusFilter(key),
              }}
              trigger={["click"]}
            >
              <Button className="h-10 rounded-lg">
                <span className="flex items-center gap-2">
                  <FilterOutlined className="text-slate-400" />

                  {statusItems.find((item) => item.key === statusFilter)?.label}

                  <DownOutlined className="text-xs text-slate-400" />
                </span>
              </Button>
            </Dropdown>

            <Dropdown
              menu={{
                items: projectItems,
                selectedKeys: [projectFilter],
                onClick: ({ key }) => setProjectFilter(key),
              }}
              trigger={["click"]}
            >
              <Button className="h-10 rounded-lg">
                <span className="flex items-center gap-2">
                  <FolderOutlined className="text-slate-400" />

                  <span className="max-w-[140px] truncate">
                    {projectFilter === "all"
                      ? "Project"
                      : projectItems.find((item) => item.key === projectFilter)
                          ?.label || "Project"}
                  </span>

                  <DownOutlined className="text-xs text-slate-400" />
                </span>
              </Button>
            </Dropdown>
          </div>

          {hasActiveFilters && (
            <Button type="link" onClick={clearFilters} className="!px-0">
              Clear filters
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-center gap-2.5 text-sm text-red-700">
              <ExclamationCircleOutlined />
              <span>{error}</span>
            </div>

            <Button
              type="link"
              danger
              onClick={() => {
                fetchAllUsers();
                handleViewAllProjects();
              }}
            >
              Retry
            </Button>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Spin size="large" />

              <span className="text-sm text-slate-500">
                Loading team members...
              </span>
            </div>
          </div>
        ) : members.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-slate-500">No team members yet</span>
              }
            />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-slate-500">No matching members</span>
              }
            />

            {hasActiveFilters && (
              <Button onClick={clearFilters} className="rounded-lg">
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredMembers}
            rowKey="_id"
            loading={false}
            pagination={{
              current: currentPage,
              pageSize: PAGE_SIZE,
              total: filteredMembers.length,
              showSizeChanger: false,
              showTotal: (total, range) =>
                `Showing ${range[0]}–${range[1]} of ${total}`,
              onChange: (page) => setCurrentPage(page),
            }}
            scroll={{ x: 1100 }}
          />
        )}
      </Card>

      <TeamMemberModal
        open={modalOpen}
        onClose={handleModalClose}
        editingMember={editingMember}
        onSaved={fetchAllUsers}
      />

      <TeamMemberDetailDrawer
        member={viewMember}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
