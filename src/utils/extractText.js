// src/utils/extractText.js
import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// --------------------------
// OCR WORKER
// --------------------------
let ocrWorker = null;

async function getOCRWorker() {
  if (!ocrWorker) {
    ocrWorker = await createWorker("eng");
  }
  return ocrWorker;
}

// --------------------------
// MAIN EXTRACT FUNCTION
// --------------------------
export default async function extractTextFromFile(file, onProgress = () => {}) {
  const extension = file.name.split(".").pop().toLowerCase();

  // --------------------------
  // TXT FILES
  // --------------------------
  if (extension === "txt") {
    return file.text();
  }

  // --------------------------
  // PDF FILES
  // --------------------------
  if (extension === "pdf") {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let textContent = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((it) => it.str).join(" ");

      textContent += strings + "\n";
      onProgress(Math.round((i / pdf.numPages) * 50)); // 0–50% for normal extraction
    }

    // If text was extracted → return it
    if (textContent.trim().length > 20) {
      return textContent;
    }

    // --------------------------
    // FALLBACK: OCR MODE
    // --------------------------
    console.log("PDF contains no text. Switching to OCR…");

    let ocrText = "";
    const worker = await getOCRWorker();

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement("canvas");

      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      const {
        data: { text },
      } = await worker.recognize(canvas);

      ocrText += text + "\n";

      onProgress(50 + Math.round((i / pdf.numPages) * 50)); // 50–100% for OCR
    }

    return ocrText;
  }

  return "";
}
