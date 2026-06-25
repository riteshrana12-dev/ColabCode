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

  if (!inCall) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/10">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-sky-400"
          >
            <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-white">Video call</p>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Join to collaborate with voice and video
          </p>
        </div>
        <button
          onClick={joinCall}
          className="rounded-lg bg-sky-500 hover:bg-sky-400 px-5 py-2 text-xs font-semibold text-white transition-colors"
        >
          Join call
        </button>
      </div>
    );
  }

   return (
    <div className="flex h-full flex-col bg-[#080d18]">
      {/* Header */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-white/[0.08] px-3">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          Live call
        </span>
        <span className="rounded-full bg-white/[0.06] border border-white/10 px-2 py-0.5 text-[10px] text-slate-500">
          {participants.length}{" "}
          {participants.length === 1 ? "person" : "people"}
        </span>
      </div>

      <div className="grid grid-flow-col grid-rows-3 flex-1 gap-1.5 p-1.5 min-h-0">
        {participants.map((p) => (
          <VideoTile key={p.id} {...p} />
        ))}
      </div>