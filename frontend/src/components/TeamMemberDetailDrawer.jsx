import {
  MailOutlined,
  BankOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Drawer,
  Avatar,
  Typography,
  Row,
  Col,
  Card,
  Tag,
  Space,
} from "antd";
import ApprovalRateBar from "./ApprovalRateBar";
import StatusBadge from "./StatusBadge";

const { Text, Title } = Typography;

function getInitials(name) {
  const parts = name.trim().split(/\s+/);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

export default function TeamMemberDetailDrawer({
  member,
  open,
  onClose,
}) {
  if (!member) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={420}
      closable={false}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Space size={12}>
            <Avatar
              size={48}
              style={{
                backgroundColor: member.avatar_color,
                fontWeight: 600,
              }}
            >
              {getInitials(member.name)}
            </Avatar>

            <div>
              <Title
                level={4}
                style={{
                  margin: 0,
                }}
              >
                {member.name}
              </Title>

              <div style={{ marginTop: 4 }}>
                <StatusBadge status={member.status} />
              </div>
            </div>
          </Space>

          <CloseOutlined
            onClick={onClose}
            style={{
              fontSize: 18,
              color: "#94a3b8",
              cursor: "pointer",
              padding: 8,
            }}
          />
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        <Space
          direction="vertical"
          size={12}
          style={{
            width: "100%",
            marginBottom: 24,
          }}
        >
          <Card
            size="small"
            styles={{
              body: {
                padding: "10px 12px",
              },
            }}
          >
            <Space size={12}>
              <MailOutlined
                style={{
                  color: "#94a3b8",
                  fontSize: 16,
                }}
              />

              <div>
                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    fontSize: 12,
                  }}
                >
                  Email
                </Text>

                <Text
                  strong
                  style={{
                    display: "block",
                    color: "#334155",
                  }}
                >
                  {member.email}
                </Text>
              </div>
            </Space>
          </Card>

          <Card
            size="small"
            styles={{
              body: {
                padding: "10px 12px",
              },
            }}
          >
            <Space size={12}>
              <MailOutlined
                style={{
                  color: "#94a3b8",
                  fontSize: 16,
                }}
              />

              <div>
                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    fontSize: 12,
                  }}
                >
                  Role
                </Text>

                <Text strong style={{ color: "#334155" }}>
                  {member.role || "—"}
                </Text>
              </div>
            </Space>
          </Card>

          <Card
            size="small"
            styles={{
              body: {
                padding: "10px 12px",
              },
            }}
          >
            <Space size={12}>
              <BankOutlined
                style={{
                  color: "#94a3b8",
                  fontSize: 16,
                }}
              />

              <div>
                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    fontSize: 12,
                  }}
                >
                  Department
                </Text>

                <Text strong style={{ color: "#334155" }}>
                  {member.department || "—"}
                </Text>
              </div>
            </Space>
          </Card>
        </Space>

        <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card
              size="small"
              style={{
                textAlign: "center",
              }}
            >
              <FolderOpenOutlined
                style={{
                  fontSize: 18,
                  color: "#1677ff",
                }}
              />

              <Title
                level={4}
                style={{
                  margin: "4px 0",
                }}
              >
                {member.projects?.length || 0}
              </Title>

              <Text type="secondary" style={{ fontSize: 11 }}>
                Projects
              </Text>
            </Card>
          </Col>

          <Col span={8}>
            <Card
              size="small"
              style={{
                textAlign: "center",
              }}
            >
              <FileTextOutlined
                style={{
                  fontSize: 18,
                  color: "#10b981",
                }}
              />

              <Title
                level={4}
                style={{
                  margin: "4px 0",
                }}
              >
                {member.total_reports || 0}
              </Title>

              <Text type="secondary" style={{ fontSize: 11 }}>
                Total Reports
              </Text>
            </Card>
          </Col>

          <Col span={8}>
            <Card
              size="small"
              style={{
                textAlign: "center",
              }}
            >
              <ClockCircleOutlined
                style={{
                  fontSize: 18,
                  color: "#f59e0b",
                }}
              />

              <Title
                level={4}
                style={{
                  margin: "4px 0",
                }}
              >
                {member.reports_this_week || 0}
              </Title>

              <Text type="secondary" style={{ fontSize: 11 }}>
                This Week
              </Text>
            </Card>
          </Col>
        </Row>

        <div style={{ marginBottom: 24 }}>
          <Space
            size={8}
            style={{
              marginBottom: 10,
            }}
          >
            <CheckCircleOutlined
              style={{
                color: "#94a3b8",
              }}
            />

            <Text
              strong
              type="secondary"
              style={{
                fontSize: 12,
                textTransform: "uppercase",
              }}
            >
              Approval Rate
            </Text>
          </Space>

          {member.total_reports > 0 ? (
            <ApprovalRateBar rate={member.approval_rate} />
          ) : (
            <Text type="secondary">No reports to calculate.</Text>
          )}

          <div style={{ marginTop: 6 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {member.approved_reports} of {member.total_reports} reports approved
            </Text>
          </div>
        </div>

        <div>
          <Space
            size={8}
            style={{
              marginBottom: 10,
            }}
          >
            <FolderOpenOutlined
              style={{
                color: "#94a3b8",
              }}
            />

            <Text
              strong
              type="secondary"
              style={{
                fontSize: 12,
                textTransform: "uppercase",
              }}
            >
              Assigned Projects ({member.projects?.length || 0})
            </Text>
          </Space>

          {member.projects?.length > 0 ? (
            <Space
              direction="vertical"
              size={8}
              style={{
                width: "100%",
              }}
            >
              {member.projects.map((project) => (
                <Card
                  key={project.id}
                  size="small"
                  styles={{
                    body: {
                      padding: "10px 12px",
                    },
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text strong style={{ color: "#334155" }}>
                      {project.name}
                    </Text>

                    <Tag
                      color={
                        project.status === "active"
                          ? "green"
                          : "default"
                      }
                      style={{
                        margin: 0,
                        textTransform: "capitalize",
                      }}
                    >
                      {project.status}
                    </Tag>
                  </div>
                </Card>
              ))}
            </Space>
          ) : (
            <Text type="secondary">No projects assigned.</Text>
          )}
        </div>
      </div>
    </Drawer>
  );
}