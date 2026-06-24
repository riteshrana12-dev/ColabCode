const EXT_COLORS: Record<string, string> = {
  ts: "#3b82f6",
  tsx: "#3b82f6",
  js: "#eab308",
  jsx: "#eab308",
  py: "#22c55e",
  cpp: "#a855f7",
  c: "#a855f7",
  json: "#f97316",
  md: "#94a3b8",
  css: "#ec4899",
  scss: "#ec4899",
  html: "#f97316",
  sh: "#10b981",
};

export default function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const color = EXT_COLORS[ext] || "#64748b";
  const label = ext ? ext.slice(0, 2).toUpperCase() : "??";
  return (
    <span
      className="w-4 shrink-0 text-[10px] font-bold font-mono leading-none"
      style={{ color }}
    >
      {label}
    </span>
  );
}
