import { useEffect, useRef } from "react";

/**
 * Manages the WebSocket connection lifecycle.
 * @param {function} onMessage - Called with the parsed message object on every ws.onmessage event.
 * @returns {{ wsRef: React.MutableRefObject<WebSocket|null> }}
 */
export function useWebSocket(onMessage) {
    const wsRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const ws = new WebSocket("ws://localhost:8000");
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "auth", token }));
        };

        ws.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if (onMessage) await onMessage(data);
        };

        ws.onerror = (err) => console.error("WS error", err);
        ws.onclose = () => console.log("WebSocket closed");

        return () => ws.close();
        // onMessage is intentionally excluded – it's a stable callback ref passed from Home
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { wsRef };
}
