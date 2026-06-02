import client from "../config/db";
import { Request, Response } from "express";

const createRoom = async (req: Request, res: Response) => {
  const { roomName } = req.body;

  try {
    if (!roomName || roomName.trim() === "") {
      return res.status(400).json({
        message: "Room name is required",
      });
    }
    const room = await client.room.create({
      data: {
        name: roomName,
      },
    });

    if (!room) {
      return res.status(400).json({
        message: "Failed to create room",
      });
    }

    return res.status(200).json({
      message: "Room created successfully",
      roomId: room.id,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const joinRoom = async (req: Request, res: Response) => {
  const { roomId } = req.body;
  const userId = req.userId;

  try {
    if (!roomId || roomId.trim() === "") {
      return res.status(400).json({
        message: "Room ID is required",
      });
    }

    const room = await client.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    await client.user.update({
      where: {
        id: userId,
      },
      data: {
        roomId: roomId,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    return res.status(200).json({
      message: "Joined room successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default { createRoom, joinRoom };
