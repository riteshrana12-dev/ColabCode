import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "../services/wsClient";
import { useAuthStore } from "../store/authStore";
import { useFileStore } from "../store/fileStore";
import MonacoEditor from "../components/editor/MonacoEditor";
import EditorTabs from "../components/editor/EditorTabs";
import FileExplorer from "../components/explorer/FileExplorer";
import CollabCursors from "../components/editor/CollabCursors";
import Terminal from "../components/terminal/Terminal";
import OutputPanel from "../components/terminal/OutputPanel";
import VideoPanel from "../components/video/VideoPanel";
import { useToastStore } from "../store/toastStore";
import ConnectionBanner from "../components/room/ConnectionBanner";
import EmptyEditor from "../components/room/EmptyEditor";
import ResizeHandle from "../components/room/ResizeHandle";
import PanelTab from "../components/room/PanelTab";
import LogoMark from "../components/icon/LogoMark";

interface PresenceMember {
  userId: string;
  userName: string;
  color: string;
  socketId?: string;
}
type DragTarget = "sidebar" | "call" | "bottom" | null;

function getColor(seed: string) {
  const colors = [
    "#38BDF8",
    "#34D399",
    "#A78BFA",
    "#F472B6",
    "#FBBF24",
    "#FB7185",
  ];
  return colors[seed.charCodeAt(0) % colors.length];
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const activeFileId = useFileStore((s) => s.activeFileId);
  const openTabs = useFileStore((s) => s.openTabs);
  const openLinkedFile = useFileStore((s) => s.openLinkedFile);

  const [bottomPanel, setBottomPanel] = useState<"terminal" | "output">(
    "terminal",
  );
  const [bottomOpen, setBottomOpen] = useState(true);
  const [connected, setConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "reconnecting" | "disconnected" | "failed"
  >("connecting");
  const [connectionMessage, setConnectionMessage] = useState(
    "Connecting to realtime server...",
  );
  const [members, setMembers] = useState<PresenceMember[]>([]);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [callWidth, setCallWidth] = useState(300);
  const [bottomHeight, setBottomHeight] = useState(260);

  const dragTargetRef = useRef<DragTarget>(null);
  const socketRef = useRef<Socket | null>(null);
  const pushToast = useToastStore((s) => s.pushToast);
  const userColor = user ? getColor(user.id) : "#38BDF8";
  const activeTab = openTabs.find((t) => t.id === activeFileId);

  useEffect(() => {
    if (!roomId || !user) return;
    const socket = connectSocket();
    socketRef.current = socket;

    const joinRoom = () => {
      setConnected(true);
      setConnectionStatus("connected");
      setConnectionMessage("Realtime collaboration connected.");
      socket.emit("room:join", {
        roomId,
        userName: user.name,
        color: userColor,
      });
    };

    socket.on("connect", joinRoom);
    if (socket.connected) joinRoom();
    const onConnectError = (error: Error) => {
      setConnected(false);
      setConnectionStatus("failed");
      setConnectionMessage(
        error.message || "Unable to connect to realtime server.",
      );
      pushToast({
        type: "error",
        title: "Realtime connection failed",
        message: error.message || "Check the server and try reconnecting.",
      });
    };
    const onReconnectAttempt = (attempt: number) => {
      setConnected(false);
      setConnectionStatus("reconnecting");
      setConnectionMessage(
        `Reconnecting to realtime server... attempt ${attempt}`,
      );
    };
    const onReconnect = () => {
      setConnectionStatus("connected");
      setConnectionMessage("Realtime collaboration connected.");
      pushToast({
        type: "success",
        title: "Reconnected",
        message: "Realtime collaboration is back online.",
      });
    };
    const onReconnectFailed = () => {
      setConnected(false);
      setConnectionStatus("failed");
      setConnectionMessage("Reconnect failed. You can try again manually.");
      pushToast({
        type: "error",
        title: "Reconnect failed",
        message: "Realtime collaboration is offline.",
      });
    };
    // const onCollabError = ({ message }: { message: string }) => {
    //   pushToast({
    //     type: "error",
    //     title: "Collaboration error",
    //     message,
    //   });
    // };
    const onDisconnect = (reason: string) => {
      setConnected(false);
      setConnectionStatus("disconnected");
      setConnectionMessage(
        reason === "io client disconnect"
          ? "Realtime connection closed."
          : "Realtime connection lost. Trying to reconnect...",
      );
      if (reason !== "io client disconnect") {
        pushToast({
          type: "warning",
          title: "Disconnected",
          message: "Realtime edits are paused until the socket reconnects.",
        });
      }
    };

    socket.on("connect_error", onConnectError);
    socket.io.on("reconnect_attempt", onReconnectAttempt);
    socket.io.on("reconnect", onReconnect);
    socket.io.on("reconnect_failed", onReconnectFailed);
    // socket.on("collab:error", onCollabError);
    socket.on("presence:list", setMembers);
    socket.on("presence:joined", (m: PresenceMember) =>
      setMembers((p) => (p.some((x) => x.userId === m.userId) ? p : [...p, m])),
    );
    socket.on("presence:left", ({ userId }: { userId: string }) =>
      setMembers((p) => p.filter((m) => m.userId !== userId)),
    );
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("connect_error", onConnectError);
      socket.io.off("reconnect_attempt", onReconnectAttempt);
      socket.io.off("reconnect", onReconnect);
      socket.io.off("reconnect_failed", onReconnectFailed);
      // socket.off("collab:error", onCollabError);
      socket.off("presence:list");
      socket.off("presence:joined");
      socket.off("presence:left");
      socket.off("disconnect", onDisconnect);
      disconnectSocket();
    };
  }, [roomId, user, userColor, pushToast]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (dragTargetRef.current === "sidebar")
        setSidebarWidth(clamp(e.clientX, 180, 440));
      if (dragTargetRef.current === "call")
        setCallWidth(clamp(window.innerWidth - e.clientX, 240, 520));
      if (dragTargetRef.current === "bottom")
        setBottomHeight(clamp(window.innerHeight - e.clientY, 140, 500));
    };
    const onUp = () => {
      dragTargetRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const startDrag = (target: DragTarget, cursor: string) => {
    dragTargetRef.current = target;
    document.body.style.cursor = cursor;
    document.body.style.userSelect = "none";
  };

  if (!user || !roomId) return null;

  const retryRealtimeConnection = () => {
    const socket = socketRef.current;
    if (!socket) return;
    setConnectionStatus("connecting");
    setConnectionMessage("Connecting to realtime server...");
    if (!socket.connected) socket.connect();
  };

  return (
    <div className="h-screen overflow-hidden bg-[#080c14] text-slate-100">
      {/* Top bar */}
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#0a0f1c]/95 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <LogoMark />
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Dashboard
            </button>
          </div>

          <div className="h-4 w-px bg-white/[0.08]" />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-200">
              {activeTab?.name ?? (
                <span className="text-slate-500 font-normal">No file open</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Connection status */}
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connected
                  ? "bg-emerald-400"
                  : connectionStatus === "reconnecting" ||
                      connectionStatus === "connecting"
                    ? "bg-amber-400 animate-pulse"
                    : "bg-rose-400 animate-pulse"
              }`}
            />
            <span className="text-[11px] text-slate-400">
              {connected
                ? `${members.length} online`
                : connectionStatus === "reconnecting"
                  ? "Reconnecting"
                  : "Offline"}
            </span>
          </div>

          <CollabCursors socket={socketRef.current} currentUserId={user.id} />

          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#040810] shadow-sm"
            style={{ backgroundColor: userColor }}
            title={user.name}
          >
            {user.name[0].toUpperCase()}
          </div>
        </div>
      </header>

      {!connected && (
        <ConnectionBanner
          status={connectionStatus}
          message={connectionMessage}
          onRetry={retryRealtimeConnection}
        />
      )}

      {/* Main layout */}
      <main
        className={`flex gap-0 ${
          connected ? "h-[calc(100vh-44px)]" : "h-[calc(100vh-84px)]"
        }`}
      >
        {/* File explorer sidebar */}
        <aside
          className="shrink-0 overflow-hidden border-r border-white/[0.07] bg-[#0a0f1c]"
          style={{ width: sidebarWidth }}
        >
          <FileExplorer roomId={roomId} socket={socketRef.current} />
        </aside>

        <ResizeHandle
          direction="h"
          onPointerDown={() => startDrag("sidebar", "col-resize")}
        />

        {/* Editor + bottom panels */}
        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <EditorTabs />

          <div className="min-h-0 flex-1 overflow-hidden">
            {connected && activeFileId && activeTab ? (
              <MonacoEditor
                socket={socketRef.current}
                roomId={roomId}
                fileId={activeFileId}
                fileName={activeTab.name}
                language={activeTab.language}
                userId={user.id}
                userName={user.name}
                userColor={userColor}
                onOpenLinkedFile={openLinkedFile}
              />
            ) : (
              <EmptyEditor connected={connected} />
            )}
          </div>

          {/* Bottom panel */}
          {bottomOpen && (
            <>
              <ResizeHandle
                direction="v"
                onPointerDown={() => startDrag("bottom", "row-resize")}
              />
              <div
                className="shrink-0 overflow-hidden border-t border-white/[0.07]"
                style={{ height: bottomHeight }}
              >
                {/* Panel tab bar */}
                <div className="flex h-8 shrink-0 items-center border-b border-white/[0.06] bg-[#0a0f1c] px-2">
                  <PanelTab
                    active={bottomPanel === "terminal"}
                    onClick={() => setBottomPanel("terminal")}
                    label="Terminal"
                  />
                  <PanelTab
                    active={bottomPanel === "output"}
                    onClick={() => setBottomPanel("output")}
                    label="Output"
                  />
                  <button
                    onClick={() => setBottomOpen(false)}
                    className="ml-auto flex h-5 w-5 items-center justify-center rounded text-slate-600 hover:bg-white/[0.08] hover:text-slate-300 transition-colors text-xs"
                  >
                    ✕
                  </button>
                </div>
                <div className="h-[calc(100%-32px)] overflow-hidden">
                  {bottomPanel === "terminal" && (
                    <Terminal socket={socketRef.current} roomId={roomId} />
                  )}
                  {bottomPanel === "output" && (
                    <OutputPanel
                      socket={socketRef.current}
                      activeFileName={activeTab?.name || ""}
                      activeFileId={activeFileId || ""}
                    />
                  )}
                </div>
              </div>
            </>
          )}

          {/* Collapsed bottom bar */}
          {!bottomOpen && (
            <div className="flex h-7 shrink-0 items-center gap-1 border-t border-white/[0.07] bg-[#0a0f1c] px-2">
              <button
                onClick={() => {
                  setBottomOpen(true);
                  setBottomPanel("terminal");
                }}
                className="rounded px-2 py-0.5 text-[11px] text-slate-500 hover:bg-white/[0.06] hover:text-slate-300 transition-colors"
              >
                Terminal
              </button>
              <button
                onClick={() => {
                  setBottomOpen(true);
                  setBottomPanel("output");
                }}
                className="rounded px-2 py-0.5 text-[11px] text-slate-500 hover:bg-white/[0.06] hover:text-slate-300 transition-colors"
              >
                Output
              </button>
            </div>
          )}
        </section>

        <ResizeHandle
          direction="h"
          onPointerDown={() => startDrag("call", "col-resize")}
        />

        {/* Video call sidebar */}
        <aside
          className="shrink-0 overflow-hidden border-l border-white/[0.07] bg-[#0a0f1c]"
          style={{ width: callWidth }}
        >
          <VideoPanel
            socket={socketRef.current}
            roomId={roomId}
            userId={user.id}
            userName={user.name}
            userColor={userColor}
          />
        </aside>
      </main>
    </div>
  );
}
