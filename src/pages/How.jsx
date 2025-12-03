import ReadingIll from "../assets/how.png";

export default function How() {
  return (
    <div className="min-h-screen px-6 py-20 bg-bg-dark relative">
      <div className="absolute inset-0 bg-gradient-cyan blur-[160px] opacity-08 -z-10"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold text-accent-cyan mb-6">How BookGuard Works</h1>

          <div className="space-y-5 text-text-muted leading-relaxed">
            <p><strong>1 — Upload</strong> your .txt or .pdf book. The system accepts common formats and extracts text.</p>
            <p><strong>2 — Analyze</strong> using linguistic and statistical heuristics plus ML models to estimate AI authorship probability.</p>
            <p><strong>3 — Report</strong> shows AI detection score, plagiarism percentage, writing metrics, and a factual reliability score.</p>
            <p><strong>4 — Action</strong> use the report to decide on publishing, investigate sources, or request human review.</p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <img src={ReadingIll} alt="How it works illustration" className="w-full max-w-md" />
        </div>
      </div>
    </div>
  );
}
