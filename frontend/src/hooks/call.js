import { set } from "mongoose";
import { useRef } from "react";
import { useState } from "react";
export default function useCall(wsRef) {
    const [call, setCall] = useState(false);
    const [callComing, setCallComing] = useState(false);
    const [callOngoing, setCallOngoing] = useState(false);
    const pcRef = useRef(null);
    const iceCandidateQueue = useRef([]);
    const localVedioRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const otherIdRef = useRef(null);
    const offerRef = useRef(null);
    const me = localStorage.getItem("userId") ;
    //----------creating peerconnection
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
                    from: me,
                    to: targetId,
                    data: event.candidate,
                }));
            }
        };
        pc.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        pcRef.current = pc;
        return pc;
    };
    const startCall = async (otherId) => {
        const pc = createPeerConnection(otherId);
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        localVedioRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        wsRef.current.send(JSON.stringify({
            type: "offer",
            from: me,
            to: otherId,
            data: offer,
        }));
        // setCalling(true);
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
    const flushIceCandidates = async () => {
        while (iceCandidateQueue.current.length > 0) {
            const candidate = iceCandidateQueue.current.shift();
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }
    const handleComingCall = (offer, from) => {
        setCallComing(true);
        otherIdRef.current = from;
        offerRef.current = offer;
    };
    const handleOffer = async () => {
        const offer = offerRef.current;
        const from = otherIdRef.current;
        setCallComing(true);
        const pc = createPeerConnection(otherIdRef.current);
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        localVedioRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        await flushIceCandidates();
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        wsRef.current.send(JSON.stringify({
            type: "answer",
            from: me,
            to: from,
            data: answer,
        }));
    }
    return { call, setCall, callComing, setCallComing, callOngoing, setCallOngoing , startCall, handleOffer, handleAnswer,localVedioRef,remoteVideoRef,pcRef,iceCandidateQueue,handleComingCall};
};
