export default function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-[1.6rem] border border-white/12 bg-[#07101f]/95 p-7 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-black tracking-[-0.02em] text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
