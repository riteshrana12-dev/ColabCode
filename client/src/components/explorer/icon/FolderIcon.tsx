export default function FolderIcon({ open }: { open: boolean }) {
  return (
    <span
      className={`text-[13px] ${open ? "text-yellow-400" : "text-yellow-500/80"}`}
    >
      {open ? "📂" : "📁"}
    </span>
  );
}
