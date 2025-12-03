export default function Footer() {
  return (
    <footer className="w-full border-t border-border-card bg-bg-dark/70 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-r from-accent-teal to-accent-cyan" />
          <div>
            <div className="text-text-main font-semibold">BookGuard AI</div>
            <div className="text-text-muted text-sm">Built by Dhivya — React · AWS · NLP</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="text-text-muted hover:text-accent-cyan">Privacy</a>
          <a href="#" className="text-text-muted hover:text-accent-cyan">Terms</a>
          <a href="https://github.com/yourusername" className="text-text-muted hover:text-accent-cyan">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
