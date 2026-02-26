import React, { useRef, useState, useEffect } from "react";
import { PhoneOff, Mic, MicOff, Video, VideoOff, Phone } from "lucide-react";

function Call({
  Call,
  startCall,
  handleOffer,
  handleAnswer,
  selectedChatId,
  localVedioRef,
  remoteVideoRef,
  callComing,
  setCall,
  onEndCall,
  callerName,
  callerPic,
}) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [callAccepted, setCallAccepted] = useState(false);
  const timerRef = useRef(null);

  // Start a timer once the call is accepted
  useEffect(() => {
    if (callAccepted) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [callAccepted]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const toggleMic = () => {
    setMicOn((prev) => {
      const next = !prev;
      if (localVedioRef?.current?.srcObject) {
        localVedioRef.current.srcObject
          .getAudioTracks()
          .forEach((t) => (t.enabled = next));
      }
      return next;
    });
  };

  const toggleCam = () => {
    setCamOn((prev) => {
      const next = !prev;
      if (localVedioRef?.current?.srcObject) {
        localVedioRef.current.srcObject
          .getVideoTracks()
          .forEach((t) => (t.enabled = next));
      }
      return next;
    });
  };

  const handleAccept = () => {
    setCall(true);
    setCallAccepted(true);
    handleOffer();
  };

  const handleEndCall = () => {
    clearInterval(timerRef.current);
    // Stop all local media tracks
    if (localVedioRef?.current?.srcObject) {
      localVedioRef.current.srcObject
        .getTracks()
        .forEach((t) => t.stop());
    }
    if (typeof onEndCall === "function") onEndCall();
    else setCall(false);
  };

  return (
    <div className="call-overlay">
      {/* Remote video — full background */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="call-remote-video"
      />

      {/* Gradient overlay at top & bottom */}
      <div className="call-gradient-top" />
      <div className="call-gradient-bottom" />

      {/* Top bar */}
      <div className="call-topbar">
        <div className="call-caller-info">
          {callerPic ? (
            <img
              src={callerPic}
              alt={callerName}
              className="call-caller-avatar"
            />
          ) : (
            <div className="call-caller-avatar call-caller-avatar-fallback">
              {callerName?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div className="call-caller-meta">
            <span className="call-caller-name">{callerName || "Unknown"}</span>
            <span className="call-caller-status">
              {callAccepted
                ? formatTime(elapsedSeconds)
                : callComing
                  ? "Incoming call…"
                  : "Calling…"}
            </span>
          </div>
        </div>
      </div>

      {/* Local video — picture-in-picture */}
      <div className="call-local-wrapper">
        <video
          ref={localVedioRef}
          autoPlay
          muted
          playsInline
          className="call-local-video"
        />
        {!camOn && (
          <div className="call-cam-off-overlay">
            <VideoOff size={20} color="#fff" />
          </div>
        )}
      </div>

      {/* Incoming call panel */}
      {callComing && !callAccepted && (
        <div className="call-incoming-panel">
          <p className="call-incoming-label">Incoming video call</p>
          <div className="call-incoming-actions">
            <button
              className="call-btn call-btn-accept"
              onClick={handleAccept}
              aria-label="Accept call"
            >
              <Phone size={22} />
            </button>
            <button
              className="call-btn call-btn-end"
              onClick={handleEndCall}
              aria-label="Decline call"
            >
              <PhoneOff size={22} />
            </button>
          </div>
        </div>
      )}

      {/* Controls bar */}
      {(!callComing || callAccepted) && (
        <div className="call-controls">
          <button
            className={`call-ctrl-btn ${micOn ? "" : "call-ctrl-btn--off"}`}
            onClick={toggleMic}
            aria-label={micOn ? "Mute mic" : "Unmute mic"}
          >
            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            <span className="call-ctrl-label">{micOn ? "Mute" : "Unmute"}</span>
          </button>

          <button
            className="call-ctrl-btn call-ctrl-btn--end"
            onClick={handleEndCall}
            aria-label="End call"
          >
            <PhoneOff size={22} />
            <span className="call-ctrl-label">End</span>
          </button>

          <button
            className={`call-ctrl-btn ${camOn ? "" : "call-ctrl-btn--off"}`}
            onClick={toggleCam}
            aria-label={camOn ? "Turn off camera" : "Turn on camera"}
          >
            {camOn ? <Video size={20} /> : <VideoOff size={20} />}
            <span className="call-ctrl-label">{camOn ? "Camera" : "No Cam"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Call;