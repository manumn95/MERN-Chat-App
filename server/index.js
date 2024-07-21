const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/connectDB");
const router = require("./routes/index");
const cookiesParser = require("cookie-parser");
const { app, server } = require("./socket/index");
const path = require("path");

const _dirname = __dirname; 
const buildpath = path.join(_dirname, "../client/build");

console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("BACKEND_URL:", process.env.BACKEND_URL);


app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
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
