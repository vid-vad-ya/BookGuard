export default function GradientButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-teal via-accent-cyan to-accent-cyan-bright text-bg-dark font-semibold shadow-glow-cyan hover:shadow-glow-strong transition-all"
    >
      {text}
    </button>
  );
}
