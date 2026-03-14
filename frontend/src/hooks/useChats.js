import { useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

/**
 * Manages the chat list, user search, and unread counts.
 */
export function useChats() {
    const [chats, setChats] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState({});

    const token = localStorage.getItem("token");
    const me = localStorage.getItem("userId");

    // ── Fetch chat list ──
    const getChats = useCallback(() => {
        axios
            .post(
                `${API_BASE_URL}/api/getChats`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                setChats(res.data);
                console.log(res.data);
            })
            .catch(console.error);
    }, [token]);

    // ── Search users ──
    const handleSearch = useCallback(
        (query) => {
            setSearch(query);
            if (!query?.trim()) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            axios
                .post(
                    `${API_BASE_URL}/api/user/searchUsers`,
                    { query },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => setSearchResults(res.data))
                .catch(console.error)
                .finally(() => setIsSearching(false));
        },
        [token]
    );

    // ── Open or create a chat from a search result ──
    const handleSearchResultClick = useCallback(
        (user, onChatReady) => {
            if (user.chatId) {
                onChatReady(user.chatId);
                setSearch("");
                setSearchResults([]);
                return;
            }
            axios
                .post(
                    `${API_BASE_URL}/api/createChat`,
                    { participants: [user._id, me] },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                    const newChat = res.data.chat;
                    setChats((prev) => [newChat, ...prev]);
                    onChatReady(newChat._id, true);
                    setSearch("");
                    setSearchResults([]);
                })
                .catch(console.error);
        },
        [token, me]
    );

    // ── Move the chat with the latest message to the top ──
    const sortChatsAfterMessage = useCallback((chatId, text) => {
        setChats((prevChats) => {
            const updatedChat = prevChats.find((chat) => chat._id === chatId);
            if (!updatedChat) return prevChats;
            const nextChat = {
                ...updatedChat,
                lastMessage: {
                    ...(updatedChat.lastMessage || {}),
                    text,
                    time: new Date(),
                },
            };
            const remaining = prevChats.filter((chat) => chat._id !== chatId);
            return [nextChat, ...remaining];
        });
    }, []);

    // ── Unread badge helpers ──
    const incrementUnread = useCallback((chatId) => {
        setUnreadCounts((prev) => ({
            ...prev,
            [chatId]: (prev[chatId] || 0) + 1,
        }));
    }, []);

    const clearUnread = useCallback((chatId) => {
        setUnreadCounts((prev) => {
            const next = { ...prev };
            delete next[chatId];
            return next;
        });
    }, []);

    return {
        chats,
        search,
        searchResults,
        isSearching,
        unreadCounts,
        getChats,
        handleSearch,
        handleSearchResultClick,
        sortChatsAfterMessage,
        incrementUnread,
        clearUnread,
    };
}
