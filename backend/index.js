require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

const authRoute = require("./src/modules/auth/auth.router");
const userRoute = require("./src/modules/users/user.routes");
const projectRoute = require("./src/modules/project/project.route");
const reportRoute = require("./src/modules/report/report.route");
const dashboardRoute = require("./src/modules/dashboard/dashbaord.routes");
const errorHandler = require("./src/middleware/errorHandler.middleware");

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use("/auth",authRoute);
app.use("/users",userRoute);
app.use("/projects", projectRoute);
app.use("/reports",reportRoute);
app.use("/dashboard", dashboardRoute);
  
app.get("/health", (req, res) => {
  res.send("Welcome to the Weekly Report Team Dashboard Backend");
});

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
