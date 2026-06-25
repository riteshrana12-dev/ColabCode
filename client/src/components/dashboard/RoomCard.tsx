import RoomGlyph from "./ui/RoomGlyph";
import SmallBtn from "./SmallBtn";

export default function RoomCard({
  room,
  isOwner,
  copied,
  onEnter,
  onCopy,
  onDelete,
  onRename,
  onLeave,
}: {
  room: Room;
  isOwner: boolean;
  copied: string | null;
  onEnter: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onRename: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onClick={onEnter}
      className="landing-bento group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition-colors hover:border-white/20"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-sky-300/15 blur-3xl" />
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.06]">
            <RoomGlyph />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{room.name}</p>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">
              {isOwner ? "Owner" : "Member"}
            </p>
          </div>
        </div>
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative mt-4 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <SmallBtn
          onClick={onCopy}
          label={copied === room.inviteCode ? "Copied" : "Copy code"}
        />
        {isOwner && <SmallBtn onClick={onRename} label="Rename" />}
        {isOwner ? (
          <SmallBtn onClick={onDelete} label="Delete" danger />
        ) : (
          <SmallBtn onClick={onLeave} label="Leave" danger />
        )}
      </div>
    </div>
  );
}
