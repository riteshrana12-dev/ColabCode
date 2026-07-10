import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import client from "../config/db";
import { getRoomForUser } from "./access.service";
import type { File } from "../types";

const WORKSPACE_ROOT = path.join(os.tmpdir(), "collabcode-workspaces");

function safeSegment(value: string) {
  return value.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "untitled";
}

function buildPathById(
  files: Awaited<ReturnType<typeof client.file.findMany>>,
) {
  const byId = new Map(files.map((file: File) => [file.id, file]));
  const cache = new Map<string, string>();

  const getPath = (fileId: string): string => {
    const cached = cache.get(fileId);
    if (cached) return cached;

    const file = byId.get(fileId);
    if (!file) return "";

    const segment = safeSegment(file.name);
    const filePath = file.parentId
      ? path.join(getPath(file.parentId), segment)
      : segment;

    cache.set(fileId, filePath);
    return filePath;
  };

  return getPath;
}

export async function syncRoomWorkspace(userId: string, roomId: string) {
  await getRoomForUser(userId, roomId);

  const workspaceDir = path.join(WORKSPACE_ROOT, safeSegment(roomId));
  fs.mkdirSync(workspaceDir, { recursive: true });

  const files = await client.file.findMany({
    where: { roomId },
    orderBy: [{ type: "desc" }, { name: "asc" }],
  });
  const getFilePath = buildPathById(files);

  for (const file of files) {
    const relativePath = getFilePath(file.id);
    if (!relativePath) continue;

    const targetPath = path.join(workspaceDir, relativePath);
    if (!targetPath.startsWith(workspaceDir)) continue;

    if (file.type === "folder") {
      fs.mkdirSync(targetPath, { recursive: true });
    } else {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, file.content ?? "");
    }
  }

  return workspaceDir;
}
