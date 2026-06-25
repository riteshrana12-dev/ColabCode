export function TabBtn({
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
      className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors
        ${active ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}
    >
      {label}
    </button>
  );
}
