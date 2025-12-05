import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadIll from "../assets/upload.svg";
import { extractPDF, extractTXT } from "../utils/extractText";
import { simulateAnalysis } from "../utils/fakeAnalysis";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [stageText, setStageText] = useState("");
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  // --------------------------
  // Drag + Drop Handlers
  // --------------------------
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

  // --------------------------
  // MAIN: Extract + Analyze
  // --------------------------
  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setStageText("Extracting text...");
    setProgress(0);

    let extractedText = "";

    try {
      // Detect PDF
      if (file.type === "application/pdf") {
        extractedText = await extractPDF(file, (p) => setProgress(p));
      }
      // Detect TXT
      else if (file.type === "text/plain") {
        extractedText = await extractTXT(file);
        setProgress(100);
      }
      // Anything else
      else {
        alert("Unsupported format. Please upload a PDF or TXT file.");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error(err);
      alert("Text extraction failed. Try another file.");
      setLoading(false);
      return;
    }

    // --------------------------
    // Run Fake Backend Analysis
    // --------------------------
    setStageText("Running analysis...");
    setProgress(0);

    const { results } = await simulateAnalysis(extractedText);

    navigate(`/analysis/${Date.now()}`, {
      state: {
        startPipeline: true,
        extractedText,
        results,
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
    </div>
  );
}
