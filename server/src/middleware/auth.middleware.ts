import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { decodeidI } from "../types";
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET as string);

    req.userId = (decode as decodeidI).id;
    req.sessionId = (decode as decodeidI).sessionId;

    next();
    return;
  } catch (error: any) {
    return res.status(401).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default authMiddleware;
