import { useRef } from "react";
import FolderIcon from "./icon/FolderIcon";
import FileIcon from "./icon/FileIcon";

export default function InlineInput({
  type,
  value,
  depth,
  inputRef,
  onChange,
  onConfirm,
  onCancel,
}: any) {
  const confirmed = useRef(false);
  return (
    <div
      className="flex items-center gap-1.5 mx-1 rounded-md px-2 py-[3px]"
      style={{ paddingLeft: `${8 + depth * 14}px` }}
    >
      {type === "folder" ? (
        <FolderIcon open={false} />
      ) : (
        <FileIcon name="new" />
      )}
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          if (!confirmed.current) onConfirm();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            confirmed.current = true;
            onConfirm();
          }
          if (e.key === "Escape") {
            confirmed.current = true;
            onCancel();
          }
        }}
        className="flex-1 rounded bg-white/10 px-1.5 py-0.5 text-xs text-white outline-none ring-1 ring-sky-400/60"
        placeholder={type === "folder" ? "folder name" : "file name"}
      />
    </div>
  );
}
