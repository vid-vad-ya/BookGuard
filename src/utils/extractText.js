// src/utils/extractText.js
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default async function extractTextFromFile(file) {
  const extension = file.name.split(".").pop().toLowerCase();

  if (extension === "txt") {
    const text = await file.text();
    return text;
  }

  if (extension === "pdf") {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let textContent = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((it) => it.str).join(" ");
      textContent += strings + "\n";
    }

    return textContent;
  }

  return "";
}
