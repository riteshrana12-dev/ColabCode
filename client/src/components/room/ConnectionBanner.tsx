export default function ConnectionBanner({
  status,
  message,
  onRetry,
}: {
  status:
    | "connecting"
    | "connected"
    | "reconnecting"
    | "disconnected"
    | "failed";
  message: string;
  onRetry: () => void;
}) {
  const isTrying = status === "connecting" || status === "reconnecting";

  return (
    <div className="flex h-10 shrink-0 items-center justify-between border-b border-amber-400/20 bg-amber-500/10 px-4">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            isTrying ? "animate-pulse bg-amber-300" : "bg-rose-300"
          }`}
        />
        <p className="truncate text-xs text-amber-100">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="ml-3 shrink-0 rounded-md border border-amber-300/30 px-2.5 py-1 text-[11px] font-medium text-amber-100 transition-colors hover:bg-amber-300/10"
      >
        Retry
      </button>
    </div>
  );
}
