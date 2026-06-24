import {
  createPty,
  writeToPty,
  resizePty,
  killPty,
} from "../terminal/ptyManager";
import { syncRoomWorkspace } from "../services/workspace.service";
import type {
  TerminalInputPayload,
  TerminalResizePayload,
  TerminalStartPayload,
} from "./types/type";
import { Socket } from "socket.io";

export async function handleTerminalStart(
  socket: Socket,
  userId: string,
  payload: TerminalStartPayload,
) {
  const cwd = await syncRoomWorkspace(userId, payload.roomId);
  createPty(userId, payload.roomId, payload.terminalId, cwd, (data) => {
    socket.emit("terminal:output", { terminalId: payload.terminalId, data });
  });
  socket.emit("terminal:ready", { terminalId: payload.terminalId, cwd });
}

export async function handleTerminalSync(
  socket: Socket,
  userId: string,
  payload: TerminalStartPayload,
) {
  const cwd = await syncRoomWorkspace(userId, payload.roomId);
  socket.emit("terminal:workspace-synced", {
    terminalId: payload.terminalId,
    cwd,
  });
}

export function handleTerminalInput(
  socket: Socket,
  userId: string,
  payload: TerminalInputPayload,
) {
  writeToPty(userId, payload.terminalId, payload.data);
}

export function handleTerminalResize(
  socket: Socket,
  userId: string,
  payload: TerminalResizePayload,
) {
  resizePty(userId, payload.terminalId, payload.cols, payload.rows);
}

export function handleTerminalStop(
  socket: Socket,
  userId: string,
  terminalId: string,
) {
  killPty(userId, terminalId);
}
