export default function LogoMark() {
  return (
    <div className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.06]">
      <div className="absolute inset-0 rounded-xl bg-sky-300/20 blur-lg" />
      <svg viewBox="0 0 36 36" className="relative h-6 w-6">
        <path
          d="M9 18C9 11.8 12.7 8 18.6 8C22 8 24.8 9.3 26.8 11.7L23.7 14.6C22.4 13.1 20.8 12.3 18.8 12.3C15.4 12.3 13.3 14.6 13.3 18C13.3 21.4 15.4 23.7 18.8 23.7C20.8 23.7 22.4 22.9 23.7 21.4L26.8 24.3C24.8 26.7 22 28 18.6 28C12.7 28 9 24.2 9 18Z"
          fill="#E0F2FE"
        />
      </svg>
    </div>
  );
}
