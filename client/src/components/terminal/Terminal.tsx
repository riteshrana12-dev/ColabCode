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
}
