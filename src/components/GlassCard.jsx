export default function GlassCard({ children }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-glow transition">
      {children}
    </div>
  );
}
