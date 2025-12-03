export default function Loading({ text = "Analyzing..." }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full border-4 border-accent-cyan border-t-transparent animate-spin shadow-glow-strong"></div>
      <p className="text-text-muted">{text}</p>
    </div>
  );
}
