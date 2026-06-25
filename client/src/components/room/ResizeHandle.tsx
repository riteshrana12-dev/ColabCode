export default function ResizeHandle({
  direction,
  onPointerDown,
}: {
  direction: "h" | "v";
  onPointerDown: () => void;
}) {
  const isH = direction === "h";
  return (
    <div
      onPointerDown={onPointerDown}
      className={`${isH ? "resize-handle-h w-1.5 cursor-col-resize flex items-center justify-center" : "resize-handle-v h-1.5 cursor-row-resize flex items-center justify-center"} shrink-0 group`}
    >
      <div
        className={`${isH ? "resize-line-h h-full w-px" : "resize-line-v w-full h-px"} bg-white/[0.06] transition-colors group-hover:bg-sky-400/40`}
      />
    </div>
  );
}
