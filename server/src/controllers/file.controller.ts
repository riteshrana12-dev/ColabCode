import client from "../config/db";
import { Request, Response } from "express";
import buildTree from "../services/buildFile.service";
import getLanguage from "../utils/language.util";

const getFileTree = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  try {
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
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (parentId) {
      const parent = await client.file.findUnique({ where: { id: parentId } });

      if (!parent || parent.type !== "folder") {
        return res.status(400).json({
          mesasge: "Parent folder not found",
        });
      }
    }

    const existing = await client.file.findFirst({
      where: { roomId, parentId, name },
    });

    if (!existing) {
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

export default { getFileTree, createFile };
