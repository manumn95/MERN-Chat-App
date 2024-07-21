const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/connectDB");
const router = require("./routes/index");
const cookiesParser = require("cookie-parser");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
const _dirname = __dirname;
const buildpath = path.join(_dirname, "../client/build");
app.use(express.static(buildpath));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

app.use(cookiesParser());

const PORT = process.env.PORT || 8080;

app.get("/", (request, response) => {
  response.json({
    message: "Server running at " + PORT,
  });
});

// API endpoints
app.use("/api", router);

// Initialize socket.io
io.on("connection", async (socket) => {
  console.log("connect User ", socket.id);

  const token = socket.handshake.auth.token;
  console.log("Token received:", token);

  try {
    //current user details
    const user = await getUserDetailsFromToken(token);
    console.log("User details:", user);

    //create a room
    socket.join(user?._id.toString());
    onlineUser.add(user?._id?.toString());

    io.emit("onlineUser", Array.from(onlineUser));

    // Add event handlers here (message-page, new message, etc.)
    // ...

    socket.on("disconnect", () => {
      onlineUser.delete(user?._id?.toString());
      console.log("disconnect user ", socket.id);
    });
  } catch (error) {
    console.error("Error during connection setup:", error);
  }
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("Server running at " + PORT);
  });
});
