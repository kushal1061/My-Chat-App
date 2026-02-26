import { useState, useEffect } from 'react';

import React from 'react'

function websocket() {
    const [ws, setWs] = useState(null);
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8000");
        setWs(socket);
        return () => {
            socket.close();
        };
    }, []);
    
}
