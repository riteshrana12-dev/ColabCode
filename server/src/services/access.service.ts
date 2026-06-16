import client from "../config/db";

export async function getRoomForUser(userId: string, roomId: string) {
  try {
    const room = await client.room.findFirst({
      where: {
        id: roomId,
        OR: [{ creatorId: userId }, { members: { some: { userId } } }],
      },
    });

    if (!room) {
      return { status: 403, message: "You do not have access to this room" };
    }

    return { status: 200, data: room };
  } catch (err) {
    return { status: 500, message: "Failed to fetch room", error: err };
  }
}

export async function getFileForUser(userId: string, fileId: string) {
  try {
    const file = await client.file.findFirst({
      where: {
        id: fileId,
        room: {
          OR: [{ creatorId: userId }, { members: { some: { userId } } }],
        },
      },
    });

    if (!file) {
      return { status: 403, message: "You do not have access to this file" };
    }

    return { status: 200, data: file };
  } catch (err) {
    return { status: 500, message: "Failed to fetch file", error: err };
  }
}
