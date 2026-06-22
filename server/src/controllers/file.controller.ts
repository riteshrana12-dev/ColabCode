import client from "../config/db";
import { Request, Response } from "express";
import buildTree from "../services/buildFile.service";
import getLanguage from "../utils/language.util";
import { getFileForUser, getRoomForUser } from "../services/access.service";

const getFileTree = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  try {
    await getRoomForUser(req.userId!, roomId);

    const files = await client.file.findMany({
      where: { roomId },
      orderBy: [{ type: "desc" }, { name: "asc" }],
    });

    const tree = buildTree(files);

    return res.status(200).json({
      message: "File tree",
      tree,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const createFile = async (req: Request, res: Response) => {
  const { roomId, name, type = "file", parentId = null } = req.body;

  try {
    await getRoomForUser(req.userId!, roomId);

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (parentId) {
      const parent = await client.file.findUnique({ where: { id: parentId } });

      if (!parent || parent.roomId !== roomId || parent.type !== "folder") {
        return res.status(400).json({
          mesasge: "Parent folder not found",
        });
      }
    }

    const existing = await client.file.findFirst({
      where: { roomId, parentId, name },
    });

    if (existing) {
      return res.status(400).json({
        message: `A ${type} with that name already exist`,
      });
    }

    const file = await client.file.create({
      data: {
        name,
        type,
        parentId,
        roomId,
        language: type === "file" ? getLanguage(name) : "plaintext",
      },
    });

    return res.status(200).json({
      message: `${type} created`,
      file,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const file = await getFileForUser(req.userId!, id);

    if (!file) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    await client.file.delete({ where: { id } });

    return res.status(200).json({
      message: "Deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

const renameFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Name is required",
      });
    }
    const file = await getFileForUser(req.userId!, id);

    if (!file) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    const existing = await client.file.findFirst({
      where: {
        roomId: file.data?.roomId,
        parentId: file.data?.parentId,
        name,
        NOT: { id },
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Name already exists in this folder",
      });
    }

    const updated = await client.file.update({
      where: { id },
      data: {
        name,
        language: file.data?.type === "file" ? getLanguage(name) : "plaintext",
      },
    });

    return res.status(200).json({
      message: "Renamed successfully",
      file: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const moveFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { parentId } = req.body;

  try {
    const file = await getFileForUser(req.userId!, id);

    if (!file) {
      return res.status(404).json({
        message: "not found",
      });
    }

    if (parentId === id) {
      return res.status(400).json({
        message: "Cannot move folder into itself",
      });
    }

    if (parentId) {
      const parent = await getFileForUser(req.userId!, parentId);
      if (
        parent.data?.roomId !== file.data?.roomId ||
        parent.data?.type !== "folder"
      ) {
        return res.status(400).json({
          message: "Parent folder not found",
        });
      }

      let currentParentId = parent.data?.parentId;
      while (currentParentId) {
        if (currentParentId === id) {
          return res.status(400).json({
            message: "Cannot move folder into one of its children",
          });
        }

        const currentParent = await client.file.findUnique({
          where: { id: currentParentId },
          select: { parentId: true },
        });
        currentParentId = currentParent?.parentId ?? null;
      }
    }

    const updated = await client.file.update({
      where: { id },
      data: {
        parentId: parentId ?? null,
      },
    });

    return res.status(200).json({
      message: "Moved successfully",
      file: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default { getFileTree, createFile, deleteFile, renameFile, moveFile };
