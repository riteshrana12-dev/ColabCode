import { useEffect, useMemo, useRef, useState } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { Socket } from "socket.io-client";
import "@xterm/xterm/css/xterm.css";

interface Props {
  socket: Socket | null;
  roomId: string;
}

interface TerminalTab {
  id: string;
  name: string;
  cwd?: string;
}

const createTerminalId = () =>
  `term-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function Terminal({ socket, roomId }: Props) {
  const firstTerminal = useMemo<TerminalTab>(
    () => ({ id: createTerminalId(), name: "Terminal 1" }),
    [],
  );
  const [tabs, setTabs] = useState<TerminalTab[]>([firstTerminal]);
  const [activeId, setActiveId] = useState(firstTerminal.id);

  useEffect(() => {
    if (!socket) return;

    const onReady = ({
      terminalId,
      cwd,
    }: {
      terminalId: string;
      cwd: string;
    }) => {
      setTabs((current) =>
        current.map((tab) => (tab.id === terminalId ? { ...tab, cwd } : tab)),
      );
    };

    const onSynced = ({
      terminalId,
      cwd,
    }: {
      terminalId: string;
      cwd: string;
    }) => {
      setTabs((current) =>
        current.map((tab) => (tab.id === terminalId ? { ...tab, cwd } : tab)),
      );
    };

    socket.on("terminal:ready", onReady);
    socket.on("terminal:workspace-synced", onSynced);

    return () => {
      socket.off("terminal:ready", onReady);
      socket.off("terminal:workspace-synced", onSynced);
    };
  }, [socket]);

  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  const addTerminal = () => {
    const next: TerminalTab = {
      id: createTerminalId(),
      name: `Terminal ${tabs.length + 1}`,
    };
    setTabs((current) => [...current, next]);
    setActiveId(next.id);
  };

  const closeTerminal = (terminalId: string) => {
    socket?.emit("terminal:stop", { terminalId });
    setTabs((current) => {
      if (current.length === 1) return current;
      const next = current.filter((tab) => tab.id !== terminalId);
      if (activeId === terminalId) setActiveId(next[0].id);
      return next;
    });
  };

  const syncWorkspace = () => {
    if (!activeTab) return;
    socket?.emit("terminal:sync-workspace", {
      roomId,
      terminalId: activeTab.id,
    });
  };

  return (
    <div className="h-full bg-[#0d1117] flex flex-col terminal-surface">
      <div className="flex items-center gap-1 border-b border-white/10 bg-[#111827] px-2 py-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={`group flex h-7 shrink-0 items-center gap-2 rounded-md px-2 text-xs transition-colors ${
                tab.id === activeId
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <span>{tab.name}</span>
              {tabs.length > 1 && (
                <span
                  onClick={(event) => {
                    event.stopPropagation();
                    closeTerminal(tab.id);
                  }}
                  className="text-slate-500 hover:text-white"
                >
                  x
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={syncWorkspace}
          className="h-7 rounded-md px-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
          title="Write latest room files into this terminal workspace"
        >
          Sync files
        </button>
        <button
          onClick={addTerminal}
          className="h-7 rounded-md px-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
          title="New terminal"
        >
          +
        </button>
      </div>
      <div className="border-b border-white/10 px-3 py-1 text-[11px] text-slate-500">
        cwd: {activeTab?.cwd ?? "starting room workspace..."}
      </div>

      <div className="relative flex-1 overflow-hidden">
        {tabs.map((tab) => (
          <TerminalSession
            key={tab.id}
            socket={socket}
            roomId={roomId}
            terminalId={tab.id}
            visible={tab.id === activeId}
          />
        ))}
      </div>
    </div>
  );
}


function TerminalSession({
  socket,
  roomId,
  terminalId,
  visible,
}: {
  socket: Socket | null;
  roomId: string;
  terminalId: string;
  visible: boolean;
}) {
  const termRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!termRef.current || !socket) return;

    const xterm = new XTerm({
      theme: {
        background: "#0d1117",
        foreground: "#d6deeb",
        cursor: "#58a6ff",
        selectionBackground: "#2f81f755",
        black: "#0d1117",
        blue: "#58a6ff",
        green: "#3fb950",
        red: "#f85149",
        yellow: "#d29922",
      },
      fontSize: 13,
      fontFamily: "JetBrains Mono, Fira Code, Consolas, monospace",
      cursorBlink: true,
      scrollback: 4000,
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.open(termRef.current);
    fitAddon.fit();

    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    socket.emit("terminal:start", { roomId, terminalId });
