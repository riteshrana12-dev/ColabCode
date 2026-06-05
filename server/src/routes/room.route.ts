import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import roomController from "../controllers/room.controller";

const roomRouter = Router();

roomRouter.post("/create", authMiddleware, roomController.createRoom);
roomRouter.post("/join", authMiddleware, roomController.joinRoom);
roomRouter.post("/leave", authMiddleware, roomController.leaveRoom);
roomRouter.post("/delete", authMiddleware, roomController.deleteRoom);
roomRouter.post("/rename", authMiddleware, roomController.renameRoom);
roomRouter.get("/my-rooms", authMiddleware, roomController.getMyRooms);

export default roomRouter;
