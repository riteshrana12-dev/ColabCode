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
