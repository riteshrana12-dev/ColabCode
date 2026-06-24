// websocket/init.ts
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import jwt from "jsonwebtoken";
import { httpServer } from "../http";

export const pubClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
export const subClient = pubClient.duplicate();

export async function initWebSocket() {
  await pubClient.connect();
  await subClient.connect();

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.adapter(createAdapter(pubClient, subClient));

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        sessionId?: string;
      };
      socket.data.userId = decoded.id;
      socket.data.sessionId = decoded.sessionId;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  return io;
}
