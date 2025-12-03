// src/pages/Analysis.jsx
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { simulateAnalysis } from "../utils/fakeAnalysis";
import AnalyticsIll from "../assets/analytics.svg";

/*
  Academic Tech style Analysis Page
  - Runs simulateAnalysis pipeline internally if startPipeline flag is true.
  - Shows polished layout with radar, bars, badges, insights, and download.
  - Color palette: soft blues, whites, subtle shadows.
*/

const FALLBACK = {
  aiScore: 32,
  plagiarism: 12,
  coherence: 82,
  grammar: 91,
  readability: 78,
  reliability: 87,
  summary: "Mostly human-written with natural variation in style. Minor factual inconsistencies detected.",
};

export default function Analysis() {
  const { state } = useLocation();
  const startPipeline = state?.startPipeline || false;
  const initialResults = state?.results || null;

  const [running, setRunning] = useState(Boolean(startPipeline) && !initialResults);
  const [stage, setStage] = useState("Starting analysis...");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(initialResults || null);
  const [completed, setCompleted] = useState(Boolean(initialResults));

  // When user lands with startPipeline flag, run the pipeline here (not passed through history)
  useEffect(() => {
    let cancelled = false;
    if (!startPipeline || initialResults) return;

    (async () => {
      setRunning(true);
      try {
        const { runPipeline, results: initial } = await simulateAnalysis("extracted text placeholder");

        for await (const step of runPipeline()) {
          if (cancelled) return;
          setStage(step.stage);
          setProgress(step.progress);
        }

        if (cancelled) return;
        setResults(initial);
        setCompleted(true);
      } catch (err) {
        console.error("Pipeline error", err);
      } finally {
        if (!cancelled) setRunning(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [startPipeline, initialResults]);

  // If no results (page loaded directly without pipeline), show fallback
  const finalResults = results || FALLBACK;

  // Generate quick insights from metrics
  const insights = useMemo(() => {
    const notes = [];
    const r = finalResults;
    if (r.aiScore >= 60) notes.push("High likelihood of AI-generation — consider manual review of style.");
    else if (r.aiScore >= 35) notes.push("Possible AI influence detected — investigate repetitive phrasing.");
    else notes.push("Low AI-likelihood — writing appears human in style.");

    if (r.plagiarism >= 40) notes.push("High plagiarism detected — verify citations and check sources.");
    else if (r.plagiarism >= 15) notes.push("Moderate textual overlap with known sources.");
    else notes.push("Low plagiarism — text appears original.");

    if (r.reliability < 70) notes.push("Moderate factual reliability — verify empirical claims.");
    else notes.push("High factual reliability score.");

    if (r.grammar < 75) notes.push("Grammar suggestions recommended; run proofreading.");
    if (r.coherence < 70) notes.push("Coherence could be improved; check transitions between sections.");

    return notes;
  }, [finalResults]);

  // Helpers for badges
  const getBadge = (type) => {
    const v = finalResults[type];
    if (type === "aiScore") {
      if (v >= 60) return { text: "High AI-Likelihood", tone: "danger" };
      if (v >= 35) return { text: "Moderate AI-Likelihood", tone: "warn" };
      return { text: "Low AI-Likelihood", tone: "safe" };
    }
    if (type === "plagiarism") {
      if (v >= 40) return { text: "High Plagiarism", tone: "danger" };
      if (v >= 15) return { text: "Moderate Plagiarism", tone: "warn" };
      return { text: "Low Plagiarism", tone: "safe" };
    }
    if (type === "reliability") {
      if (v >= 80) return { text: "High Reliability", tone: "safe" };
      if (v >= 60) return { text: "Moderate Reliability", tone: "warn" };
      return { text: "Low Reliability", tone: "danger" };
    }
    return { text: `${v}`, tone: "neutral" };
  };

  // Download JSON report
  const downloadJSON = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      report: finalResults,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookguard-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // (Optional) small helper for progress text
  const progressText = running ? `${progress}% — ${stage}` : "Analysis complete";

  // ---------- RENDER ----------
  if (running && !completed) {
    // Pipeline UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-800 px-6">
        <div className="max-w-xl w-full text-center p-6 rounded-lg shadow-md border border-slate-200">
          <div className="text-sm text-slate-500 mb-4">Processing book for analysis</div>
          <div className="text-xl font-semibold text-slate-900 mb-3">{stage}</div>

          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-slate-500 mt-3">
            <div>{progress}%</div>
            <div>approx {Math.max(10, Math.round((100 - progress) / 2.5))}s</div>
          </div>
        </div>
      </div>
    );
  }

  // Final detailed dashboard
  return (
    <div className="min-h-screen bg-white text-slate-900 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Analysis Report</h1>
            <p className="text-slate-500 mt-1">Authorship · Plagiarism · Writing quality · Factual reliability</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={downloadJSON}
              className="px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            >
              Download JSON
            </button>
          </div>
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <LargeCard title="AI Detection" value={`${finalResults.aiScore}%`} subtitle="Likelihood" />
          <LargeCard title="Plagiarism" value={`${finalResults.plagiarism}%`} subtitle="Overlap" />
          <LargeCard title="Reliability" value={`${finalResults.reliability}%`} subtitle="Factual reliability" />
        </div>

        {/* Badges + insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-lg">
            <h3 className="text-sm text-slate-600 mb-3">Confidence</h3>
            <div className="flex flex-wrap gap-2">
              <Badge data={getBadge("aiScore")} />
              <Badge data={getBadge("plagiarism")} />
              <Badge data={getBadge("reliability")} />
            </div>

            <h4 className="text-sm text-slate-600 mt-4 mb-2">Top insights</h4>
            <ul className="list-disc ml-5 text-sm text-slate-700 space-y-2">
              {insights.slice(0, 4).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Radar + Bars combined */}
          <div className="lg:col-span-2 bg-slate-50 border border-slate-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Radar */}
              <div>
                <h4 className="text-sm text-slate-600 mb-3">Writing Quality — Radar</h4>
                <div className="w-full max-w-sm mx-auto">
                  <RadarAcademic
                    values={[finalResults.coherence, finalResults.grammar, finalResults.readability]}
                    labels={["Coherence", "Grammar", "Readability"]}
                    size={300}
                  />
                </div>
              </div>

              {/* Horizontal Bars */}
              <div>
                <h4 className="text-sm text-slate-600 mb-3">Detailed Scores — Bars</h4>
                <div className="space-y-4">
                  <BarRow label="Coherence" value={finalResults.coherence} />
                  <BarRow label="Grammar" value={finalResults.grammar} />
                  <BarRow label="Readability" value={finalResults.readability} />
                </div>
              </div>
            </div>

            {/* Summary + actions */}
            <div className="mt-6 border-t border-slate-100 pt-6">
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
                  <p className="text-slate-700 mt-3">{finalResults.summary}</p>

                  <div className="mt-4 text-sm text-slate-600">
                    <strong>Actionable steps:</strong>
                    <ol className="list-decimal ml-5 mt-2 space-y-2">
                      <li>Manually verify any empirical claims flagged as low reliability.</li>
                      <li>Proofread sections flagged by grammar suggestions.</li>
                      <li>Double-check sources for moderate plagiarism areas.</li>
                    </ol>
                  </div>
                </div>

                <div className="w-40">
                  <img src={AnalyticsIll} alt="analytics" className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical note */}
        <div className="text-sm text-slate-500">
          <strong>Note:</strong> This front-end currently runs a simulated analysis. When connected to your model backend, results will be replaced by the real model output.
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function LargeCard({ title, value, subtitle }) {
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-lg shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-3xl font-semibold text-slate-900 mt-2">{value}</div>
      {subtitle && <div className="text-sm text-slate-500 mt-1">{subtitle}</div>}
    </div>
  );
}

function Badge({ data }) {
  const tone = data.tone;
  const base =
    tone === "danger"
      ? "bg-red-50 text-red-700 border border-red-100"
      : tone === "warn"
      ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
      : "bg-blue-50 text-blue-700 border border-blue-100";

  return <div className={`${base} px-3 py-1 rounded-full text-sm`}>{data.text}</div>;
}

/* ---------------- Radar — Academic style with rings & labels ---------------- */
function RadarAcademic({
  values = [50, 50, 50],
  labels = ["A", "B", "C"],
  size = 260,
}) {
  // EXTREMELY GENEROUS padding to prevent any clipping
  const padding = 80;
  const view = size + padding * 2;

  const cx = view / 2;
  const cy = view / 2;

  const levels = 4;
  const maxR = size / 2; // full size triangle inside padded SVG

  // ---- GRID RINGS ----
  const grid = [];
  for (let l = levels; l >= 1; l--) {
    const r = (maxR * l) / levels;
    const pts = labels
      .map((_, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(" ");
    grid.push(pts);
  }

  // ---- DATA POLYGON ----
  const polyPts = values
    .map((v, i) => {
      const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
      const r = (v / 100) * maxR;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${view} ${view}`}
      style={{ overflow: "visible" }} // ensures NO clipping ever
    >
      {/* Rings */}
      {grid.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill={i % 2 === 0 ? "#f1f5f9" : "transparent"}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}

      {/* Axes + Labels */}
      {labels.map((lab, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;

        // extend label far outward
        const dist = maxR + 55;

        const lx = cx + dist * Math.cos(angle);
        const ly = cy + dist * Math.sin(angle);

        let anchor = "middle";

        // horizontal alignment
        if (Math.abs(Math.cos(angle)) > 0.5) {
          anchor = Math.cos(angle) > 0 ? "start" : "end";
        }

        // vertical alignment for perfect centering
        const baseline =
          Math.abs(Math.sin(angle)) > 0.5 ? "middle" : "central";

        // axis lines
        const ax = cx + maxR * Math.cos(angle);
        const ay = cy + maxR * Math.sin(angle);

        return (
          <g key={i}>
            <line
              x1={cx}
              y1={cy}
              x2={ax}
              y2={ay}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text
              x={lx}
              y={ly}
              fontSize="14"
              fill="#64748b"
              textAnchor={anchor}
              dominantBaseline={baseline}
            >
              {lab}
            </text>
          </g>
        );
      })}

      {/* Data polygon */}
      <polygon
        points={polyPts}
        fill="#93c5fd33"
        stroke="#3b82f6"
        strokeWidth="2"
      />
    </svg>
  );
}



/* ---------------- Horizontal Bar Row ---------------- */
function BarRow({ label, value }) {
  const percent = Math.max(0, Math.min(100, value));
  const color = percent >= 85 ? "bg-blue-600" : percent >= 70 ? "bg-blue-500" : "bg-blue-400";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-slate-600">
        <div>{label}</div>
        <div className="font-medium">{percent}%</div>
      </div>

      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
        <div className={`${color} h-3`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
