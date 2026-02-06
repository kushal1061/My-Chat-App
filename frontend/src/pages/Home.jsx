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
      token,
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
      token,
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
    const res = await axios.post("http://localhost:5000/api/upload", {fileName, token});
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
  axios.post("http://localhost:5000/api/getChats", {
    // userId,
    token
  }).then((res) => {
    console.log(res);
    setChats(res.data);
  }).catch((e) => console.log(e))
}
const getMessage = (chatId) => {
  axios.post("http://localhost:5000/api/getChat", {
    // userId,
    token,
    chatId
  }).then((res) => {
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
  <div className="min-h-screen w-full bg-[#f0f2f5] flex items-center justify-center px-2 py-4">
    <div className="w-full max-w-6xl h-[90vh] bg-white shadow-md grid grid-cols-1 md:grid-cols-4 border border-gray-200 rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="md:col-span-1 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
          <span className="font-medium text-sm">Chats</span>
          <Link
            to="/profile"
            className="text-xs px-3 py-1 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          >
            Profile
          </Link>
        </div>
        {/* Search */}
        <div className="p-2 border-b border-gray-200">
          <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-2">
            <Search size={16} className="text-gray-500" />
            <input
              className="bg-transparent outline-none text-sm w-full"
              placeholder="Search or start new chat"

              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                handleSearch(value);
              }
              }
            />
          </div>
          {(isSearching || searchResults.length > 0) && (
            <div className="mt-2 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-sm">
              {isSearching && (
                <div className="px-3 py-2 text-xs text-gray-500">Searching...</div>
              )}
              {!isSearching && searchResults.length === 0 && (
                <div className="px-3 py-2 text-xs text-gray-500">No results</div>
              )}
              {!isSearching && searchResults.map((user) => (
                <div
                  key={user._id}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSearchResultClick(user)}
                >
                  <div className="font-medium text-gray-800">{user.name || user.phone}</div>
                  {user.phone && (
                    <div className="text-xs text-gray-500">{user.phone}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 && (
            <div className="px-4 py-6 text-sm text-gray-500">
              No chats yet
            </div>
          )}
          {filteredChats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                setSelectedChatId(chat._id)
                getMessage(chat._id);
              }}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 ${chat._id === selectedChatId ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium text-sm">{chat.name}</div>
              </div>
              <div className="text-xs text-gray-500 truncate">
                {chat.lastMessage || "No messages yet"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="md:col-span-3 flex flex-col bg-[#efeae2]">
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between bg-[#f0f2f5] border-b border-gray-200">
          <div className="font-medium">
            {selectedChat ? selectedChat.name : "Select a chat"}
          </div>
        </div>

        {/* Messages */}
        <div className="h-[76vh] overflow-y-scroll p-4 space-y-2">
          {messages.length === 0 && (
            <div className="text-sm text-gray-500">
              {selectedChat ? "No messages yet" : "Pick a chat to start messaging"}
            </div>
          )}
          {messages.slice().reverse().map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.sender == me ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md px-3 py-2 rounded-lg text-sm shadow-sm ${msg.sender == me ? "bg-[#d9fdd3]" : "bg-white"
                  }`}
              >
                <div>{msg.text}</div>
                <div className="text-[10px] text-gray-500 text-right mt-1">
                  {msg.time || ""}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        {/* Input */}
        <div className="p-3 bg-[#f0f2f5] border-t border-gray-200 flex gap-2 items-center">
          <label className="text-sm text-gray-600 cursor-pointer px-3 py-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50">
            Attach
            <input type="file" className="hidden" onChange={(e) => handleFile(e)} />
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message"
            className="flex-1 bg-white rounded-full px-4 py-2 text-sm outline-none border border-gray-300"
          />
          <button onClick={sendMessage} className="text-green-600">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
