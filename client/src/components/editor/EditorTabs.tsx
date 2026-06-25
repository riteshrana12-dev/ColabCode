import { useFileStore } from "../../store/fileStore";

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
  html: "#f97316",
  sh: "#10b981",
};

function fileColor(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return EXT_COLORS[ext] || "#64748b";
}

export default function EditorTabs() {
  const { openTabs, activeFileId, closeTab, setActiveFile } = useFileStore();

  if (openTabs.length === 0) return null;

  return (
    <div className="flex h-9 shrink-0 items-end overflow-x-auto border-b border-white/[0.08] bg-[#0a0f1a] px-1 gap-0.5 pt-1">
      {openTabs.map((tab) => {
        const isActive = tab.id === activeFileId;
        const color = fileColor(tab.name);
        return (
          <div
            key={tab.id}
            onClick={() => setActiveFile(tab.id)}
            className={`group relative flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-t-lg px-3 text-xs transition-all
              ${
                isActive
                  ? "bg-[#0d1117] text-white border border-b-0 border-white/[0.08]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
              }`}
          >
            {/* colored dot */}
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="max-w-[120px] truncate">{tab.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="flex h-4 w-4 items-center justify-center rounded text-slate-600 opacity-0 transition-all hover:bg-white/10 hover:text-slate-300 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
