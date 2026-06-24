// websocket/yjs.ts
import * as Y from "yjs";
import client from "../config/db";
import { syncRoomWorkspace } from "../services/workspace.service";
import type { YjsUpdatePayload } from "./types/type";
import { Socket, Server } from "socket.io";

const saveTimers = new Map<string, NodeJS.Timeout>();
const pendingYjsUpdates = new Map<string, Uint8Array[]>();

export async function handleYjsUpdate(
  socket: Socket,
  userId: string,
  payload: YjsUpdatePayload,
  io: Server,
) {
  // relay to everyone else in the room immediately
  socket.to(payload.roomId).emit("yjs:update", {
    fileId: payload.fileId,
    update: payload.update,
  });

  // accumulate updates for debounced DB save
  const updates = pendingYjsUpdates.get(payload.fileId) ?? [];
  updates.push(new Uint8Array(payload.update));
  pendingYjsUpdates.set(payload.fileId, updates);

  const existingTimer = saveTimers.get(payload.fileId);
  if (existingTimer) clearTimeout(existingTimer);

  saveTimers.set(
    payload.fileId,
    setTimeout(async () => {
      try {
        const pendingUpdates = pendingYjsUpdates.get(payload.fileId) ?? [];
        pendingYjsUpdates.delete(payload.fileId);
        saveTimers.delete(payload.fileId);

        const file = await client.file.findUnique({
          where: { id: payload.fileId },
        });

        if (!file) {
          console.error(`File not found: ${payload.fileId}`);
          return;
        }

        const ydoc = new Y.Doc();

        // apply existing snapshot first
        if (file.yjsState) {
          Y.applyUpdate(ydoc, file.yjsState);
        }

        // apply all pending updates on top
        for (const pendingUpdate of pendingUpdates) {
          Y.applyUpdate(ydoc, pendingUpdate);
        }

        const snapshot = Buffer.from(Y.encodeStateAsUpdate(ydoc));
        const content = ydoc.getText("content").toString();

        await client.file.update({
          where: { id: payload.fileId },
          data: { yjsState: snapshot, content },
        });

        // sync workspace to disk after save
        if (file.roomId) {
          try {
            await syncRoomWorkspace(userId, file.roomId);
            io.to(file.roomId).emit("workspace:synced", {
              fileId: payload.fileId,
            });
          } catch (syncErr) {
            console.error("Workspace sync failed:", syncErr);
          }
        }
      } catch (err) {
        console.error("Failed to save Yjs state:", err);
      }
    }, 2000),
  );
}

// late joiner requests full doc state from room + DB fallback
export async function handleYjsSyncRequest(
  socket: Socket,
  userId: string,
  payload: { roomId: string; fileId: string },
  io: Server,
) {
  // ask existing clients in the room to send their state
  socket.to(payload.roomId).emit("yjs:sync-request", {
    socketId: socket.id,
    fileId: payload.fileId,
  });

  // DB fallback — fires after 500ms giving live clients a chance to respond first
  // if a live client responds first, the client applies it and ignores the DB one
  // if no live client responds (room was empty), DB snapshot fills the gap
  setTimeout(async () => {
    try {
      const file = await client.file.findUnique({
        where: { id: payload.fileId },
      });

      if (file?.yjsState) {
        socket.emit("yjs:sync-response", {
          fileId: payload.fileId,
          state: Array.from(file.yjsState),
        });
      }
    } catch (err) {
      console.error("Failed to load Yjs state from DB:", err);
    }
  }, 500);
}

// relay doc state from existing client to late joiner
export function handleYjsSyncResponse(
  socket: Socket,
  payload: { targetSocketId: string; fileId: string; state: number[] },
  io: Server,
) {
  io.to(payload.targetSocketId).emit("yjs:sync-response", {
    fileId: payload.fileId,
    state: payload.state,
  });
}
