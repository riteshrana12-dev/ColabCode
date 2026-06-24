export default function AuthBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.28),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(168,85,247,0.18),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(52,211,153,0.12),transparent_30%),linear-gradient(180deg,#030712_0%,#06101f_52%,#030712_100%)]" />
      <svg
        className="absolute inset-0 h-full w-full opacity-25"
        viewBox="0 0 1200 900"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="auth-grid-pattern"
            width="52"
            height="52"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M52 0H0V52"
              fill="none"
              stroke="rgba(148,163,184,0.16)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="1200" height="900" fill="url(#auth-grid-pattern)" />
      </svg>
    </div>
  );
}
