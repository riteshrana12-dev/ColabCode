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

export default { getFileTree };
