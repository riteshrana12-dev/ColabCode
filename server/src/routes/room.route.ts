import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import roomController from "../controllers/room.controller";

const roomRouter = Router();

roomRouter.post("/create", authMiddleware, roomController.createRoom);
roomRouter.post("/join", authMiddleware, roomController.joinRoom);
roomRouter.post("/leave", authMiddleware, roomController.leaveRoom);

export default roomRouter;
