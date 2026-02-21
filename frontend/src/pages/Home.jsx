import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Send } from "lucide-react";
import axios from 'axios'
export default function Home() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState();
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const wsRef = useRef(null);
  const bottomRef = useRef(null);
  const selectedChat = chats.find((c) => c._id === selectedChatId);
  const token = localStorage.getItem("token");
  const me = localStorage.getItem("phone");
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    console.log("again")
    const token = localStorage.getItem("token");
    getChats(token);
    const ws = new WebSocket("ws://localhost:8000");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");

      ws.send(JSON.stringify({
        type: "auth",
        token,
        phone: me
      }))

    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);

      // example: new message
      if (data.type === "chat") {
        console.log(data.message)
        setMessages(prev => [data, ...prev]);
      }
    };

    ws.onerror = (err) => {
      console.error("WS error", err);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close(); // ✅ cleanup
    };
  }, [])
  const handleSearch = (query) => {
    // if (!loggedin) return;
    if (!query?.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    axios.post("http://localhost:5000/api/user/searchUsers", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      query,
      // userId
    }).then((res) => {
      console.log(res);
      setSearchResults(res.data);
    }).catch((e) => console.log(e))
      .finally(() => setIsSearching(false));
  }
  const handleSearchResultClick = (user) => {
    // create chat
    if (user.chatId) {
      setSelectedChatId(user.chatId);
      getMessage(user.chatId);
      return;
    }
    axios.post("http://localhost:5000/api/createChat", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      participants: [user.phone, me]
    }).then((res) => {
      console.log(res);
      const newChat = res.data;
      setChats(prev => [newChat, ...prev]);
      setSelectedChatId(newChat.chatId);
      setMessages([]);
    }).catch((e) => console.log(e))
  };
  const handleFile = async (e) => {
    const formdata = new FormData();
    const file = e.target.files[0];
    const fileName = file.name;
    if (!file) return;
    formdata.append("file", file)
    const res = await axios.post("http://localhost:5000/api/upload", { fileName, token });
    const url = res.data
    console.log(res.data);
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });
    // item url 
    const msg = {};
    wsRef.current.send(JSON.stringify({
      type: "chat",
      message: {
        sender: me,
        chatId: selectedChatId,
        text: url,
        type: "file"
      }
    }))
    setMessages(prev => [
      msg,
      ...prev
    ])
  }
  const getChats = (token) => {
    // if(!loggedin) return ;
    axios.post("http://localhost:5000/api/getChats", {}, {
      // userId,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res);
      setChats(res.data);
    }).catch((e) => console.log(e))
  }
  const getMessage = (chatId) => {
    axios.post("http://localhost:5000/api/getChat", {
      // userId,
      chatId
    },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then((res) => {
      console.log(res);
      setMessages(res.data);
    }).catch((e) => console.log(e))
  }
  const sendMessage = () => {
    if (!input.trim()) return;
    if (!selectedChatId) return;

    const msg = {
      type: "chat",
      sender: me,
      chatId: selectedChatId,
      text: input
    };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
      setInput("");
    } else {
      console.warn("WebSocket not connected");
    }
    setMessages(prev => [
      msg,
      ...prev
    ])
  };
  const filteredChats = chats.filter((chat) =>
    chat.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-white shadow-xl shadow-secondary-200/50 grid grid-cols-1 md:grid-cols-4 border border-secondary-200 rounded-2xl overflow-hidden">
        {/* Sidebar */}
        <div className="md:col-span-1 border-r border-secondary-200 flex flex-col bg-white">
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-secondary-100">
            <span className="font-bold text-lg text-secondary-900 tracking-tight">Chats</span>
            <Link
              to="/profile"
              className="text-xs font-medium px-4 py-1.5 rounded-full border border-secondary-200 bg-secondary-50 text-secondary-600 hover:bg-secondary-100 transition-colors"
            >
              Profile
            </Link>
          </div>
          {/* Search */}
          <div className="p-4 border-b border-secondary-100">
            <div className="flex items-center gap-2 bg-secondary-50 border border-secondary-200 rounded-xl px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-400">
              <Search size={18} className="text-secondary-400" />
              <input
                className="bg-transparent outline-none text-sm w-full text-secondary-900 placeholder:text-secondary-400"
                placeholder="Search or start new chat"
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  handleSearch(value);
                }}
              />
            </div>
            {(isSearching || searchResults.length > 0) && (
              <div className="mt-3 max-h-60 overflow-y-auto bg-white border border-secondary-200 rounded-xl shadow-lg z-10 custom-scrollbar">
                {isSearching && (
                  <div className="px-4 py-3 text-xs text-secondary-500">Searching...</div>
                )}
                {!isSearching && searchResults.length === 0 && (
                  <div className="px-4 py-3 text-xs text-secondary-500">No results found</div>
                )}
                {!isSearching && searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="px-4 py-3 text-sm hover:bg-secondary-50 cursor-pointer border-b border-secondary-50 last:border-0 transition-colors"
                    onClick={() => handleSearchResultClick(user)}
                  >
                    <div className="font-semibold text-secondary-900">{user.name || user.phone}</div>
                    {user.phone && (
                      <div className="text-xs text-secondary-500 mt-0.5">{user.phone}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredChats.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-secondary-400">
                <p className="text-sm">No chats yet</p>
              </div>
            )}
            {filteredChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  setSelectedChatId(chat._id)
                  getMessage(chat._id);
                }}
                className={`px-5 py-4 cursor-pointer border-b border-secondary-50 transition-all duration-200 ${chat._id === selectedChatId
                    ? "bg-primary-50 border-r-4 border-r-primary-500"
                    : "hover:bg-secondary-50"
                  }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className={`font-semibold text-sm ${chat._id === selectedChatId ? "text-primary-900" : "text-secondary-900"}`}>
                    {chat.name}
                  </div>
                </div>
                <div className={`text-xs truncate ${chat._id === selectedChatId ? "text-primary-600" : "text-secondary-500"}`}>
                  {chat.lastMessage || "No messages yet"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-3 flex flex-col bg-secondary-50/50">
          {/* Header */}
          <div className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                {selectedChat ? selectedChat.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="font-semibold text-secondary-900">
                {selectedChat ? selectedChat.name : "Select a chat"}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-secondary-50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-secondary-400 space-y-2">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center">
                  <Send className="text-secondary-300 ml-1" size={24} />
                </div>
                <p className="text-sm font-medium">{selectedChat ? "No messages yet" : "Pick a chat to start messaging"}</p>
              </div>
            )}
            {messages.slice().reverse().map((msg, idx) => {
              const isMe = msg.sender == me;
              return (
                <div
                  key={msg._id || idx}
                  className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-5 py-3 text-sm shadow-sm relative group ${isMe
                        ? "bg-primary-600 text-white rounded-2xl rounded-tr-sm"
                        : "bg-white text-secondary-900 border border-secondary-200 rounded-2xl rounded-tl-sm"
                      }`}
                  >
                    <div className="leading-relaxed">{msg.text}</div>
                    <div className={`text-[10px] mt-1 text-right ${isMe ? "text-primary-100" : "text-secondary-400"}`}>
                      {msg.time || ""}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-secondary-200">
            <div className="flex gap-3 items-center max-w-4xl mx-auto">
              <label className="cursor-pointer p-2 rounded-full text-secondary-400 hover:bg-secondary-50 hover:text-primary-600 transition-colors">
                <input type="file" className="hidden" onChange={(e) => handleFile(e)} />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
              </label>
              <div className="flex-1 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="w-full bg-secondary-50 rounded-xl px-5 py-3 text-sm outline-none border border-secondary-200 focus:border-primary-300 focus:ring-4 focus:ring-primary-50 transition-all"
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-primary-600/20"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
