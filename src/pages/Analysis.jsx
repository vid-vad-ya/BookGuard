// src/pages/Analysis.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import generatePDFReport from "../utils/generatePDF";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import logoPath from "../assets/logo.png"; // can keep this; generatePDF will try to load it

export default function Analysis() {
  const { state = {} } = useLocation();
  const { extractedText = "", results = {}, bookTitle = "" } = state;

  // Provide defaults if results missing
  const aiScore = results.aiScore ?? 32;
  const plagiarism = results.plagiarism ?? 12;
  const reliability = results.reliability ?? 78;
  const coherence = results.coherence ?? 82;
  const grammar = results.grammar ?? 91;
  const readability = results.readability ?? 78;

  // refs for capture
  const summaryRef = useRef(null);
  const chartsRef = useRef(null);
  const insightsRef = useRef(null);

  const [chartsReady, setChartsReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setChartsReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  const radarData = [
    { subject: "Coherence", A: coherence },
    { subject: "Grammar", A: grammar },
    { subject: "Readability", A: readability },
  ];

  const barData = [
    { name: "Coherence", value: coherence },
    { name: "Grammar", value: grammar },
    { name: "Readability", value: readability },
  ];

  const handleDownload = async () => {
    if (!chartsReady) {
      alert("Please wait a moment for charts to finish rendering.");
      return;
    }
    setIsGenerating(true);
    try {
      await generatePDFReport({
        bookTitle,
        author: results.author || "",
        extractedText,
        results,
        elements: {
          summaryEl: summaryRef.current,
          chartsEl: chartsRef.current,
          insightsEl: insightsRef.current,
        },
        // You may instead pass logoDataUrl: 'data:image/png;base64,...' if you convert it locally
        // logoDataUrl: 'data:image/png;base64,...'
      });
    } catch (err) {
      console.error(err);
      alert("PDF generation failed. See console.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071028] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Analysis Report</h1>
            <p className="text-sm text-gray-300">{bookTitle || "Untitled"}</p>
          </div>

          <div>
            <button
              onClick={handleDownload}
              disabled={isGenerating || !chartsReady}
              className={`px-4 py-2 rounded font-semibold ${
                isGenerating || !chartsReady ? "bg-gray-500 text-white" : "bg-cyan-400 text-black"
              }`}
            >
              {isGenerating ? "Generating..." : !chartsReady ? "Preparing..." : "Download Report"}
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div id="report-summary" ref={summaryRef} className="bg-white text-black p-6 rounded-lg mb-6">
          <div className="flex items-start gap-6">
            <div style={{ flex: 1 }}>
              <h2 className="text-xl font-semibold mb-2">Summary</h2>
              <p style={{ color: "#333" }}>{results.summary || "Mostly human-written with natural variation in style."}</p>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <div style={{ fontSize: 30, fontWeight: 700 }}>{aiScore}%</div>
                  <div style={{ fontSize: 12, color: "#666" }}>AI Likelihood</div>
                </div>
                <div>
                  <div style={{ fontSize: 30, fontWeight: 700 }}>{plagiarism}%</div>
                  <div style={{ fontSize: 12, color: "#666" }}>Plagiarism</div>
                </div>
                <div>
                  <div style={{ fontSize: 30, fontWeight: 700 }}>{reliability}%</div>
                  <div style={{ fontSize: 12, color: "#666" }}>Reliability</div>
                </div>
              </div>
            </div>

            <div style={{ width: 180 }}>
              <img src={logoPath} alt="logo" style={{ width: 120 }} />
              <div style={{ fontSize: 12, color: "#666", marginTop: 12 }}>
                Generated: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div id="report-charts" ref={chartsRef} className="bg-white text-black p-6 rounded-lg mb-6">
          <h3 className="font-semibold mb-3">Writing Quality — Radar</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Score" dataKey="A" stroke="#3182ce" fill="#63b3ed" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <h3 className="font-semibold my-4">Detailed Scores — Bars</h3>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3182ce" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INSIGHTS */}
        <div id="report-insights" ref={insightsRef} className="bg-white text-black p-6 rounded-lg mb-6">
          <h3 className="font-semibold mb-3">Insights & Recommendations</h3>
          <ul className="list-decimal pl-5 text-gray-800">
            {(results.insights || [
              "Possible AI influence detected — investigate repetitive phrasing.",
              "Moderate textual overlap with known sources.",
              "High factual reliability score."
            ]).map((it, i) => (
              <li key={i} className="mb-2">{it}</li>
            ))}
          </ul>
        </div>

        {/* Extracted preview */}
        <div className="bg-[#071228] p-4 rounded text-sm text-gray-300">
          <h4 className="font-medium mb-2">Extracted text preview</h4>
          <pre className="whitespace-pre-wrap text-xs">{extractedText.slice(0, 2000)}{extractedText.length > 2000 ? "..." : ""}</pre>
        </div>
      </div>
    </div>
  );
}
