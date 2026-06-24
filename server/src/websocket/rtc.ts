import { Socket, Server } from "socket.io";
import type {
  RtcOfferPayload,
  RtcAnswerPayload,
  RtcCandidatePayload,
} from "./types/type";
export function handleRtcOffer(
  socket: Socket,
  payload: RtcOfferPayload,
  io: Server,
) {
  io.to(payload.targetSocketId).emit("rtc:offer", {
    offer: payload.offer,
    roomId: payload.roomId,
    fromSocketId: socket.id,
    userId: socket.data.userId,
    userName: socket.data.userName,
    color: socket.data.color,
  });
}

export function handleRtcAnswer(
  socket: Socket,
  payload: RtcAnswerPayload,
  io: Server,
) {
  io.to(payload.targetSocketId).emit("rtc:answer", {
    answer: payload.answer,
    fromSocketId: socket.id,
  });
}

export function handleRtcCandidate(
  socket: Socket,
  payload: RtcCandidatePayload,
  io: Server,
) {
  io.to(payload.targetSocketId).emit("rtc:ice-candidate", {
    candidate: payload.candidate,
    fromSocketId: socket.id,
  });
}

export function handleRtcJoin(socket: Socket, roomId: string) {
  socket.to(roomId).emit("rtc:user-joined-call", {
    socketId: socket.id,
    userId: socket.data.userId,
    userName: socket.data.userName,
    color: socket.data.color,
  });
}

export function handleRtcLeave(socket: Socket, roomId: string) {
  socket.to(roomId).emit("rtc:user-left-call", { socketId: socket.id });
}
