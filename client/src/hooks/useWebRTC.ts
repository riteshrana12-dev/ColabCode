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
