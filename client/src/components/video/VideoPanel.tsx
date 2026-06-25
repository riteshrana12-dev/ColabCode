import { memo, useMemo, type ReactNode } from "react";
import { Socket } from "socket.io-client";
import { useWebRTC } from "../../hooks/useWebRTC";
import MicIcon from "./icon/MicIcon";
import MicOffIcon from "./icon/MicOffIcon";
import CamIcon from "./icon/CamIcon";
import CamOffIcon from "./icon/CamOffIcon";
import PhoneOffIcon from "./icon/PhoneOffIcon";

interface Props {
  socket: Socket | null;
  roomId: string;
  userId: string;
  userName: string;
  userColor: string;
}

function VideoPanel({ socket, roomId, userId, userName, userColor }: Props) {
  const {
    localStream,
    peers,
    micOn,
    camOn,
    inCall,
    joinCall,
    leaveCall,
    toggleMic,
    toggleCam,
  } = useWebRTC({ socket, roomId, userId, userName, userColor });

   const participants = useMemo(
    () => [
      {
        id: "local",
        stream: localStream,
        label: `${userName} (you)`,
        color: userColor,
        muted: true,
        camOn,
      },
      ...Object.entries(peers).map(([socketId, peer]) => ({
        id: socketId,
        stream: peer.stream,
        label: peer.userName,
        color: peer.color,
        muted: false,
        camOn: !!peer.stream,
      })),
    ],
    [camOn, localStream, peers, userColor, userName],
  );