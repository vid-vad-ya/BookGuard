// src/pages/Upload.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadIll from "../assets/upload.svg";
import extractTextFromFile from "../utils/extractText";
import { simulateAnalysis } from "../utils/fakeAnalysis";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [stageText, setStageText] = useState("");
  const [progress, setProgress] = useState(0);

  const [bookTitle, setBookTitle] = useState(""); // NEW: book title input

  const navigate = useNavigate();

  // ------------------------------------
  // Drag + Drop Handlers
  // ------------------------------------
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  // ------------------------------------
  // MAIN: Extract + Analyze
  // ------------------------------------
  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setStageText("Extracting text...");
    setProgress(10);

    let extractedText = "";

    try {
      extractedText = await extractTextFromFile(file, setProgress);
      setProgress(100);
    } catch (err) {
      console.error(err);
      alert("Text extraction failed. Try another file.");
      setLoading(false);
      return;
    }

    // ------------------------------------
    // Run Fake Backend Analysis
    // ------------------------------------
    setStageText("Running analysis...");
    setProgress(30);

    const { results } = await simulateAnalysis(extractedText);

    navigate(`/analysis/${Date.now()}`, {
      state: {
        startPipeline: true,
        extractedText,
        results,
        bookTitle: bookTitle.trim() || "", // send title to analysis
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative bg-bg-dark">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-cyan blur-[160px] opacity-10 -z-10"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-12">

        {/* Illustration */}
        <div className="flex items-center justify-center">
          <img src={UploadIll} alt="Upload illustration" className="w-full max-w-sm" />
        </div>

        {/* Upload Panel */}
        <div className="bg-[#0f2130] border border-border-card p-8 rounded-2xl shadow-glow-cyan">

          <h2 className="text-2xl font-semibold text-accent-cyan mb-4">Upload a File</h2>

          {/* Drag + Drop Box */}
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
                <p className="text-text-muted text-sm mt-1">
                  or click to browse (.pdf, .txt)
                </p>
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

          {/* NEW — Title input */}
          <div className="mt-5">
            <label className="text-sm text-text-muted">Book Title (optional)</label>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="Enter book title for the PDF report"
              className="mt-2 w-full p-3 rounded-lg bg-[#071021] border border-white/10 text-text-main"
            />
          </div>

          {/* Analyze Button OR Loading */}
          {!loading && file && (
            <button
              onClick={handleAnalyze}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-accent-teal to-accent-cyan text-bg-dark font-semibold shadow-glow-cyan transition-all"
            >
              Analyze Book
            </button>
          )}

          {/* Loading UI */}
          {loading && (
            <div className="mt-6 flex flex-col items-center w-full">
              <p className="text-text-muted text-lg mb-3">{stageText}</p>

              <div className="w-full bg-[#1a2b3a] h-3 rounded-full overflow-hidden border border-[#254056]">
                <div
                  className="h-full bg-accent-cyan transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <p className="text-text-muted mt-3">{progress}%</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 text-sm text-text-muted">
            <strong>Supported formats:</strong> PDF, TXT • Max 10 MB
          </div>
        </div>
      </div>

      {/* PDF Preview (auto shown when file is PDF) */}
      {file && file.type === "application/pdf" && (
        <div className="w-full max-w-4xl mt-10 bg-[#0f2130] border border-border-card rounded-xl p-6 shadow-glow-cyan">
          <h3 className="text-accent-cyan text-lg font-semibold mb-3">Preview</h3>

          <iframe
            src={URL.createObjectURL(file)}
            title="PDF Preview"
            className="w-full h-[70vh] rounded-lg border border-white/10"
          ></iframe>
        </div>
      )}

      {/* TXT Preview */}
      {file && file.type === "text/plain" && (
        <div className="w-full max-w-4xl mt-10 bg-[#0f2130] border border-border-card rounded-xl p-6 shadow-glow-cyan">
          <h3 className="text-accent-cyan text-lg font-semibold mb-3">Preview</h3>

          <pre className="text-text-muted text-sm whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
            Loading text preview…
          </pre>
        </div>
      )}
    </div>
  );
}
