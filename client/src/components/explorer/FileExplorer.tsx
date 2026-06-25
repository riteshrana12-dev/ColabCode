import { useState, useRef, useEffect } from "react";
import type { FileNode } from "../../types";
import { useFileStore } from "../../store/fileStore";
import api from "../../services/api";
import { Socket } from "socket.io-client";
import TrashIcon from "./icon/TrashIcon";
import RenameIcon from "./icon/RenameIcon";
import NewFolderIcon from "./icon/NewFolderIcon";
import NewFileIcon from "./icon/NewFileIcon";
import InlineInput from "./InlineInput";
import TreeNode from "./TreeNode";
import FolderEmptyIcon from "./icon/FolderEmptyIcon";

interface Props {
  roomId: string;
  socket: Socket | null;
}

export default function FileExplorer({ roomId, socket }: Props) {
  const { tree, setTree, openFile, addNode, removeNode, renameNode } =
    useFileStore();
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: FileNode | null;
  } | null>(null);
  const [creating, setCreating] = useState<{
    parentId: string | null;
    type: "file" | "folder";
  } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const creatingRef = useRef(false);
  const renamingRef = useRef(false);

  useEffect(() => {
    api
      .get(`/file/room/${roomId}`)
      .then((res) => setTree(res.data.tree))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;
    socket.on("file:created", ({ file }) => addNode(file, file.parentId));
    socket.on("file:deleted", ({ fileId }) => removeNode(fileId));
    socket.on("file:renamed", ({ fileId, name }) => renameNode(fileId, name));
    return () => {
      socket.off("file:created");
      socket.off("file:deleted");
      socket.off("file:renamed");
    };
  }, [socket]);

  useEffect(() => {
    if ((creating || renamingId) && inputRef.current) inputRef.current.focus();
  }, [creating, renamingId]);

  useEffect(() => {
    const handler = () => setContextMenu(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const handleCreate = async () => {
    if (!creating || !inputVal.trim()) {
      setCreating(null);
      setInputVal("");
      return;
    }
    if (creatingRef.current) return;
    creatingRef.current = true;
    try {
      const res = await api.post("/file/create", {
        roomId,
        name: inputVal.trim(),
        type: creating.type,
        parentId: creating.parentId,
      });
      const file = res.data.file;
      addNode({ ...file, children: [] }, file.parentId);
      socket?.emit("file:created", { roomId, file: { ...file, children: [] } });
      if (file.type === "file") openFile(file);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create");
    } finally {
      creatingRef.current = false;
      setCreating(null);
      setInputVal("");
    }
  };

  const handleRename = async (node: FileNode) => {
    if (!inputVal.trim() || inputVal === node.name) {
      setRenamingId(null);
      setInputVal("");
      return;
    }
    if (renamingRef.current) return;
    renamingRef.current = true;
    try {
      await api.patch(`/file/${node.id}/rename`, { name: inputVal.trim() });
      renameNode(node.id, inputVal.trim());
      socket?.emit("file:renamed", {
        roomId,
        fileId: node.id,
        name: inputVal.trim(),
      });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to rename");
    } finally {
      renamingRef.current = false;
      setRenamingId(null);
      setInputVal("");
    }
  };

  const handleDelete = async (node: FileNode) => {
    if (!confirm(`Delete "${node.name}"?`)) return;
    try {
      await api.delete(`/file/${node.id}`);
      removeNode(node.id);
      socket?.emit("file:deleted", { roomId, fileId: node.id });
    } catch {
      alert("Failed to delete");
    }
  };

  const onCtxMenu = (e: React.MouseEvent, node: FileNode | null) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, node });
  };

  const startCreate = (type: "file" | "folder", parentId: string | null) => {
    setCreating({ parentId, type });
    setInputVal("");
    setContextMenu(null);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-sky-400" />
      </div>
    );
  }

  return (
    <div
      className="flex h-full flex-col select-none"
      onContextMenu={(e) => onCtxMenu(e, null)}
    >
      {/* Header */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-white/[0.08] px-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Explorer
        </span>
        <div className="flex gap-0.5">
          <IconBtn title="New file" onClick={() => startCreate("file", null)}>
            <NewFileIcon />
          </IconBtn>
          <IconBtn
            title="New folder"
            onClick={() => startCreate("folder", null)}
          >
            <NewFolderIcon />
          </IconBtn>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {tree.length === 0 && !creating && (
          <div className="flex flex-col items-center justify-center gap-3 py-8 px-4 text-center">
            <div className="h-8 w-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-600">
              <FolderEmptyIcon />
            </div>
            <p className="text-[11px] text-slate-600">
              Right-click or use + to create files
            </p>
          </div>
        )}

        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            renamingId={renamingId}
            creating={creating}
            inputVal={inputVal}
            inputRef={inputRef}
            setInputVal={setInputVal}
            setCreating={setCreating}
            setRenamingId={setRenamingId}
            onCtxMenu={onCtxMenu}
            onOpen={(n: FileNode) => {
              if (n.type === "file") openFile(n);
            }}
            onRename={handleRename}
            onCreate={handleCreate}
          />
        ))}

        {creating && creating.parentId === null && (
          <InlineInput
            type={creating.type}
            value={inputVal}
            depth={0}
            inputRef={inputRef}
            onChange={setInputVal}
            onConfirm={handleCreate}
            onCancel={() => {
              setCreating(null);
              setInputVal("");
            }}
          />
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 min-w-[160px] rounded-xl border border-white/10 bg-[#111827]/95 py-1 shadow-2xl backdrop-blur-sm"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <CtxItem
            label="New file"
            icon={<NewFileIcon />}
            onClick={() => {
              const parentId =
                contextMenu.node?.type === "folder"
                  ? contextMenu.node.id
                  : (contextMenu.node?.parentId ?? null);
              startCreate("file", parentId);
            }}
          />
          <CtxItem
            label="New folder"
            icon={<NewFolderIcon />}
            onClick={() => {
              const parentId =
                contextMenu.node?.type === "folder"
                  ? contextMenu.node.id
                  : (contextMenu.node?.parentId ?? null);
              startCreate("folder", parentId);
            }}
          />
          {contextMenu.node && (
            <>
              <div className="my-1 border-t border-white/[0.06]" />
              <CtxItem
                label="Rename"
                icon={<RenameIcon />}
                onClick={() => {
                  if (contextMenu.node) {
                    setRenamingId(contextMenu.node.id);
                    setInputVal(contextMenu.node.name);
                  }
                  setContextMenu(null);
                }}
              />
              <CtxItem
                label="Delete"
                icon={<TrashIcon />}
                danger
                onClick={() => {
                  if (contextMenu.node) handleDelete(contextMenu.node);
                  setContextMenu(null);
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

// small helpers
function IconBtn({ onClick, title, children }: any) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-white/[0.08] hover:text-slate-300 transition-colors"
    >
      {children}
    </button>
  );
}

function CtxItem({ label, icon, onClick, danger = false }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors
        ${danger ? "text-rose-400 hover:bg-rose-500/10" : "text-slate-300 hover:bg-white/[0.06]"}`}
    >
      <span className="opacity-60">{icon}</span>
      {label}
    </button>
  );
}
