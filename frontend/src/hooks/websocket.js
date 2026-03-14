import { useState, useEffect } from 'react';

import React from 'react'

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

function websocket() {
    const [ws, setWs] = useState(null);
    useEffect(() => {
        const socket = new WebSocket(WS_URL);
        setWs(socket);
        return () => {
            socket.close();
        };
    }, []);
    
}
