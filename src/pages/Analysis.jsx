import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AnalyticsIll from "../assets/analytics.svg";

const mockData = {
  aiScore: 32,
  plagiarismScore: 12,
  quality: { coherence: 82, grammar: 91, readability: 78 },
  factCheck: { factualErrors: 3, reliability: 87 },
  summary: "The text appears to be mostly human-written with strong coherence and grammar. Minor factual inconsistencies detected.",
};

function ProgressBar({ label, value }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-text-muted">{label}</span>
        <span className="text-sm text-accent-cyan">{value}%</span>
      </div>
      <div className="w-full h-3 rounded-full bg-[#09202a] overflow-hidden border border-[#12303e]">
        <div style={{ width: `${value}%` }} className="h-3 rounded-full bg-gradient-to-r from-accent-teal to-accent-cyan shadow-glow-strong"></div>
      </div>
    </div>
  );
}

export default function Analysis() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => setData(mockData), 400);
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-muted">
        Analyzing book…
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-16 relative bg-bg-dark">
      <div className="absolute inset-0 bg-gradient-cyan blur-[160px] opacity-12 -z-10"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* illustration left */}
        <div className="hidden lg:flex items-center justify-center">
          <img src={AnalyticsIll} alt="Analytics illustration" className="w-full max-w-xs" />
        </div>

        {/* main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0f2130] border border-[#1f3440] p-6 rounded-xl shadow-glow-teal">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">AI Detection</p>
                <p className="text-4xl font-extrabold text-accent-cyan">{data.aiScore}%</p>
              </div>
              <div className="text-sm text-text-muted">Plagiarism: {data.plagiarismScore}%</div>
            </div>
          </div>

          <div className="bg-[#0f2130] border border-[#1f3440] p-6 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[#071821] rounded-xl">
              <p className="text-2xl font-bold text-accent-teal">{data.quality.coherence}%</p>
              <p className="text-text-muted mt-1">Coherence</p>
            </div>
            <div className="text-center p-4 bg-[#071821] rounded-xl">
              <p className="text-2xl font-bold text-accent-cyan">{data.quality.grammar}%</p>
              <p className="text-text-muted mt-1">Grammar</p>
            </div>
            <div className="text-center p-4 bg-[#071821] rounded-xl">
              <p className="text-2xl font-bold text-accent-teal">{data.quality.readability}%</p>
              <p className="text-text-muted mt-1">Readability</p>
            </div>
          </div>

          <div className="bg-[#0f2130] border border-[#1f3440] p-6 rounded-xl">
            <h3 className="text-accent-cyan font-semibold mb-3">Fact Check</h3>
            <ProgressBar label="Reliability" value={data.factCheck.reliability} />
            <p className="text-text-muted">Errors detected: <span className="text-accent-cyan font-semibold ml-2">{data.factCheck.factualErrors}</span></p>
          </div>

          <div className="bg-[#0f2130] border border-[#1f3440] p-6 rounded-xl">
            <h3 className="text-accent-cyan font-semibold mb-3">Summary</h3>
            <p className="text-text-muted">{data.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
