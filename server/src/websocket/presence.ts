// websocket/presence.ts
import { Socket, Server } from "socket.io";
import { pubClient } from "./init";
import { RoomJoinPayload } from "./types/type";

export async function handleRoomJoin(
  socket: Socket,
  userId: string,
  payload: RoomJoinPayload,
) {
  socket.join(payload.roomId);
  socket.data.roomId = payload.roomId;
  socket.data.userName = payload.userName;
  socket.data.color = payload.color;

  await pubClient.hSet(
    `presence:${payload.roomId}`,
    userId,
    JSON.stringify({
      userId,
      username: payload.userName,
      color: payload.color,
      socketId: socket.id,
    }),
  );
  socket.to(payload.roomId).emit("presence:joined", {
    userId,
    username: payload.userName,
    color: payload.color,
    socketId: socket.id,
  });

  const raw = await pubClient.hGetAll(`presence:${payload.roomId}`);
  const members = Object.values(raw).map((value) => JSON.parse(value));
  socket.emit("presence:list", members);
}

export async function handleDisconnect(
  socket: Socket,
  userId: string,
  roomId: string,
  io: Server,
) {
  await pubClient.hDel(`presence:${roomId}`, userId);
  io.to(roomId).emit("presence:left", { userId });
}
