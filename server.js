require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const root = require("./routes/root");
const register = require("./routes/register");
const login = require("./routes/login");
const refresh = require("./routes/refresh");
const logout = require("./routes/logout");
const corsConfigs = require("./configs/corsConfigs");
const { logger } = require("./middlewares/logEvent");
const errorHandler = require("./middlewares/errorHandler");
const credentials = require("./middlewares/credentials");
const cors = require("cors");
const employeesAPI = require("./routes/api/employees");
const verifyJWT = require("./middlewares/verifyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dbConnection = require("./configs/dbConfig");

const PORT = process.env.PORT || 1100;

// connect to mongo db
dbConnection();

// register middlewares

// custom middleware
app.use(logger);

app.use(credentials);

app.use(cors(corsConfigs));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

// serve static files
app.use("/", express.static(path.join(__dirname, "public")));

// register routes
app.use("/", root);
app.use("/register", register);
app.use("/login", login);
app.use("/refresh", refresh);
app.use("/logout", logout);

app.use(verifyJWT);
app.use("/api/employees", employeesAPI);

// 404 error handling
app.all("*", (req, res) => {
  res.status(404);
  // if (req.accepted("html")) {
  res.sendFile(path.join(__dirname, "views", "404.html"));
  // } else if (req.accepted("json")) {
  //   res.json({ error: "404 not found" });
  // } else {
  //   res.type("txt").send("404 not found");
  // }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connect to mongodb");

  app.listen(PORT, () => {
    `The server is up and running on port ${PORT}`;
  });
});
