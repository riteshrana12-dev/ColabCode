import RoomGlyph from "./ui/RoomGlyph";

export default function EmptyState({
  onCreate,
  onJoin,
}: {
  onCreate: () => void;
  onJoin: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-[1.6rem] border border-dashed border-white/15 bg-white/[0.02] py-24 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
        <RoomGlyph size={26} />
      </div>
      <div>
        <p className="text-base font-black text-white">No rooms yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Create a room or join one with an invite code
        </p>
      </div>
      <div className="mt-1 flex gap-3">
        <button
          onClick={onJoin}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-xs font-bold text-slate-200 transition-colors hover:bg-white/[0.08]"
        >
          Join with code
        </button>
        <button
          onClick={onCreate}
          className="landing-glow-button inline-flex h-10 items-center justify-center rounded-xl bg-sky-300 px-5 text-xs font-black text-[#03111f] transition-transform hover:-translate-y-0.5"
        >
          Create room
        </button>
      </div>
    </div>
  );
}
