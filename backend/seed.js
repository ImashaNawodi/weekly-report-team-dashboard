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
    baseDate.getUTCDate() + (weekNumber - 1) * 7
  );

  const weekEnd = new Date(weekStart);

  weekEnd.setUTCDate(
    weekStart.getUTCDate() + 6
  );

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
  taskName,
  taskPriority = "Medium",
  plannedTaskDescription,
  plannedTaskPriority = "Medium",
  expectedOutcome,
  blockerDescription = "",
  blockerSeverity = "Medium",
  achievementDescription,
  notes = "",
  links = "",
  status,
  managerFeedback = "",
  manager,
}) => {
  const { weekStart, weekEnd } =
    getWeekDates(weekNumber);

  const submittedAt = new Date(
    weekEnd.getTime() + 9 * 60 * 60 * 1000
  );

  const reviewedAt =
    status === "APPROVED" ||
    status === "NEEDS_CORRECTION"
      ? new Date(
          submittedAt.getTime() +
            24 * 60 * 60 * 1000
        )
      : null;

  const report = {
    reportNumber,
    user,
    project,
    weekNumber,
    weekStart,
    weekEnd,

    tasks: [
      {
        name: taskName,
        priority: taskPriority,
        plannedPct: 100,
        actualPct:
          status === "APPROVED"
            ? 100
            : status === "NEEDS_CORRECTION"
            ? 70
            : 80,
        status:
          status === "APPROVED"
            ? "Completed"
            : status === "NEEDS_CORRECTION"
            ? "In Progress"
            : "In Progress",
        plannedTime: 8,
        timeSpent: 8,
        output: achievementDescription,
      },
    ],

    plannedTasks: [
      {
        description:
          plannedTaskDescription,
        priority: plannedTaskPriority,
        expectedOutcome,
      },
    ],

    blockers:
      blockerDescription
        ? [
            {
              description:
                blockerDescription,
              severity:
                blockerSeverity,
              isKeyIssue: true,
            },
          ]
        : [],

    achievements: achievementDescription
      ? [
          {
            description:
              achievementDescription,
            isKeyAchievement: true,
          },
        ]
      : [],

    hours: [
      {
        type: "Development",
        hours: 8,
      },
    ],

    notes,
    links,
    status,
    managerFeedback,

    submittedAt,

    reviewedAt,

    reviewedBy:
      reviewedAt && manager
        ? manager
        : null,

    versions: [
      {
        versionNumber: 1,
        submittedAt,
        submittedBy: user,

        tasks: [
          {
            name: taskName,
            priority: taskPriority,
            plannedPct: 100,
            actualPct:
              status === "APPROVED"
                ? 100
                : status === "NEEDS_CORRECTION"
                ? 70
                : 80,
            status:
              status === "APPROVED"
                ? "Completed"
                : "In Progress",
            plannedTime: 8,
            timeSpent: 8,
            output:
              achievementDescription,
          },
        ],

        plannedTasks: [
          {
            description:
              plannedTaskDescription,
            priority:
              plannedTaskPriority,
            expectedOutcome,
          },
        ],

        blockers:
          blockerDescription
            ? [
                {
                  description:
                    blockerDescription,
                  severity:
                    blockerSeverity,
                  isKeyIssue: true,
                },
              ]
            : [],

        achievements:
          achievementDescription
            ? [
                {
                  description:
                    achievementDescription,
                  isKeyAchievement: true,
                },
              ]
            : [],

        hours: [
          {
            type: "Development",
            hours: 8,
          },
        ],

        notes,
        links,
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
        "MongoDB URI is missing. Add MONGODB_URL to your .env file."
      );
    }

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    await Report.deleteMany({});
    await Project.deleteMany({});
    await User.deleteMany({});

    console.log(
      "Existing users, projects and reports cleared"
    );

    const hashedPassword = await bcrypt.hash(
      "Password123",
      10
    );

    const usersData = [
      {
        userID: 1,
        firstName: "Sarah",
        lastName: "Manager",
        email: "sarah.manager@example.com",
        password: hashedPassword,
        role: "MANAGER",
        isActive: true,
      },

      {
        userID: 2,
        firstName: "John",
        lastName: "Perera",
        email: "john.perera@example.com",
        password: hashedPassword,
        role: "TEAM_MEMBER",
        isActive: true,
      },

      {
        userID: 3,
        firstName: "Nimal",
        lastName: "Silva",
        email: "nimal.silva@example.com",
        password: hashedPassword,
        role: "TEAM_MEMBER",
        isActive: true,
      },

      {
        userID: 4,
        firstName: "Kasun",
        lastName: "Fernando",
        email: "kasun.fernando@example.com",
        password: hashedPassword,
        role: "TEAM_MEMBER",
        isActive: true,
      },

      {
        userID: 5,
        firstName: "Amal",
        lastName: "Wijesinghe",
        email: "amal.wijesinghe@example.com",
        password: hashedPassword,
        role: "TEAM_MEMBER",
        isActive: true,
      },

      {
        userID: 6,
        firstName: "Sanduni",
        lastName: "Perera",
        email: "sanduni.perera@example.com",
        password: hashedPassword,
        role: "TEAM_MEMBER",
        isActive: true,
      },

      {
        userID: 7,
        firstName: "Dinesh",
        lastName: "Kumara",
        email: "dinesh.kumara@example.com",
        password: hashedPassword,
        role: "TEAM_MEMBER",
        isActive: true,
      },

      {
        userID: 8,
        firstName: "Tharushi",
        lastName: "Fernando",
        email: "tharushi.fernando@example.com",
        password: hashedPassword,
        role: "TEAM_MEMBER",
        isActive: true,
      },

      {
        userID: 9,
        firstName: "Isuru",
        lastName: "Bandara",
        email: "isuru.bandara@example.com",
        password: hashedPassword,
        role: "TEAM_MEMBER",
        isActive: true,
      },

      {
        userID: 10,
        firstName: "Piumi",
        lastName: "Jayasinghe",
        email: "piumi.jayasinghe@example.com",
        password: hashedPassword,
        role: "TEAM_MEMBER",
        isActive: true,
      },
    ];

    const users = await User.insertMany(
      usersData
    );

    console.log(
      `${users.length} users inserted successfully`
    );

    const manager = users.find(
      (user) =>
        user.email ===
        "sarah.manager@example.com"
    );

    const john = users.find(
      (user) =>
        user.email ===
        "john.perera@example.com"
    );

    const nimal = users.find(
      (user) =>
        user.email ===
        "nimal.silva@example.com"
    );

    const kasun = users.find(
      (user) =>
        user.email ===
        "kasun.fernando@example.com"
    );

    const amal = users.find(
      (user) =>
        user.email ===
        "amal.wijesinghe@example.com"
    );

    const sanduni = users.find(
      (user) =>
        user.email ===
        "sanduni.perera@example.com"
    );

    const dinesh = users.find(
      (user) =>
        user.email ===
        "dinesh.kumara@example.com"
    );

    const tharushi = users.find(
      (user) =>
        user.email ===
        "tharushi.fernando@example.com"
    );

    const isuru = users.find(
      (user) =>
        user.email ===
        "isuru.bandara@example.com"
    );

    const piumi = users.find(
      (user) =>
        user.email ===
        "piumi.jayasinghe@example.com"
    );

    const projectsData = [
      {
        projectNumber: "P001",
        name: "Weekly Report Team Dashboard",
        description:
          "A full-stack system for submitting, reviewing and managing weekly team reports.",
        teamMembers: [john._id],
        isActive: true,
      },

      {
        projectNumber: "P002",
        name: "E-Commerce Platform",
        description:
          "An online e-commerce platform with product management and order processing.",
        teamMembers: [nimal._id],
        isActive: true,
      },

      {
        projectNumber: "P003",
        name: "HR Management System",
        description:
          "An internal employee and human resource management system.",
        teamMembers: [kasun._id],
        isActive: true,
      },

      {
        projectNumber: "P004",
        name: "Customer Portal",
        description:
          "A customer self-service portal for account and support management.",
        teamMembers: [amal._id],
        isActive: true,
      },

      {
        projectNumber: "P005",
        name: "Inventory Management System",
        description:
          "A system for managing products, stock levels and inventory operations.",
        teamMembers: [sanduni._id],
        isActive: true,
      },

      {
        projectNumber: "P006",
        name: "Learning Management System",
        description:
          "A platform for managing courses, lessons, students and learning activities.",
        teamMembers: [dinesh._id],
        isActive: true,
      },

      {
        projectNumber: "P007",
        name: "Customer Support System",
        description:
          "A support platform for handling customer tickets and service requests.",
        teamMembers: [tharushi._id],
        isActive: true,
      },

      {
        projectNumber: "P008",
        name: "Employee Attendance System",
        description:
          "An employee attendance and working-hours management application.",
        teamMembers: [isuru._id],
        isActive: true,
      },

      {
        projectNumber: "P009",
        name: "Project Management Portal",
        description:
          "A project management system for tracking teams, tasks and project progress.",
        teamMembers: [piumi._id],
        isActive: true,
      },

      {
        projectNumber: "P010",
        name: "Business Analytics Dashboard",
        description:
          "A business analytics dashboard for monitoring performance and operational metrics.",
        teamMembers: [],
        isActive: true,
      },
    ];

    const projects = await Project.insertMany(
      projectsData
    );

    console.log(
      `${projects.length} projects inserted successfully`
    );

    const projectMap = {};

    projects.forEach((project) => {
      projectMap[project.projectNumber] =
        project;
    });

    const reportsData = [
      createReport({
        reportNumber: "R001",
        user: john._id,
        project:
          projectMap.P001._id,
        weekNumber: 1,
        taskName:
          "Implement authentication API",
        taskPriority: "High",
        plannedTaskDescription:
          "Implement weekly report creation APIs",
        expectedOutcome:
          "Users can securely authenticate and access the dashboard",
        achievementDescription:
          "Completed authentication API integration and registration functionality.",
        status: "APPROVED",
        managerFeedback:
          "Good progress. Authentication implementation is working correctly.",
        manager: manager._id,
      }),

      createReport({
        reportNumber: "R002",
        user: nimal._id,
        project:
          projectMap.P002._id,
        weekNumber: 1,
        taskName:
          "Create product management APIs",
        taskPriority: "High",
        plannedTaskDescription:
          "Implement product detail functionality",
        expectedOutcome:
          "Products can be created, updated and retrieved through APIs",
        achievementDescription:
          "Created product schema and implemented product listing APIs.",
        status: "APPROVED",
        managerFeedback:
          "Good API structure and implementation.",
        manager: manager._id,
      }),

      createReport({
        reportNumber: "R003",
        user: kasun._id,
        project:
          projectMap.P003._id,
        weekNumber: 1,
        taskName:
          "Design employee database",
        taskPriority: "Medium",
        plannedTaskDescription:
          "Implement employee profile APIs",
        expectedOutcome:
          "Employee information can be stored and managed",
        achievementDescription:
          "Designed employee database schema and created employee management APIs.",
        blockerDescription:
          "Waiting for confirmation of employee department requirements.",
        blockerSeverity: "Medium",
        status: "NEEDS_CORRECTION",
        managerFeedback:
          "Please provide more details about the API endpoints and testing.",
        manager: manager._id,
      }),

      createReport({
        reportNumber: "R004",
        user: amal._id,
        project:
          projectMap.P004._id,
        weekNumber: 1,
        taskName:
          "Build customer registration UI",
        taskPriority: "Medium",
        plannedTaskDescription:
          "Implement customer profile editing",
        expectedOutcome:
          "Customers can register and manage their profiles",
        achievementDescription:
          "Implemented customer registration interface and form validation.",
        status: "SUBMITTED",
        managerFeedback: "",
        manager: manager._id,
      }),

      createReport({
        reportNumber: "R005",
        user: sanduni._id,
        project:
          projectMap.P005._id,
        weekNumber: 1,
        taskName:
          "Implement inventory listing",
        taskPriority: "High",
        plannedTaskDescription:
          "Implement stock update functionality",
        expectedOutcome:
          "Inventory items can be viewed and updated",
        achievementDescription:
          "Created inventory listing interface and stock information components.",
        status: "APPROVED",
        managerFeedback:
          "The inventory interface is clear and well structured.",
        manager: manager._id,
      }),

      createReport({
        reportNumber: "R006",
        user: dinesh._id,
        project:
          projectMap.P006._id,
        weekNumber: 1,
        taskName:
          "Create course management module",
        taskPriority: "High",
        plannedTaskDescription:
          "Implement lesson management",
        expectedOutcome:
          "Administrators can create and manage courses",
        achievementDescription:
          "Created course management screens and course API integration.",
        status: "APPROVED",
        managerFeedback:
          "Good progress on the course management module.",
        manager: manager._id,
      }),

      createReport({
        reportNumber: "R007",
        user: tharushi._id,
        project:
          projectMap.P007._id,
        weekNumber: 2,
        taskName:
          "Implement support ticket creation",
        taskPriority: "High",
        plannedTaskDescription:
          "Add ticket status management",
        expectedOutcome:
          "Customers can create and track support tickets",
        achievementDescription:
          "Implemented support ticket creation and ticket listing functionality.",
        status: "SUBMITTED",
        managerFeedback: "",
        manager: manager._id,
      }),

      createReport({
        reportNumber: "R008",
        user: isuru._id,
        project:
          projectMap.P008._id,
        weekNumber: 2,
        taskName:
          "Implement attendance tracking",
        taskPriority: "High",
        plannedTaskDescription:
          "Create attendance reports",
        expectedOutcome:
          "Employee attendance can be recorded and reviewed",
        achievementDescription:
          "Implemented employee attendance recording and daily attendance views.",
        status: "APPROVED",
        managerFeedback:
          "Attendance functionality is working correctly.",
        manager: manager._id,
      }),

      createReport({
        reportNumber: "R009",
        user: piumi._id,
        project:
          projectMap.P009._id,
        weekNumber: 2,
        taskName:
          "Create project task management",
        taskPriority: "High",
        plannedTaskDescription:
          "Implement project progress tracking",
        expectedOutcome:
          "Managers can monitor project tasks and progress",
        achievementDescription:
          "Created task management interface and project progress components.",
        status: "NEEDS_CORRECTION",
        managerFeedback:
          "Please add more details about task validation and testing.",
        manager: manager._id,
      }),

      createReport({
        reportNumber: "R010",
        user: john._id,
        project:
          projectMap.P001._id,
        weekNumber: 2,
        taskName:
          "Implement weekly report dashboard",
        taskPriority: "High",
        plannedTaskDescription:
          "Connect dashboard analytics with report APIs",
        expectedOutcome:
          "Managers can view weekly report statistics",
        achievementDescription:
          "Implemented report statistics cards and weekly summary calculations.",
        status: "APPROVED",
        managerFeedback:
          "Dashboard statistics are correct and clearly presented.",
        manager: manager._id,
      }),
    ];

    const reports = await Report.insertMany(
      reportsData
    );

    console.log(
      `${reports.length} reports inserted successfully`
    );

    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      "Database seeded successfully"
    );
    console.log(
      "======================================"
    );

    console.log("");

    console.log("Manager Login:");
    console.log(
      "Email: sarah.manager@example.com"
    );
    console.log(
      "Password: Password123"
    );

    console.log("");

    console.log("Team Member Login:");
    console.log(
      "Email: john.perera@example.com"
    );
    console.log(
      "Password: Password123"
    );

    console.log("");

    console.log(`Users: ${users.length}`);
    console.log(
      `Projects: ${projects.length}`
    );
    console.log(
      `Reports: ${reports.length}`
    );

    console.log("");

    console.log(
      "Project Assignment Check:"
    );

    projects.forEach((project) => {
      console.log(
        `${project.projectNumber} - ${project.name} - ${project.teamMembers.length} member(s)`
      );
    });

    console.log("");

    console.log(
      "Report Week Check:"
    );

    reports.forEach((report) => {
      console.log(
        `${report.reportNumber} - User: ${report.user} - Week: ${report.weekNumber}`
      );
    });
  } catch (error) {
    console.error(
      "Seed error:",
      error
    );
  } finally {
    await mongoose.connection.close();

    console.log(
      "MongoDB connection closed"
    );
  }
};

seedDatabase();