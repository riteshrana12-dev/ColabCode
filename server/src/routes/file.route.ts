import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import fileController from "../controllers/file.controller";

const fileRouter = Router();

fileRouter.get("/room/:roomId", authMiddleware, fileController.getFileTree);
fileRouter.post("/create", authMiddleware, fileController.createFile);
fileRouter.delete("/:id", authMiddleware, fileController.deleteFile);
fileRouter.patch("/:id/rename", authMiddleware, fileController.renameFile);
fileRouter.patch("/:id/move", authMiddleware, fileController.moveFile);

export default fileRouter;
