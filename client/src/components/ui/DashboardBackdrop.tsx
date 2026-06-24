export default function DashboardBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.22),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(168,85,247,0.14),transparent_26%),radial-gradient(circle_at_50%_90%,rgba(52,211,153,0.1),transparent_30%),linear-gradient(180deg,#030712_0%,#06101f_52%,#030712_100%)]" />
    </div>
  );
}
