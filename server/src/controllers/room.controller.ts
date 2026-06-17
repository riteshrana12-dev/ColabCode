import client from "../config/db";
import { Request, Response } from "express";

const createRoom = async (req: Request, res: Response) => {
  const { roomName } = req.body;
  const userId = req.userId;

  try {
    if (!roomName || roomName.trim() === "") {
      return res.status(400).json({
        message: "Room name is required",
      });
    }
    const room = await client.room.create({
      data: {
        name: roomName,
        creatorId: userId!,
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
      inviteCode: room.inviteCode,
      room,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteRoom = async (req: Request, res: Response) => {
  const { roomId } = req.body;
  const userId = req.userId;
  try {
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
    if (room.creatorId !== userId) {
      return res.status(403).json({
        message: "You are not the creator of this room",
      });
    }
    await client.room.delete({
      where: {
        id: roomId,
        creatorId: userId,
      },
    });
    return res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const renameRoom = async (req: Request, res: Response) => {
  const { roomId, newName, roomName } = req.body;
  const nextName = newName ?? roomName;
  const userId = req.userId;

  try {
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

    if (room.creatorId !== userId) {
      return res.status(403).json({
        message: "You are not the creator of this room",
      });
    }

    await client.room.update({
      where: {
        id: roomId,
      },
      data: {
        name: nextName,
      },
    });

    return res.status(200).json({
      message: "Room renamed successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const joinRoom = async (req: Request, res: Response) => {
  const { inviteCode } = req.body;
  const userId = req.userId;

  try {
    const room = await client.room.findUnique({
      where: {
        inviteCode: inviteCode,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.creatorId === userId) {
      return res.status(400).json({
        message: "You are the creator of this room",
      });
    }

    const existingMembership = await client.roomMember.findFirst({
      where: {
        userId,
        roomId: room.id,
      },
    });

    if (existingMembership) {
      return res.status(400).json({
        message: "You are already a member of this room",
      });
    }

    await client.roomMember.create({
      data: {
        userId: userId!,
        roomId: room.id,
      },
    });

    return res.status(200).json({
      message: "Joined room successfully",
      roomId: room.id,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const leaveRoom = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { roomId } = req.body;

  try {
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

    if (room.creatorId === userId) {
      return res.status(400).json({
        message: "Creators cannot leave their own rooms",
      });
    }

    await client.roomMember.delete({
      where: {
        userId_roomId: {
          userId: userId!,
          roomId: roomId,
        },
      },
    });

    return res.status(200).json({
      message: "Left room successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// room.controller.ts
const getMyRooms = async (req: Request, res: Response) => {
  try {
    const user = await client.user.findUnique({
      where: { id: req.userId },
      include: {
        createdRooms: true,
        memberships: { include: { room: true } },
      },
    });

    return res.status(200).json({
      createdRooms: user?.createdRooms || [],
      joinedRooms: user?.memberships.map((m) => m.room) || [],
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  createRoom,
  deleteRoom,
  renameRoom,
  joinRoom,
  leaveRoom,
  getMyRooms,
};
