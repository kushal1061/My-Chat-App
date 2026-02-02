const express = require('express');
const multer= require('multer')
require("dotenv").config();
const fs = require("fs")
const connectdb=require('./config/db');
//--------------------routes------------------------
const chatRoutes=require("./routes/chat.routes");
const userRoutes = require("./routes/user.routes");
//----------------------------------------------------

connectdb()

const cors = require('cors');
const getUrl=require('./config/s3')
const startWsServer=require('./websocket/index')
startWsServer();
//         if (payload.type == "ice") {
//             wss.clients.forEach(client => {
//                 if (client !== ws && client.readyState === websocket.OPEN) {
//                     client.send(JSON.stringify({
//                         type: "ice",
//                         data: payload.data,
//                         from: payload.from
//                     }))
//                 }
//             });
//         }
//         else if (payload.type === "offer") {
//             wss.clients.forEach(client => {
//                 if (client !== ws && client.readyState === websocket.OPEN) {
//                     client.send(JSON.stringify({
//                         type: "offer",
//                         data: payload.data,
//                         from: payload.from
//                     }))
//                 }
//             });
//         }
//         else if (payload.type === "answer") {
//             wss.clients.forEach(client => {
//                 if (client !== ws && client.readyState === websocket.OPEN) {
//                     client.send(JSON.stringify({
//                         type: "answer",
//                         data: payload.data,
//                         from: payload.from
//                     }))
//                 }
//             });
//         }
//     console.log("WebSocket connection established");
//     ws.on('message', async (message) => {
//         let payload;
//         try {
//             payload = JSON.parse(message);
//         }
//         catch (e) {
//             console.log("Invalid JSON:", e);
//             return;
//         }
const app = express();
app.use(cors())
const port = 5000;
app.use(express.json());
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
var storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});
const upload = multer({ storage: storage });
app.post("/upload",upload.single("file"),async (req, res) => {
    try{
        const region="ap-south-1"
        const bucket=process.env.BUCKET
        const key="uploads/"+req.file.name;
        const url=await getUrl(
            {
                region,
                bucket,
                key
            }
        );
        console.log(url);
        res.json(url);
    }
    catch(e){
        console.log(e);
    }
});
app.use("/api/user", userRoutes)
app.use("",chatRoutes)