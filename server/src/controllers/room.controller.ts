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

export default { createRoom };
