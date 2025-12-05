import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadIll from "../assets/upload.svg";
import extractTextFromFile from "../utils/extractText";
import { simulateAnalysis } from "../utils/fakeAnalysis";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [txtPreview, setTxtPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [stageText, setStageText] = useState("");
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  // --------------------------
  // File Handling
  // --------------------------
  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      handleNewFile(selected);
    }
  };

  const handleNewFile = async (selectedFile) => {
    setFile(selectedFile);
    setPreviewURL(null);
    setTxtPreview("");

    const ext = selectedFile.name.split(".").pop().toLowerCase();

    // Create PDF preview
    if (ext === "pdf") {
      const pdfBlobURL = URL.createObjectURL(selectedFile);
      setPreviewURL(pdfBlobURL);
    }

    // Generate TXT preview (first 300 chars)
    if (ext === "txt") {
      const text = await selectedFile.text();
      setTxtPreview(text.slice(0, 300));
    }
  };

  // Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      handleNewFile(dropped);
    }
  };

  // --------------------------
  // MAIN: Extract + Analyze
  // --------------------------
  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setStageText("Extracting text...");
    setProgress(10);

    let extractedText = "";

    try {
      extractedText = await extractTextFromFile(file);
      setProgress(100);
    } catch (err) {
      console.error(err);
      alert("Text extraction failed. Try another file.");
      setLoading(false);
      return;
    }

    // Fake backend analysis
    setStageText("Running analysis...");
    setProgress(40);

    const { results } = await simulateAnalysis(extractedText);

    navigate(`/analysis/${Date.now()}`, {
      state: {
        startPipeline: true,
        extractedText,
        results,
      },
    });
  };

  // --------------------------
  // UI
  // --------------------------
  return (
    <div className="min-h-screen pt-24 px-6 relative bg-bg-dark text-text-main">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-cyan blur-[150px] opacity-10 -z-10"></div>

      <h1 className="text-4xl font-bold text-accent-cyan mb-10 text-center">
        Upload a Book
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Illustration */}
        <div className="flex items-center justify-center">
          <img src={UploadIll} alt="Upload illustration" className="w-full max-w-sm" />
        </div>

        {/* Upload Box */}
        <div className="bg-[#0f2130] border border-border-card p-8 rounded-2xl shadow-glow-cyan">
          <h2 className="text-2xl font-semibold text-accent-cyan mb-4">Select a File</h2>

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

          {/* Analyze Button */}
          {!loading && file && (
            <button
              onClick={handleAnalyze}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-accent-teal to-accent-cyan text-bg-dark font-semibold shadow-glow-cyan"
            >
              Analyze Book
            </button>
          )}

          {/* Loading */}
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
            <strong>Supported formats:</strong> PDF, TXT • Max 10 MB
          </div>
        </div>
      </div>

      {/* --------------------------
          PREVIEW SECTION
      --------------------------- */}
      {file && (
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="text-2xl font-semibold text-accent-cyan mb-4">
            Preview
          </h2>

          {/* PDF PREVIEW */}
          {previewURL && (
            <div className="w-full h-[70vh] bg-[#0d1a26] rounded-xl overflow-hidden shadow-glow-cyan border border-border-card mb-10">
              <iframe
                src={previewURL}
                title="PDF Preview"
                className="w-full h-full"
              ></iframe>
            </div>
          )}

          {/* TXT PREVIEW */}
          {txtPreview && (
            <div className="bg-[#0d1a26] p-6 rounded-xl border border-border-card shadow-glow-cyan">
              <pre className="text-text-muted whitespace-pre-wrap text-sm">
                {txtPreview} {txtPreview.length >= 300 && "..."}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
