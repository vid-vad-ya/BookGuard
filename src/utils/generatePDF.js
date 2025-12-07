// src/utils/generatePDF.js
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { LOGO_DATA_URL } from "../assets/logoDataUrl";


/**
 * generatePDFReport(options)
 * options:
 *   - bookTitle, author, extractedText, results
 *   - elements: { summaryEl, chartsEl, insightsEl } // direct DOM nodes (preferred)
 *   - selectors: { summary, charts, insights } // fallback selectors
 *   - logoDataUrl: optional data:image/... base64 string (if provided, used)
 *
 * This function prefers direct DOM nodes passed via elements.
 */
export default async function generatePDFReport(opts = {}) {
  const {
    bookTitle = "",
    author = "",
    extractedText = "",
    results = {},
    elements = {},
    selectors = {},
    logoDataUrl = null,
  } = opts;

  // Option A: try to use provided base64 data url
  // Option B: try to load path 'src/assets/logo.png' (CRA serves it from same origin when bundled)
  // If neither, fallback to small embedded SVG
  const LOGO_DATA_URL = logoDataUrl || null;

  // small fallback SVG logo as data url (used if no provided logo)
  const smallFallbackSvg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
      <rect rx='28' width='200' height='200' fill='#0ea5a3'/>
      <g transform='translate(40,40)'>
        <rect width='120' height='80' rx='8' fill='#fff' opacity='0.98'/>
        <rect y='14' x='8' width='40' height='6' rx='3' fill='#0ea5a3'/>
        <rect x='8' y='28' width='100' height='8' rx='4' fill='#1c7ed6'/>
        <rect x='8' y='46' width='80' height='8' rx='4' fill='#2563eb'/>
      </g>
    </svg>`
  );
  const FALLBACK_LOGO = `data:image/svg+xml;charset=utf-8,${smallFallbackSvg}`;

  // helper: capture element (accepts Element or selector string). returns dataURL or null
  async function captureElement(elOrSelector, scale = 4) {
    let el = null;
    if (!elOrSelector) return null;
    if (typeof elOrSelector === "string") el = document.querySelector(elOrSelector);
    else if (elOrSelector instanceof Element) el = elOrSelector;
    if (!el) return null;

    // ensure element has white background for capture (makes PDF consistent)
    const origBg = el.style.backgroundColor;
    el.style.backgroundColor = "#ffffff";

    const canvas = await html2canvas(el, {
      scale,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: document.documentElement.clientWidth,
    });

    // restore
    el.style.backgroundColor = origBg || "";

    return canvas.toDataURL("image/png", 0.94);
  }

  // get captures: prefer direct elements
  const summaryImg = await captureElement(elements.summaryEl || selectors.summary);
  const chartsImg = await captureElement(elements.chartsEl || selectors.charts);
  const insightsImg = await captureElement(elements.insightsEl || selectors.insights);

  // attempt to resolve logo source: prefer LOGO_DATA_URL; else try file path; else fallback
  // ---- Logo Source Resolver ----
let logoSrc = LOGO_DATA_URL;

if (!logoSrc) {
  try {
    logoSrc = require("../assets/logo.png");
  } catch (e) {
    console.warn("Logo missing, skipping logo in PDF.");
    logoSrc = null;
  }
}

  if (!logoSrc) logoSrc = FALLBACK_LOGO;

  // filename
  const safeTitle = bookTitle ? bookTitle.replace(/[^a-z0-9_\- ]/gi, "") : "";
  const filename = safeTitle ? `BookGuard_${safeTitle}_Report.pdf` : `BookGuard_Report.pdf`;

  // create jsPDF (A4)
  const doc = new jsPDF({ unit: "pt", format: "a4", putOnlyUsedFonts: true });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentW = pageW - margin * 2;
  const gap = 12;

  // Page 1 white background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, pageH, "FD");

  // draw logo (top-left). Attempt to load image; if fails, continue
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = logoSrc;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve; // resolve even on error to continue
    });
    if (img.width && img.height) {
      const logoW = 72;
      const logoH = (img.height / img.width) * logoW;
      try {
        doc.addImage(img, "PNG", margin, margin / 2, logoW, logoH);
      } catch (e) {
        // if addImage errors (CORS or weird format), ignore and continue
      }
    }
  } catch (e) {
    // ignore
  }

  // title/meta
  doc.setFontSize(18);
  doc.setTextColor(34, 34, 34);
  doc.text("BookGuard AI — Analysis Report", margin + 84, margin + 18); // leave room for logo

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const dateStr = new Date().toLocaleString();
  doc.text(`Generated: ${dateStr}`, margin, margin + 52);
  if (bookTitle) doc.text(`Book: ${bookTitle}`, margin, margin + 68);
  if (author) doc.text(`Author: ${author}`, margin, margin + 84);

  let cursorY = margin + 110;

  // Insert summary capture if available
  if (summaryImg) {
    const img = new Image();
    img.src = summaryImg;
    await new Promise((res) => (img.onload = res));
    const ratio = img.width / img.height;
    const imgW = contentW;
    const imgH = imgW / ratio;
    if (cursorY + imgH > pageH - margin) {
      doc.addPage();
      cursorY = margin;
    }
    doc.addImage(summaryImg, "PNG", margin, cursorY, imgW, imgH);
    cursorY += imgH + gap;
  } else {
    // fallback: print basic metrics
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text("Key Metrics", margin, cursorY);
    cursorY += 18;
    const keys = ["aiScore", "plagiarism", "reliability", "coherence", "grammar", "readability"];
    keys.forEach((k) => {
      const v = results[k] !== undefined ? String(results[k]) : "—";
      doc.setFontSize(11);
      doc.setTextColor(90, 90, 90);
      doc.text(`${k}: ${v}`, margin, cursorY);
      cursorY += 14;
    });
    cursorY += gap;
  }

  // charts capture
  if (chartsImg) {
    const img = new Image();
    img.src = chartsImg;
    await new Promise((res) => (img.onload = res));
    const ratio = img.width / img.height;
    const imgW = contentW;
    const imgH = imgW / ratio;
    if (cursorY + imgH > pageH - margin) {
      doc.addPage();
      cursorY = margin;
    }
    doc.addImage(chartsImg, "PNG", margin, cursorY, imgW, imgH);
    cursorY += imgH + gap;
  }

  // footer small
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Generated by BookGuard AI • Demo report", margin, pageH - 30);

  // Page 2 - Insights
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, pageH, "FD");
  let y = margin;
  doc.setFontSize(16);
  doc.setTextColor(34, 34, 34);
  doc.text("Insights & Recommendations", margin, y);
  y += 24;

  if (insightsImg) {
    const img = new Image();
    img.src = insightsImg;
    await new Promise((res) => (img.onload = res));
    const ratio = img.width / img.height;
    const imgW = contentW;
    const imgH = imgW / ratio;
    if (y + imgH > pageH - margin) {
      doc.addPage();
      y = margin;
    }
    doc.addImage(insightsImg, "PNG", margin, y, imgW, imgH);
    y += imgH + gap;
  } else {
    // text fallback
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    if (results.summary) {
      const split = doc.splitTextToSize(results.summary, contentW);
      doc.text(split, margin, y);
      y += split.length * 12 + gap;
    }
    if (results.insights && results.insights.length) {
      results.insights.forEach((it, idx) => {
        const lines = doc.splitTextToSize(`${idx + 1}. ${it}`, contentW);
        doc.text(lines, margin, y);
        y += lines.length * 12 + 8;
      });
    }
  }

  // excerpt of extracted text
  if (extractedText) {
    const excerpt = extractedText.slice(0, 1200);
    const split = doc.splitTextToSize(excerpt, contentW);
    if (y + split.length * 10 > pageH - margin) {
      doc.addPage();
      y = margin;
    }
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text("Excerpt:", margin, y);
    y += 14;
    doc.setFontSize(9);
    doc.text(split, margin, y);
  }

  doc.save(filename);
}
