export default function SmallBtn({
  onClick,
  label,
  danger = false,
}: {
  onClick: () => void;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors
        ${danger ? "text-rose-300 hover:bg-rose-400/10" : "text-slate-400 hover:bg-white/[0.08] hover:text-white"}`}
    >
      {label}
    </button>
  );
}
