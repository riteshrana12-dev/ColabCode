export default function RoomGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      className="text-sky-200"
    >
      <path
        d="M18 46C29 20 52 18 62 36C69 49 55 62 40 55C30 50 32 36 44 34"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
