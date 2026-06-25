export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  autoFocus,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </label>
      <input
        type="text"
        required
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-sky-300/50 focus:bg-white/[0.06] ${mono ? "font-mono tracking-wide" : ""}`}
      />
    </div>
  );
}
