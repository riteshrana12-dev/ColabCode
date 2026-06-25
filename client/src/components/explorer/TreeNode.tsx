import { useState } from "react";
import { useFileStore } from "../../store/fileStore";
import FolderIcon from "./icon/FolderIcon";
import FileIcon from "./icon/FileIcon";
import InlineInput from "./InlineInput";
import type { FileNode } from "../../types";

export default function TreeNode({
  node,
  depth,
  renamingId,
  creating,
  inputVal,
  inputRef,
  setInputVal,
  setCreating,
  setRenamingId,
  onCtxMenu,
  onOpen,
  onRename,
  onCreate,
}: any) {
  const activeFileId = useFileStore((s) => s.activeFileId);
  const [open, setOpen] = useState(true);
  const isActive = activeFileId === node.id;

  return (
    <div>
      <div
        className={`group flex items-center gap-1.5 rounded-md mx-1 px-2 py-[3px] cursor-pointer transition-colors text-xs
          ${isActive ? "bg-sky-500/15 text-sky-300" : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"}`}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        onClick={() => {
          if (node.type === "folder") setOpen((o: boolean) => !o);
          else onOpen(node);
        }}
        onContextMenu={(e) => onCtxMenu(e, node)}
      >
        {node.type === "folder" ? (
          <>
            <span className="text-[10px] text-slate-600">
              {open ? "▾" : "▸"}
            </span>
            <FolderIcon open={open} />
          </>
        ) : (
          <>
            <span className="w-3.5 shrink-0" />
            <FileIcon name={node.name} />
          </>
        )}

        {renamingId === node.id ? (
          (() => {
            const confirmed = { current: false };
            return (
              <input
                ref={inputRef}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onBlur={() => {
                  if (!confirmed.current) onRename(node);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    confirmed.current = true;
                    onRename(node);
                  }
                  if (e.key === "Escape") {
                    confirmed.current = true;
                    setRenamingId(null);
                    setInputVal("");
                  }
                }}
                className="flex-1 rounded bg-white/10 px-1 py-0.5 text-xs text-white outline-none ring-1 ring-sky-400/50"
                onClick={(e) => e.stopPropagation()}
              />
            );
          })()
        ) : (
          <span className="flex-1 truncate">{node.name}</span>
        )}
      </div>

      {node.type === "folder" && open && (
        <div>
          {node.children.map((child: FileNode) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              renamingId={renamingId}
              creating={creating}
              inputVal={inputVal}
              inputRef={inputRef}
              setInputVal={setInputVal}
              setCreating={setCreating}
              setRenamingId={setRenamingId}
              onCtxMenu={onCtxMenu}
              onOpen={onOpen}
              onRename={onRename}
              onCreate={onCreate}
            />
          ))}
          {creating && creating.parentId === node.id && (
            <InlineInput
              type={creating.type}
              value={inputVal}
              depth={depth + 1}
              inputRef={inputRef}
              onChange={setInputVal}
              onConfirm={onCreate}
              onCancel={() => {
                setCreating(null);
                setInputVal("");
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
