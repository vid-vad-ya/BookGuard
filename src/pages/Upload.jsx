import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadIll from "../assets/upload.svg";
import extractTextFromFile from "../utils/extractText";
import { simulateAnalysis } from "../utils/fakeAnalysis";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stageText, setStageText] = useState("");
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  // --------------------------
  // File handlers
  // --------------------------
  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewURL(URL.createObjectURL(selected));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setPreviewURL(URL.createObjectURL(dropped));
    }
  };

  // --------------------------
  // MAIN: Extract + Analyze
  // --------------------------
  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setStageText("Extracting text...");
    setProgress(20);

    let extractedText = "";

    try {
      extractedText = await extractTextFromFile(file);
      setProgress(100);
    } catch (err) {
      console.error(err);
      alert("Text extraction failed!");
      setLoading(false);
      return;
    }

    setStageText("Running analysis...");
    setProgress(40);

    const { results } = await simulateAnalysis(extractedText);

    navigate(`/analysis/${Date.now()}`, {
      state: { extractedText, results },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative bg-bg-dark">
      <div className="absolute inset-0 bg-gradient-cyan blur-[160px] opacity-10 -z-10"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-start py-12">

        {/* Illustration */}
        <div className="flex items-center justify-center">
          <img src={UploadIll} alt="Upload illustration" className="w-full max-w-sm" />
        </div>

        {/* Upload Panel */}
        <div className="bg-[#0f2130] border border-border-card p-8 rounded-2xl shadow-glow-cyan">
          <h2 className="text-2xl font-semibold text-accent-cyan mb-4">Upload a File</h2>

          {/* Drag & Drop */}
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
              <>
                <p className="text-text-main text-lg">Drag & Drop your file here</p>
                <p className="text-text-muted text-sm mt-1">or click to browse (.pdf, .txt)</p>
              </>
            ) : (
              <>
                <p className="text-text-muted">Selected file:</p>
                <p className="text-accent-cyan font-semibold mt-1">{file.name}</p>
              </>
            )}

            <input
              id="fileInput"
              type="file"
              accept=".txt,.pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Preview Section */}
          {previewURL && (
            <div className="mt-6 p-3 rounded-xl bg-[#0c1927] border border-border-card">
              <h3 className="text-text-main font-semibold mb-2">Preview</h3>

              {file.type === "application/pdf" ? (
                <embed
                  src={previewURL}
                  type="application/pdf"
                  className="w-full h-[350px] rounded-lg"
                />
              ) : (
                <p className="p-2 bg-[#112536] rounded text-text-muted text-sm">{file.name}</p>
              )}
            </div>
          )}

          {/* Analyze Button */}
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

          <div className="mt-4 text-sm text-text-muted">
            <strong>Supported:</strong> PDF, TXT • Max 10 MB
          </div>
        </div>
      </div>
    </div>
  );
}
