export default function PanelTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-6 rounded px-2.5 text-[11px] font-medium transition-colors
        ${active ? "bg-white/[0.08] text-white" : "text-slate-600 hover:text-slate-400"}`}
    >
      {label}
    </button>
  );
}
