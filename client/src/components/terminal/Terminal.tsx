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
}
