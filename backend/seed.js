require("dotenv").config({
path: [".env.local", ".env"],
});

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../backend/src/models/user.model");
const Project = require("../backend/src/models/project.model");
const Report = require("../backend/src/models/report.model");

const MONGO_URI = process.env.MONGODB_URL;

const getWeekDates = (weekNumber) => {
const baseDate = new Date("2026-07-06T00:00:00.000Z");

const weekStart = new Date(baseDate);
weekStart.setUTCDate(
baseDate.getUTCDate() + (weekNumber - 1) * 7,
);

const weekEnd = new Date(weekStart);
weekEnd.setUTCDate(weekStart.getUTCDate() + 6);

return {
weekStart,
weekEnd,
};
};

const createReport = ({
reportNumber,
user,
project,
weekNumber,
workCompleted,
plannedWork,
blockers = "",
status,
managerFeedback = "",
manager,
}) => {
const { weekStart, weekEnd } =
getWeekDates(weekNumber);

const submittedAt = new Date(
weekEnd.getTime() + 9 * 60 * 60 * 1000,
);

const reviewedAt =
status === "APPROVED" ||
status === "NEEDS_CORRECTION"
? new Date(
submittedAt.getTime() +
24 * 60 * 60 * 1000,
)
: null;

const report = {
reportNumber,
user,
project,
weekNumber,
weekStart,
weekEnd,
workCompleted,
plannedWork,
blockers,
status,
managerFeedback,
submittedAt,
reviewedAt,
reviewedBy:
reviewedAt && manager ? manager : null,
versions: [
{
versionNumber: 1,
submittedAt,
submittedBy: user,
workCompleted,
plannedWork,
blockers,
status,
},
],
};

return report;
};

const seedDatabase = async () => {
try {
if (!MONGO_URI) {
throw new Error(
"MongoDB URI is missing. Add MONGO_URI to your .env file.",
);
}

await mongoose.connect(MONGO_URI);

console.log("MongoDB connected");

await Report.deleteMany({});
await Project.deleteMany({});
await User.deleteMany({});

console.log("Existing users, projects and reports cleared");

const hashedPassword = await bcrypt.hash(
  "Password123",
  10,
);

const usersData = [
  {
    userID: 1,
    firstName: "John",
    lastName: "Perera",
    email: "john.perera@example.com",
    password: hashedPassword,
    role: "TEAM_MEMBER",
    isActive: true,
  },
  {
    userID: 2,
    firstName: "Nimal",
    lastName: "Silva",
    email: "nimal.silva@example.com",
    password: hashedPassword,
    role: "TEAM_MEMBER",
    isActive: true,
  },
  {
    userID: 3,
    firstName: "Kasun",
    lastName: "Fernando",
    email: "kasun.fernando@example.com",
    password: hashedPassword,
    role: "TEAM_MEMBER",
    isActive: true,
  },
  {
    userID: 4,
    firstName: "Amal",
    lastName: "Wijesinghe",
    email: "amal.wijesinghe@example.com",
    password: hashedPassword,
    role: "TEAM_MEMBER",
    isActive: true,
  },
  {
    userID: 5,
    firstName: "Sanduni",
    lastName: "Perera",
    email: "sanduni.perera@example.com",
    password: hashedPassword,
    role: "TEAM_MEMBER",
    isActive: true,
  },
  {
    userID: 6,
    firstName: "Sarah",
    lastName: "Manager",
    email: "sarah.manager@example.com",
    password: hashedPassword,
    role: "MANAGER",
    isActive: true,
  },
];

const users = await User.insertMany(usersData);

console.log(
  `${users.length} users inserted successfully`,
);

const john = users.find(
  (user) =>
    user.email === "john.perera@example.com",
);

const nimal = users.find(
  (user) =>
    user.email === "nimal.silva@example.com",
);

const kasun = users.find(
  (user) =>
    user.email === "kasun.fernando@example.com",
);

const amal = users.find(
  (user) =>
    user.email === "amal.wijesinghe@example.com",
);

const sanduni = users.find(
  (user) =>
    user.email === "sanduni.perera@example.com",
);

const manager = users.find(
  (user) =>
    user.email === "sarah.manager@example.com",
);

const projectsData = [
  {
    projectNumber: "P001",
    name: "Weekly Report Team Dashboard",
    description:
      "A full-stack system for submitting, reviewing and managing weekly team reports.",
    teamMembers: [
      john._id,
      nimal._id,
      kasun._id,
      amal._id,
      sanduni._id,
    ],
    isActive: true,
  },
  {
    projectNumber: "P002",
    name: "E-Commerce Platform",
    description:
      "Development of an online e-commerce platform with product management and order processing.",
    teamMembers: [
      john._id,
      kasun._id,
      sanduni._id,
    ],
    isActive: true,
  },
  {
    projectNumber: "P003",
    name: "HR Management System",
    description:
      "Internal employee and human resource management system.",
    teamMembers: [
      nimal._id,
      amal._id,
      sanduni._id,
    ],
    isActive: true,
  },
  {
    projectNumber: "P004",
    name: "Customer Portal",
    description:
      "Customer self-service portal for account and support management.",
    teamMembers: [
      john._id,
      nimal._id,
      kasun._id,
    ],
    isActive: true,
  },
];

const projects = await Project.insertMany(
  projectsData,
);

console.log(
  `${projects.length} projects inserted successfully`,
);

const dashboardProject = projects.find(
  (project) =>
    project.projectNumber === "P001",
);

const ecommerceProject = projects.find(
  (project) =>
    project.projectNumber === "P002",
);

const hrProject = projects.find(
  (project) =>
    project.projectNumber === "P003",
);

const customerProject = projects.find(
  (project) =>
    project.projectNumber === "P004",
);

const reportsData = [
  createReport({
    reportNumber: "R001",
    user: john._id,
    project: dashboardProject._id,
    weekNumber: 1,
    workCompleted:
      "Completed authentication API integration and user registration functionality.",
    plannedWork:
      "Implement weekly report creation and dashboard components.",
    blockers: "",
    status: "APPROVED",
    managerFeedback:
      "Good progress. Authentication implementation looks good.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R002",
    user: nimal._id,
    project: hrProject._id,
    weekNumber: 1,
    workCompleted:
      "Designed employee database schema and created employee management APIs.",
    plannedWork:
      "Implement employee profile and department management.",
    blockers: "",
    status: "APPROVED",
    managerFeedback:
      "Good database design and API implementation.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R003",
    user: kasun._id,
    project: ecommerceProject._id,
    weekNumber: 1,
    workCompleted:
      "Created product schema and implemented product listing APIs.",
    plannedWork:
      "Develop product detail page and product management features.",
    blockers:
      "Waiting for final product image assets.",
    status: "NEEDS_CORRECTION",
    managerFeedback:
      "Please provide more details about completed API endpoints.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R004",
    user: amal._id,
    project: hrProject._id,
    weekNumber: 1,
    workCompleted:
      "Implemented employee list interface and employee search functionality.",
    plannedWork:
      "Add employee profile editing and validation.",
    blockers: "",
    status: "SUBMITTED",
    managerFeedback: "",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R005",
    user: sanduni._id,
    project: ecommerceProject._id,
    weekNumber: 1,
    workCompleted:
      "Created initial UI designs for product listing and checkout pages.",
    plannedWork:
      "Implement responsive product cards and checkout interface.",
    blockers: "",
    status: "APPROVED",
    managerFeedback:
      "The initial UI design is clear and well structured.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R006",
    user: john._id,
    project: customerProject._id,
    weekNumber: 2,
    workCompleted:
      "Implemented customer account registration and login functionality.",
    plannedWork:
      "Develop customer profile and account settings.",
    blockers: "",
    status: "APPROVED",
    managerFeedback:
      "Good implementation. Continue with profile management.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R007",
    user: nimal._id,
    project: dashboardProject._id,
    weekNumber: 2,
    workCompleted:
      "Implemented report filtering by status and project.",
    plannedWork:
      "Add team member filtering and report analytics.",
    blockers: "",
    status: "SUBMITTED",
    managerFeedback: "",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R008",
    user: kasun._id,
    project: ecommerceProject._id,
    weekNumber: 2,
    workCompleted:
      "Implemented shopping cart functionality and cart item management.",
    plannedWork:
      "Implement order creation and checkout workflow.",
    blockers:
      "Need confirmation of payment gateway requirements.",
    status: "APPROVED",
    managerFeedback:
      "Cart implementation is working well. Proceed with checkout.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R009",
    user: amal._id,
    project: hrProject._id,
    weekNumber: 2,
    workCompleted:
      "Implemented employee profile editing and form validation.",
    plannedWork:
      "Add employee leave request functionality.",
    blockers: "",
    status: "NEEDS_CORRECTION",
    managerFeedback:
      "Please include more information about validation rules and testing.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R010",
    user: sanduni._id,
    project: customerProject._id,
    weekNumber: 2,
    workCompleted:
      "Created customer dashboard layout and navigation components.",
    plannedWork:
      "Develop support ticket and notification interfaces.",
    blockers: "",
    status: "SUBMITTED",
    managerFeedback: "",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R011",
    user: john._id,
    project: dashboardProject._id,
    weekNumber: 3,
    workCompleted:
      "Implemented report statistics cards and weekly summary calculations.",
    plannedWork:
      "Create manager analytics charts and activity section.",
    blockers: "",
    status: "APPROVED",
    managerFeedback:
      "Statistics implementation is correct and clearly presented.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R012",
    user: nimal._id,
    project: customerProject._id,
    weekNumber: 3,
    workCompleted:
      "Implemented customer profile API and account settings endpoints.",
    plannedWork:
      "Add password change and account security features.",
    blockers: "",
    status: "APPROVED",
    managerFeedback:
      "API structure is good. Continue with security features.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R013",
    user: kasun._id,
    project: ecommerceProject._id,
    weekNumber: 3,
    workCompleted:
      "Implemented checkout workflow and order creation APIs.",
    plannedWork:
      "Integrate payment gateway and order confirmation.",
    blockers:
      "Payment provider credentials are not available yet.",
    status: "SUBMITTED",
    managerFeedback: "",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R014",
    user: amal._id,
    project: hrProject._id,
    weekNumber: 3,
    workCompleted:
      "Developed employee leave request form and leave request APIs.",
    plannedWork:
      "Implement leave approval workflow for managers.",
    blockers: "",
    status: "APPROVED",
    managerFeedback:
      "Good progress. The leave request workflow is structured well.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R015",
    user: sanduni._id,
    project: dashboardProject._id,
    weekNumber: 3,
    workCompleted:
      "Created dashboard chart layouts and responsive analytics components.",
    plannedWork:
      "Connect charts with report API data.",
    blockers: "",
    status: "NEEDS_CORRECTION",
    managerFeedback:
      "Please provide more detail about the completed chart components.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R016",
    user: john._id,
    project: ecommerceProject._id,
    weekNumber: 4,
    workCompleted:
      "Integrated product search and category filtering.",
    plannedWork:
      "Improve search performance and add sorting options.",
    blockers: "",
    status: "APPROVED",
    managerFeedback:
      "Good implementation and clean filtering logic.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R017",
    user: nimal._id,
    project: dashboardProject._id,
    weekNumber: 4,
    workCompleted:
      "Implemented report status charts and weekly trend calculations.",
    plannedWork:
      "Add project workload and team member analytics.",
    blockers: "",
    status: "APPROVED",
    managerFeedback:
      "Analytics calculations are correct and useful.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R018",
    user: kasun._id,
    project: customerProject._id,
    weekNumber: 4,
    workCompleted:
      "Implemented support ticket creation and ticket listing APIs.",
    plannedWork:
      "Add ticket status updates and manager assignment.",
    blockers: "",
    status: "SUBMITTED",
    managerFeedback: "",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R019",
    user: amal._id,
    project: hrProject._id,
    weekNumber: 4,
    workCompleted:
      "Implemented manager leave approval and rejection workflow.",
    plannedWork:
      "Add leave history and reporting functionality.",
    blockers: "",
    status: "APPROVED",
    managerFeedback:
      "Leave approval workflow works as expected.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R020",
    user: sanduni._id,
    project: ecommerceProject._id,
    weekNumber: 4,
    workCompleted:
      "Improved checkout UI and created order confirmation page.",
    plannedWork:
      "Add order history and customer order details.",
    blockers: "",
    status: "SUBMITTED",
    managerFeedback: "",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R021",
    user: john._id,
    project: dashboardProject._id,
    weekNumber: 5,
    workCompleted:
      "Implemented manager report review and approval actions.",
    plannedWork:
      "Add correction request workflow and feedback display.",
    blockers: "",
    status: "APPROVED",
    managerFeedback:
      "Report review workflow is working correctly.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R022",
    user: nimal._id,
    project: customerProject._id,
    weekNumber: 5,
    workCompleted:
      "Added password update functionality and account security validation.",
    plannedWork:
      "Implement customer notification preferences.",
    blockers: "",
    status: "NEEDS_CORRECTION",
    managerFeedback:
      "Please add more details about security testing.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R023",
    user: kasun._id,
    project: ecommerceProject._id,
    weekNumber: 5,
    workCompleted:
      "Integrated order confirmation and customer order status updates.",
    plannedWork:
      "Develop order history and order tracking.",
    blockers: "",
    status: "APPROVED",
    managerFeedback:
      "Order workflow implementation is complete and well structured.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R024",
    user: amal._id,
    project: hrProject._id,
    weekNumber: 5,
    workCompleted:
      "Implemented leave history and employee leave summary.",
    plannedWork:
      "Create HR reporting dashboard.",
    blockers: "",
    status: "SUBMITTED",
    managerFeedback: "",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R025",
    user: sanduni._id,
    project: customerProject._id,
    weekNumber: 5,
    workCompleted:
      "Created notification settings interface and preference components.",
    plannedWork:
      "Connect notification preferences with backend APIs.",
    blockers: "",
    status: "SUBMITTED",
    managerFeedback: "",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R026",
    user: john._id,
    project: dashboardProject._id,
    weekNumber: 6,
    workCompleted:
      "Implemented correction request functionality and manager feedback display.",
    plannedWork:
      "Improve report version history and final testing.",
    blockers: "",
    status: "SUBMITTED",
    managerFeedback: "",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R027",
    user: nimal._id,
    project: dashboardProject._id,
    weekNumber: 6,
    workCompleted:
      "Implemented project workload and team member workload charts.",
    plannedWork:
      "Perform analytics testing and dashboard improvements.",
    blockers: "",
    status: "APPROVED",
    managerFeedback:
      "Charts are displaying the correct workload information.",
    manager: manager._id,
  }),

  createReport({
    reportNumber: "R028",
    user: kasun._id,
    project: ecommerceProject._id,
    weekNumber: 6,
    workCompleted:
      "Implemented order history and customer order tracking functionality.",
    plannedWork:
      "Perform final testing and resolve remaining issues.",
    blockers: "",
    status: "NEEDS_CORRECTION",
    managerFeedback:
      "Please add test coverage details before final approval.",
    manager: manager._id,
  }),
];

const reports = await Report.insertMany(
  reportsData,
);

console.log(
  `${reports.length} reports inserted successfully`,
);

console.log("");
console.log(
  "Database seeded successfully",
);
console.log("");
console.log("Manager Login:");
console.log(
  "Email: sarah.manager@example.com",
);
console.log("Password: Password123");
console.log("");
console.log("Team Member Login:");
console.log(
  "Email: john.perera@example.com",
);
console.log("Password: Password123");
console.log("");
console.log(`Users: ${users.length}`);
console.log(
  `Projects: ${projects.length}`,
);
console.log(
  `Reports: ${reports.length}`,
);

} catch (error) {
console.error("Seed error:", error);
} finally {
await mongoose.connection.close();
console.log(
"MongoDB connection closed",
);
}
};

seedDatabase();