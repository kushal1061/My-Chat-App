import React, { useRef, useState, useCallback } from "react";
import { useEffect } from "react";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageBubble from "../components/chat/MessageBubble";
import ChatInput from "../components/chat/ChatInput";
import EmptyState from "../components/chat/EmptyState";
import ImageLightbox from "../components/chat/ImageLightbox";
import { useWebSocket } from "../hooks/useWebSocket";
import { useChats } from "../hooks/useChats";
import { useMessages } from "../hooks/useMessages";
import Call from "./Call";
import useCall from "../hooks/call";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [selectedChatId, setSelectedChatId] = useState();
  const [zoomedImage, setZoomedImage] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  // Keep a ref so async WS callbacks always see the current chat id
  const selectedChatIdRef = useRef(selectedChatId);
  useEffect(() => {
    const token=localStorage.getItem("token");
    if(!token){
      navigate("/login");
    }
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);
  const me = localStorage.getItem("userId");
  // ── Hooks ────────────────────────────────────────────────────────────
  const {
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
  } = useChats();
  // call ----states

  const { wsRef } = useWebSocket(
    useCallback(
      async (data) => {
        if (data.type === "chat") {
          if (selectedChatIdRef.current === data.chatId) {
            appendMessage(data);
          }
          const incomingChatId = data.chatId || data.message?.chatId;
          if (incomingChatId && incomingChatId !== selectedChatIdRef.current) {
            incrementUnread(incomingChatId);
          }
        }
        switch (data.type) {
          case "offer":
            await handleComingCall(data.data, data.from);
            break;

          case "answer":
            await handleAnswer(data.data);
            break;

          case "ice":
            if (pcRef.current?.remoteDescription) {
              await pcRef.current.addIceCandidate(new RTCIceCandidate(data.data));
            } else {
              iceCandidateQueue.current.push(data.data);
            }
            break;

          default:
            break;
        }
      },
      [incrementUnread]
    )
  );
  const { call, setCall, callComing, setCallComing, callOngoing, setCallOngoing, startCall, handleOffer, handleAnswer, localVedioRef, remoteVideoRef, pcRef, iceCandidateQueue, handleComingCall } = useCall(wsRef);
  const {
    messages,
    input,
    setInput,
    bottomRef,
    getMessage,
    sendMessage,
    handleFile,
    appendMessage,
  } = useMessages({
    wsRef,
    selectedChatId,
    onAfterSend: sortChatsAfterMessage,
  });

  // ── Bootstrap ─────────────────────────────────────────────────────────
  useEffect(() => {
    getChats();
  }, [getChats]);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    getMessage(chatId);
    clearUnread(chatId);
    if (window.innerWidth < 768) setSidebarCollapsed(true);
  };

  const onSearchResultClick = (user) => {
    handleSearchResultClick(user, (chatId, isNew) => {
      setSelectedChatId(chatId);
      if (!isNew) getMessage(chatId);
    });
  };

  const selectedChat = chats.find((c) => c._id === selectedChatId);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="h-screen w-full flex overflow-hidden bg-surface-secondary">
      <ImageLightbox src={zoomedImage} onClose={() => setZoomedImage(null)} />

      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        unreadCounts={unreadCounts}
        search={search}
        onSearchChange={handleSearch}
        searchResults={searchResults}
        isSearching={isSearching}
        onSearchResultClick={onSearchResultClick}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-surface">
        <ChatHeader
          chat={selectedChat}
          setCall={setCall}
          startCall={startCall}
          call={call}
          onAvatarClick={setZoomedImage}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(false)
          }
        />

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
                  onImageClick={setZoomedImage}
                />
              ))}
            <div ref={bottomRef} />
          </div>
        )}
        {
          (call || callComing) && <Call selectedChatId={selectedChatId}
            callComing={callComing}
            callOngoing={callOngoing}
            call={call}
            startCall={startCall}
            localVedioRef={localVedioRef}
            remoteVideoRef={remoteVideoRef}
            setCall={setCall}
            handleOffer={handleOffer}
          />
        }
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
