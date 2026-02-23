import React, { useEffect, useRef } from "react";

function Call() {
  const wsRef = useRef(null);
  const pcRef = useRef(null);
  const iceCandidateQueue = useRef([]);
  const myId = "userA";
  const otherId = "userB";

  const flushIceCandidates = async () => {
    while (iceCandidateQueue.current.length > 0) {
      const candidate = iceCandidateQueue.current.shift();
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const createPeerConnection = (targetId) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
        urls: "turn:global.relay.metered.ca:80?transport=tcp",
        username: "35ec9ed03ed38c6496c2c9ee",
        credential: "sbC3uskvzrqjOsAV",
      },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        wsRef.current.send(JSON.stringify({
          type: "ice",
          from: myId,
          to: targetId,
          data: event.candidate,
        }));
      }
    };

    pc.ontrack = (event) => {
      document.getElementById("remoteVideo").srcObject = event.streams[0];
    };

    pcRef.current = pc;
    return pc;
  };

  const handleOffer = async (offer, from) => {
    const pc = createPeerConnection(from);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    document.getElementById("localVideo").srcObject = stream;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    await flushIceCandidates();

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    wsRef.current.send(JSON.stringify({
      type: "answer",
      from: myId,
      to: from,
      data: answer,
    }));
  };

  const handleAnswer = async (answer) => {
    if (!pcRef.current) return;

    if (pcRef.current.signalingState !== "have-local-offer") {
      console.warn("Wrong state:", pcRef.current.signalingState);
      return;
    }

    await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    await flushIceCandidates();
  };

  // ---------------- WS CONNECT ----------------
  useEffect(() => {
    wsRef.current = new WebSocket("ws://192.168.20.76:8000");

    wsRef.current.onopen = () => {
      console.log("WS connected");
    };

    wsRef.current.onmessage = async (e) => {
      const msg = JSON.parse(e.data);
        console.log("Received WS message:", msg);
      switch (msg.type) {
        case "offer":
          await handleOffer(msg.data, msg.from);
          break;

        case "answer":
          await handleAnswer(msg.data);
          break;

        case "ice":
          if (pcRef.current?.remoteDescription) {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(msg.data));
          } else {
            iceCandidateQueue.current.push(msg.data);
          }
          break;

        default:
          break;
      }
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  // ---------------- CALLER ----------------
  const startCall = async () => {
    const pc = createPeerConnection(otherId);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    document.getElementById("localVideo").srcObject = stream;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    wsRef.current.send(JSON.stringify({
      type: "offer",
      from: myId,
      to: otherId,
      data: offer,
    }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{myId}</h2>

      <video id="localVideo" autoPlay muted playsInline width="300" />
      <video id="remoteVideo" autoPlay playsInline width="300" />

      <br />
      <button onClick={startCall}>Start Call</button>
    </div>
  );
}

export default Call;