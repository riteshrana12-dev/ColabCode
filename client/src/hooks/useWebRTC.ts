import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";

interface Peer {
  userId: string;
  userName: string;
  color: string;
  stream: MediaStream | null;
}

interface UseWebRTCProps {
  socket: Socket | null;
  roomId: string;
  userId: string;
  userName: string;
  userColor: string;
}

// free TURN from metered.ca — replace with your own key
const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export function useWebRTC({
  socket,
  roomId,
  userName,
  userColor,
}: UseWebRTCProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Record<string, Peer>>({});
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [inCall, setInCall] = useState(false);

  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const localStreamRef = useRef<MediaStream | null>(null);

  const createPeerConnection = useCallback(
    (
      targetSocketId: string,
      targetUserId: string,
      targetUserName: string,
      targetColor: string,
    ) => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      // add local tracks to connection
      localStreamRef.current?.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });

      // send ICE candidates to target
      pc.onicecandidate = (e) => {
        if (e.candidate && socket) {
          socket.emit("rtc:ice-candidate", {
            targetSocketId,
            candidate: e.candidate,
          });
        }
      };

      // receive remote stream
      pc.ontrack = (e) => {
        const stream = e.streams[0];
        setPeers((prev) => ({
          ...prev,
          [targetSocketId]: {
            userId: targetUserId,
            userName: targetUserName,
            color: targetColor,
            stream,
          },
        }));
      };

      pc.onconnectionstatechange = () => {
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed"
        ) {
          setPeers((prev) => {
            const next = { ...prev };
            delete next[targetSocketId];
            return next;
          });
          delete peerConnections.current[targetSocketId];
        }
      };

      peerConnections.current[targetSocketId] = pc;
      return pc;
    },
    [socket],
  );

  const joinCall = useCallback(async () => {
    if (!socket) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      setInCall(true);

      // tell room we joined the call
      socket.emit("rtc:join-call", { roomId, userName, color: userColor });
    } catch (err) {
      console.error("Failed to get media:", err);
      alert("Could not access camera/microphone. Check permissions.");
    }
  }, [socket, roomId, userName, userColor]);
