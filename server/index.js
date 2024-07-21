const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/connectDB");
const router = require("./routes/index");
const cookiesParser = require("cookie-parser");
const { app, server } = require("./socket/index");
const path = require("path");

const _dirname = __dirname; // Use __dirname
const buildpath = path.join(_dirname, "../client/build");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Use environment variable or default to "*"
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static(buildpath));
app.use(cookiesParser());

const PORT = process.env.PORT || 8080;

app.get("/", (request, response) => {
  response.json({
    message: "Server running at " + PORT,
  });
});

// API endpoints
app.use("/api", router);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("Server running at " + PORT);
  });
});
