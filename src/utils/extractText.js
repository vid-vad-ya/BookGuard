import * as pdfjsLib from "pdfjs-dist/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export async function extractPDF(file, onProgress) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str).join(" ");
      text += strings + "\n";

      if (onProgress) {
        onProgress(Math.round((pageNum / pdf.numPages) * 100));
      }
    }

    return text.trim();
  } catch (err) {
    console.error("PDF extraction error:", err);
    throw new Error("PDF parsing failed.");
  }
}

export async function extractTXT(file) {
  return (await file.text()).trim();
}
