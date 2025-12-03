import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadIll from "../assets/upload.svg";
import { simulateAnalysis } from "../utils/fakeAnalysis";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  // ⭐ FIXED: No pipeline passed. Only send a flag.
  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);

    // Fake extracted text
    const text = "dummy extracted text";

    // Prepare fake results (pipeline will run in Analysis.jsx)
    const { results } = await simulateAnalysis(text);

    navigate("/analysis/123", {
      state: {
        startPipeline: true, // signal to start animation
        results,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative bg-bg-dark">
      <div className="absolute inset-0 bg-gradient-cyan blur-[160px] opacity-10 -z-10"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-12">
        <div className="flex items-center justify-center">
          <img src={UploadIll} alt="Upload illustration" className="w-full max-w-sm" />
        </div>

        <div className="bg-[#0f2130] border border-border-card p-8 rounded-2xl shadow-glow-cyan">
          <h2 className="text-2xl font-semibold text-accent-cyan mb-4">Upload a File</h2>

          <div
            className={`w-full h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition
            ${
              isDragging
                ? "border-accent-cyan bg-[#06202a] shadow-glow-strong"
                : "border-border-card hover:border-accent-cyan hover:shadow-glow-cyan"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            {!file ? (
              <div className="text-center">
                <p className="text-text-main text-lg">Drag & Drop your file here</p>
                <p className="text-text-muted text-sm mt-1">or click to browse (.pdf, .txt)</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-text-muted">Selected file:</p>
                <p className="text-accent-cyan font-semibold mt-1">{file.name}</p>
              </div>
            )}

            <input
              id="fileInput"
              type="file"
              accept=".txt,.pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {!loading && file && (
            <button
              onClick={handleAnalyze}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-accent-teal to-accent-cyan text-bg-dark font-semibold shadow-glow-cyan transition-all"
            >
              Analyze Book
            </button>
          )}

          {loading && (
            <div className="mt-6 flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin shadow-glow-strong"></div>
              <p className="text-text-muted mt-4">Preparing analysis…</p>
            </div>
          )}

          <div className="mt-4 text-sm text-text-muted">
            <strong>Supported:</strong> .txt , .pdf • Max 10 MB
          </div>
        </div>
      </div>
    </div>
  );
}
