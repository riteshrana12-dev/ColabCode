import { Socket, Server } from "socket.io";
import type {
  FileCreatedPayload,
  FileDeletedPayload,
  FileRenamedPayload,
  CursorUpdatePayload,
} from "./types/type";

export function handleCursorUpdate(
  socket: Socket,
  payload: CursorUpdatePayload,
  io: Server,
) {
  if (!socket.data.roomId || socket.data.roomId !== payload.roomId) return;
  io.to(payload.roomId).emit("cursor:update", {
    userId: socket.data.userId,
    fileId: payload.fileId,
    cursor: payload.cursor,
  });
}

export function handleFileCreated(
  socket: Socket,
  payload: FileCreatedPayload,
  io: Server,
) {
  if (!socket.data.roomId || socket.data.roomId !== payload.roomId) return;
  socket.to(payload.roomId).emit("file:created", { file: payload.file });
}

export function handleFileDeleted(
  socket: Socket,
  payload: FileDeletedPayload,
  io: Server,
) {
  if (!socket.data.roomId || socket.data.roomId !== payload.roomId) return;
  socket.to(payload.roomId).emit("file:deleted", { fileId: payload.fileId });
}

export function handleFileRenamed(
  socket: Socket,
  payload: FileRenamedPayload,
  io: Server,
) {
  if (!socket.data.roomId || socket.data.roomId !== payload.roomId) return;
  socket.to(payload.roomId).emit("file:renamed", {
    fileId: payload.fileId,
    name: payload.name,
  });
}
