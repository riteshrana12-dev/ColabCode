export default function EmptyEditor({ connected }: { connected: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center px-8">
      <div className="h-12 w-12 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-slate-600"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">
          {connected ? "No file open" : "Connecting..."}
        </p>
        {connected && (
          <p className="mt-1 text-xs text-slate-700">
            Create or click a file in the explorer · Ctrl+click HTML links to
            navigate files
          </p>
        )}
      </div>
    </div>
  );
}
