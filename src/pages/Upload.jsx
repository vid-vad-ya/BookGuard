import { useState } from "react";
import UploadIll from "../assets/upload.svg";
import Loading from "../components/Loading";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); };
  const handleFileSelect = (e) => { const f = e.target.files[0]; if (f) setFile(f); };

  const handleAnalyze = () => {
    if (!file) return;
    setLoading(true);
    // simulate processing delay, then navigate
    setTimeout(() => {
      // navigate to analysis page (mock id)
      window.location.href = "/analysis/123";
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative bg-bg-dark">
      <div className="absolute inset-0 bg-gradient-cyan blur-[140px] opacity-08 -z-10"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-12">
        <div className="flex items-center justify-center">
          <img src={UploadIll} alt="Upload illustration" className="w-full max-w-sm" />
        </div>

        <div className="bg-[#0f2130] border border-border-card p-8 rounded-2xl shadow-glow-cyan">
          <h2 className="text-2xl font-semibold text-accent-cyan mb-4">Upload a file</h2>

          <div
            className={`w-full h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition
              ${isDragging ? "border-accent-cyan bg-[#06202a]" : "border-border-card hover:border-accent-cyan hover:shadow-glow-cyan"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
            role="button"
            tabIndex={0}
          >
            {!file ? (
              <div className="text-center">
                <p className="text-text-main">Drag & Drop your .txt/.pdf here</p>
                <p className="text-text-muted text-sm mt-1">or click to browse</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-text-muted">Selected file</p>
                <p className="text-accent-cyan font-semibold mt-1">{file.name}</p>
              </div>
            )}

            <input id="fileInput" type="file" accept=".txt,.pdf" className="hidden" onChange={handleFileSelect} />
          </div>

          {!loading && file && (
            <button onClick={handleAnalyze} className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-accent-teal to-accent-cyan text-bg-dark font-semibold shadow-glow-cyan">
              Analyze Book
            </button>
          )}

          {loading && (
            <div className="mt-6 flex justify-center">
              <Loading text="Analyzing book…" />
            </div>
          )}

          <div className="mt-4 text-sm text-text-muted">
            <strong>Supported:</strong> .txt, .pdf • Max 10 MB
          </div>
        </div>
      </div>
    </div>
  );
}
