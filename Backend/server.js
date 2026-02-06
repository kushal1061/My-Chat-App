require("dotenv").config()
const express = require('express');
const connectdb=require('./config/db');
const cors = require('cors');
const startWsServer=require('./websocket/index');
//--------------------routes------------------------
const chatRoutes=require("./routes/chat.routes");
const userRoutes = require("./routes/user.routes");
const uploadRoutes=require("./routes/upload.routes");
//----------------------------------------------------
connectdb()
startWsServer();
const app = express();
const port = 5000;
app.use(cors())
app.use(express.json());
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
app.use("/api/user", userRoutes)
app.use("/api",chatRoutes)
app.use("/api",uploadRoutes)