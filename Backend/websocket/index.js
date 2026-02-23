const WebSocket = require('ws');
const websocketClients = require('./clients')
const handleMessage = require("./messageHandler")
const User = require('../model/user')
module.exports = () => {
    const port = process.env.WS_PORT ? Number(process.env.WS_PORT) : 8000;
    const wss = new WebSocket.Server({
        host: '0.0.0.0',  // Listen on all network interfaces
        port
    })
    wss.on('error', (err) => {
        console.error('WebSocket server error:', err);
        if (err && err.code === 'EADDRINUSE') {
            console.error(`Port ${port} in use. WebSocket server not started.`);
        }
    });
    wss.on('listening', () => {
        console.log(`WebSocket server listening on port ${port}`);
    });
    wss.on('connection', (ws) => {
        console.log("websocket connection established")
        ws.on('message', async (message) => {
            let payload;
            try {
                payload = JSON.parse(message);
            }
            catch (e) {
                console.log("Invalid JSON:", e);
                return;
            }
            if(payload.type=="ice"){
            wss.clients.forEach(client=>{
                if(client!==ws && client.readyState===WebSocket.OPEN){
                    client.send(JSON.stringify({
                        type:"ice",
                        data:payload.data,
                        from:payload.from
                    }))
                }});
        }
        else if(payload.type==="offer"){
            wss.clients.forEach(client=>{
                if(client!==ws && client.readyState===WebSocket.OPEN){
                    client.send(JSON.stringify({
                        type:"offer",
                        data:payload.data,
                        from:payload.from
                    }))
                }});
        }
        else if(payload.type==="answer"){
            wss.clients.forEach(client=>{
                if(client!==ws && client.readyState===WebSocket.OPEN){
                    client.send(JSON.stringify({
                        type:"answer",
                        data:payload.data,
                        from:payload.from
                    }))
                }});
        }
            handleMessage(ws, payload);
        })
        ws.on('close', async () => {
            console.log("WebSocket connection closed");
            const id = Object.keys(websocketClients).find(key => websocketClients[key] === ws);
            if (id) {
                const user = await User.findById(id);
                if (user) {
                    user.status = "offline";
                    await user.save();
                }
            }
            delete websocketClients[id];
        });
    })
}