import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

/**
 * Manages messages for the currently selected chat.
 * @param {{ wsRef: React.MutableRefObject<WebSocket|null>, selectedChatId: string|undefined, onAfterSend: (chatId:string, text:string)=>void }}
 */
export function useMessages({ wsRef, selectedChatId, onAfterSend }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    const token = localStorage.getItem("token");
    const me = localStorage.getItem("userId");

    // ── Auto-scroll to latest message ──
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ── Fetch chat history ──
    const getMessage = useCallback(
        (chatId) => {
            axios
                .post(
                    `${API_BASE_URL}/api/getChat`,
                    { chatId },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => setMessages(res.data))
                .catch(console.error);
        },
        [token]
    );

    // ── Send a text message ──
    const sendMessage = useCallback(() => {
        if (!input.trim() || !selectedChatId) return;
        const msg = {
            type: "chat",
            message: {
                sender: me,
                chatId: selectedChatId,
                text: input,
            },
        };
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(msg));
        }
        setMessages((prev) => [msg, ...prev]);
        onAfterSend?.(selectedChatId, input);
        setInput("");
    }, [input, selectedChatId, me, wsRef, onAfterSend]);

    // ── Upload a file then send as a message ──
    const handleFile = useCallback(
        async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Detect type from MIME
            let msgType = 'document';
            if (file.type.startsWith('image/')) msgType = 'image';
            else if (file.type.startsWith('video/')) msgType = 'video';

            const res = await axios.post(
                `${API_BASE_URL}/api/upload`,
                { fileName: file.name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const { url, fileurl } = res.data;
            await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const msg = {
                type: "chat",
                message: {
                    sender: me,
                    chatId: selectedChatId,
                    text: fileurl,
                    type: msgType,
                },
            };
            wsRef.current?.send(JSON.stringify(msg));
            setMessages((prev) => [msg, ...prev]);
        },
        [token, me, selectedChatId, wsRef]
    );

    // ── Append an incoming message (called from Home's WS onMessage) ──
    const appendMessage = useCallback((msg) => {
        setMessages((prev) => [msg, ...prev]);
    }, []);

    return {
        messages,
        setMessages,
        input,
        setInput,
        bottomRef,
        getMessage,
        sendMessage,
        handleFile,
        appendMessage,
    };
}
