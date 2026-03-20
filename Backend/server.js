require("dotenv").config();
const express = require("express");
const connectdb = require("./config/db");
const cors = require("cors");
const startWsServer = require("./websocket/index");
const http = require("http");

//--------------------routes------------------------
const chatRoutes = require("./routes/chat.routes");
const userRoutes = require("./routes/user.routes");
const uploadRoutes = require("./routes/upload.routes");
//----------------------------------------------------

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api", chatRoutes);
app.use("/api", uploadRoutes);

// Connect DB
connectdb();

// Create HTTP server
const server = http.createServer(app);

// Start HTTP server
server.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
});

// Start WebSocket server (ONLY ONCE)
startWsServer(server);