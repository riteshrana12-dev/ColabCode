import { RequestHandler } from "express";

export interface decodeidI extends JwtPayload {
  id: string;
  sessionId: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      sessionId?: string;
    }
  }
}

export interface Room {
  id: string;
  name: string;
  createdAt: Date;
  inviteCode: string;
  updatedAt: Date;
  creatorId: string;
}

export interface Membership {
  room: Room;
}

export interface File {
  id: string;
  name: string;
  createdAt: Date;
  roomId: string;
  type: string;
  content: string;
  yjsState: Uint8Array<ArrayBuffer> | null;
  language: string;
  updatedAt: Date; // fix typo: "upadatedAt" → "updatedAt"
  parentId: string | null;
}
