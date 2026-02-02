const WebSocket = require('ws');
const websocketClients=require('./clients')
const handleMessage=require("./messageHandler")
module.exports = () => {
    const wss = new WebSocket.Server({
        host: '0.0.0.0',  // Listen on all network interfaces
        port: 8080
    })
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
            handleMessage(ws, payload);
        })
        ws.on('close', () => {
            console.log("WebSocket connection closed");
            const phone = Object.keys(websocketClients).find(key => websocketClients[key] === ws);
            delete websocketClients[phone];
        });
    })
}