const WebSocket = require('ws');
const websocketClients=require('./clients')
const handleMessage=require("./messageHandler")
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
            handleMessage(ws, payload);
        })
        ws.on('close', () => {
            console.log("WebSocket connection closed");
            const phone = Object.keys(websocketClients).find(key => websocketClients[key] === ws);
            delete websocketClients[phone];
        });
    })
}