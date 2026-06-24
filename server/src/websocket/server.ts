import { Server } from "socket.io";
import { handleRoomJoin, handleDisconnect } from "./presence";
import { handleYjsUpdate } from "./yjs";
import { handleYjsSyncRequest, handleYjsSyncResponse } from "./yjs";
import {
  handleCursorUpdate,
  handleFileCreated,
  handleFileDeleted,
  handleFileRenamed,
} from "./files";
import {
  handleRtcOffer,
  handleRtcAnswer,
  handleRtcCandidate,
  handleRtcJoin,
  handleRtcLeave,
} from "./rtc";
import {
  handleTerminalStart,
  handleTerminalSync,
  handleTerminalInput,
  handleTerminalResize,
  handleTerminalStop,
} from "./terminal";
import { handleExecRun } from "./exec";
import type {
  RoomJoinPayload,
  YjsUpdatePayload,
  CursorUpdatePayload,
  FileCreatedPayload,
  FileDeletedPayload,
  FileRenamedPayload,
  RtcAnswerPayload,
  RtcCandidatePayload,
  RtcOfferPayload,
  TerminalInputPayload,
  TerminalResizePayload,
  TerminalStartPayload,
  ExecRunPayload,
} from "./types/type";

// ← exported function, not a self-calling main()
export function setupSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    console.log(`User connected: ${userId}`);

    // Presence
    socket.on("room:join", (payload: RoomJoinPayload) =>
      handleRoomJoin(socket, userId, payload),
    );
    socket.on("disconnect", () =>
      handleDisconnect(socket, userId, socket.data.roomId, io),
    );

    // Yjs
    socket.on("yjs:update", (payload: YjsUpdatePayload) =>
      handleYjsUpdate(socket, userId, payload, io),
    );
    socket.on(
      "yjs:sync-request",
      (payload: { roomId: string; fileId: string }) =>
        handleYjsSyncRequest(socket, userId, payload, io),
    );
    socket.on(
      "yjs:sync-response",
      (payload: { targetSocketId: string; fileId: string; state: number[] }) =>
        handleYjsSyncResponse(socket, payload, io),
    );

    // Cursor + Files
    socket.on("cursor:update", (payload: CursorUpdatePayload) =>
      handleCursorUpdate(socket, payload, io),
    );
    socket.on("file:created", (payload: FileCreatedPayload) =>
      handleFileCreated(socket, payload, io),
    );
    socket.on("file:deleted", (payload: FileDeletedPayload) =>
      handleFileDeleted(socket, payload, io),
    );
    socket.on("file:renamed", (payload: FileRenamedPayload) =>
      handleFileRenamed(socket, payload, io),
    );

    // RTC
    socket.on("rtc:offer", (payload: RtcOfferPayload) =>
      handleRtcOffer(socket, payload, io),
    );
    socket.on("rtc:answer", (payload: RtcAnswerPayload) =>
      handleRtcAnswer(socket, payload, io),
    );
    socket.on("rtc:ice-candidate", (payload: RtcCandidatePayload) =>
      handleRtcCandidate(socket, payload, io),
    );
    socket.on("rtc:join-call", ({ roomId }) => handleRtcJoin(socket, roomId));
    socket.on("rtc:leave-call", ({ roomId }) => handleRtcLeave(socket, roomId));

    // Terminal
    socket.on("terminal:start", (payload: TerminalStartPayload) =>
      handleTerminalStart(socket, userId, payload),
    );
    socket.on("terminal:sync-workspace", (payload: TerminalStartPayload) =>
      handleTerminalSync(socket, userId, payload),
    );
    socket.on("terminal:input", (payload: TerminalInputPayload) =>
      handleTerminalInput(socket, userId, payload),
    );
    socket.on("terminal:resize", (payload: TerminalResizePayload) =>
      handleTerminalResize(socket, userId, payload),
    );
    socket.on("terminal:stop", ({ terminalId }) =>
      handleTerminalStop(socket, userId, terminalId),
    );

    // Exec
    socket.on("exec:run", (payload: ExecRunPayload) =>
      handleExecRun(socket, payload),
    );
  });
}
