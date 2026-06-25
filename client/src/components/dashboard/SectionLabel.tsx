export default function SectionLabel({ label }: { label: string }) {
  return (
    <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-slate-600">
      {label}
    </p>
  );
}
