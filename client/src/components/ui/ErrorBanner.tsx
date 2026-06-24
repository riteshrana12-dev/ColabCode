export default function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3.5 py-2.5 text-xs font-medium text-rose-300">
      {message}
    </div>
  );
}
