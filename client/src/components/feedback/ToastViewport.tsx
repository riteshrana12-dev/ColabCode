import { useToastStore, type ToastType } from "../../store/toastStore";

const tone: Record<ToastType, string> = {
  info: "border-sky-400/25 bg-sky-500/10 text-sky-100",
  success: "border-emerald-400/25 bg-emerald-500/10 text-emerald-100",
  warning: "border-amber-400/25 bg-amber-500/10 text-amber-100",
  error: "border-rose-400/25 bg-rose-500/10 text-rose-100",
};

const dot: Record<ToastType, string> = {
  info: "bg-sky-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  error: "bg-rose-400",
};

export default function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[360px] max-w-[calc(100vw-32px)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto overflow-hidden rounded-lg border shadow-2xl shadow-black/30 backdrop-blur-xl ${tone[toast.type]}`}
        >
          <div className="flex gap-3 p-3">
            <span
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${dot[toast.type]}`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">{toast.title}</p>
              {toast.message && (
                <p className="mt-0.5 text-xs leading-5 text-slate-300">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Dismiss notification"
            >
              x
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
