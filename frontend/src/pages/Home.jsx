import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageBubble from "../components/chat/MessageBubble";
import ChatInput from "../components/chat/ChatInput";
import EmptyState from "../components/chat/EmptyState";

export default function Home() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState();
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const wsRef = useRef(null);
  const bottomRef = useRef(null);
  const selectedChatIdRef = useRef(selectedChatId);
  const selectedChat = chats.find((c) => c._id === selectedChatId);
  const token = localStorage.getItem("token");
  const me = localStorage.getItem("userId");

  // ── Auto-scroll ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Sync ref ──
  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);

  // ── WebSocket ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    getChats(token);
    const ws = new WebSocket("ws://localhost:8000");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "auth", token }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat") {
        console.log("Received chat message:", selectedChatId ,data.chatId);
        if (selectedChatIdRef.current === data.chatId) {
          console.log(selectedChatIdRef.current);
          setMessages((prev) => [data, ...prev]);
        }
        const incomingChatId = data.chatId || data.message?.chatId;
        console.log("Received message for chatId:", data);
        if (incomingChatId && incomingChatId !== selectedChatIdRef.current) {
          setUnreadCounts((prev) => ({
            ...prev,
            [incomingChatId]: (prev[incomingChatId] || 0) + 1,
          }));
        }
      }
    };

    ws.onerror = (err) => console.error("WS error", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, []);

  // ── API calls ──
  const handleSearch = (query) => {
    setSearch(query);
    if (!query?.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    axios
      .post(
        "http://localhost:5000/api/user/searchUsers",
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setSearchResults(res.data))
      .catch(console.error)
      .finally(() => setIsSearching(false));
  };

  const handleSearchResultClick = (user) => {
    if (user.chatId) {
      setSelectedChatId(user.chatId);
      getMessage(user.chatId);
      setSearch("");
      setSearchResults([]);
      return;
    }
    axios
      .post(
        "http://localhost:5000/api/createChat",
        { participants: [user._id, me] },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const newChat = res.data.chat;
        setChats((prev) => [newChat, ...prev]);
        console.log(chats);
        setSelectedChatId(newChat._id);
        setMessages([]);
        setSearch("");
        setSearchResults([]);
      })
      .catch(console.error);
  };

  const getChats = (token) => {
    axios
      .post(
        "http://localhost:5000/api/getChats",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setChats(res.data)
        console.log(res.data)
      })
      .catch(console.error);
  };

  const getMessage = (chatId) => {
    axios
      .post(
        "http://localhost:5000/api/getChat",
        { chatId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setMessages(res.data))
      .catch(console.error);
  };
  const sortChatsAfterMessage = (chatId, text) => {
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
  };
  const sendMessage = () => {
    if (!input.trim() || !selectedChatId) return;
    const msg = {
      type: "chat",
      message: {
        sender: me,
      chatId: selectedChatId,
      text: input
      }
    };
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
      setInput("");
    }
    setMessages((prev) => [msg, ...prev]);
    sortChatsAfterMessage(selectedChatId, input);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileName = file.name;
    const res = await axios.post("http://localhost:5000/api/upload", {
      fileName,
    },{ headers: { Authorization: `Bearer ${token}` } });
    const {url,fileurl} = res.data;
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const msg={
        type: "chat",
        message: {
          sender: me,
          chatId: selectedChatId,
          text: fileurl,
          type: "image",
        },
      }
    wsRef.current.send(
      JSON.stringify(msg)
    );
    setMessages((prev) => [msg, ...prev]);
  };

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    getMessage(chatId);
    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[chatId];
      return next;
    });
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-surface-secondary">
      {/* Lightbox */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={zoomedImage}
              alt="Zoomed"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        unreadCounts={unreadCounts}
        search={search}
        onSearchChange={handleSearch}
        searchResults={searchResults}
        isSearching={isSearching}
        onSearchResultClick={handleSearchResultClick}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-surface">
        <ChatHeader
          chat={selectedChat}
          onAvatarClick={setZoomedImage}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(false)}
        />

        {/* Messages */}
        {!selectedChat ? (
          <EmptyState hasChat={false} />
        ) : messages.length === 0 ? (
          <EmptyState hasChat={true} />
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
            {messages
              .slice()
              .reverse()
              .map((msg, idx) => (
                <MessageBubble
                  key={msg._id || idx}
                  message={msg}
                  isMe={msg.sender == me}
                />
              ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <ChatInput
          input={input}
          onInputChange={setInput}
          onSend={sendMessage}
          onFileSelect={handleFile}
          disabled={!selectedChatId}
        />
      </main>
    </div>
  );
}
