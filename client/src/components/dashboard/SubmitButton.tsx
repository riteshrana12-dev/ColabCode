export default function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="landing-glow-button flex h-11 w-full items-center justify-center rounded-xl bg-sky-300 text-sm font-black text-[#03111f] shadow-[0_0_40px_rgba(56,189,248,0.3)] transition-transform hover:-translate-y-0.5"
    >
      {label}
    </button>
  );
}
