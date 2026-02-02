import React, { useEffect, useRef, useState } from "react";
// import WebSocket from "ws";
import { Search, Send } from "lucide-react";
import axios from 'axios'
export default function Home() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState();
  const [input, setInput] = useState("");
  const wsRef = useRef(null);
  const bottomRef = useRef(null);
  const selectedChat = 1;
  const token = localStorage.getItem("token");
  const me = localStorage.getItem("phone");
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    console.log("again")
    const token = localStorage.getItem("token");
    getChats(token);
    const ws = new WebSocket("ws://localhost:8080");
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
  const handleFile = async (e) => {
    const formdata = new FormData();
    const file = e.target.files[0];
    formdata.append("file",file)
    const res =await axios.post("http://localhost:5000/upload", formdata);
    const url = res.data.url
    await axios.put(url,{
      headers: {
      "Content-Type": file.type,
    },
    body: file,
    })
  }
  const getChats = (token) => {
    // if(!loggedin) return ;
    axios.post("http://localhost:5000/getChats", {
      // userId,
      token
    }).then((res) => {
      console.log(res);
      setChats(res.data);
    }).catch((e) => console.log(e))
  }
  const getMessage = (chatId) => {
    axios.post("http://localhost:5000/getChat", {
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

  return (
    <div className="h-screen w-full bg-[#f0f2f5] flex items-center justify-center">
      <div className="w-full max-w-6xl h-[90vh] bg-white shadow-md grid grid-cols-4 border border-gray-200">
        {/* Sidebar */}
        <div className="col-span-1 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="h-14 px-4 flex items-center bg-[#f0f2f5] border-b border-gray-200 font-medium">
            Chats
          </div>

          {/* Search */}
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-2">
              <Search size={16} className="text-gray-500" />
              <input
                className="bg-transparent outline-none text-sm w-full"
                placeholder="Search or start new chat"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {chats && chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  setSelectedChatId(chat._id)
                  getMessage(chat._id);
                }}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 ${chat.id === selectedChatId ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium text-sm">{chat.name}</div>
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {/* latest message */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-3 flex flex-col bg-[#efeae2]">
          {/* Header */}
          <div className="h-14 px-4 flex items-center justify-between bg-[#f0f2f5] border-b border-gray-200">
            <div className="font-medium">{selectedChat?._id}</div>
          </div>

          {/* Messages */}
          <div className="h-[76vh] overflow-y-scroll p-4 space-y-2">
            {[...messages].reverse().map((msg) => (
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
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          {/* Input */}
          <div className="p-3 bg-[#f0f2f5] border-t border-gray-200 flex gap-2 items-center">
            <input type="file" onChange={(e) => handleFile(e)} />
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