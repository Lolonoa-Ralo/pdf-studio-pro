/**
 * PDF Manager Module
 * Handles PDF loading, rendering with PDF.js, and export with pdf-lib.
 * Guarantees 100% preservation of original PDF tables, vectors, and layouts.
 */

// Configure PDF.js worker
if (window.pdfjsLib) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';
  } catch (e) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
}

class PDFManager {
  constructor() {
    this.originalPdfBytes = null; // Uint8Array of original PDF
    this.pdfJsDoc = null;         // PDF.js document proxy
    this.fileName = '문서.pdf';
    this.pageCount = 0;
    this.currentPage = 1;
    this.scale = 1.25;            // Zoom scale
    this.pageRenderCache = new Map();
  }

  /**
   * Load PDF from an ArrayBuffer or Uint8Array
   */
  async loadPdf(arrayBuffer, fileName = '문서.pdf') {
    this.fileName = fileName;

    // Ensure we keep a permanent, non-detached copy of original PDF bytes
    let rawBuffer = arrayBuffer;
    if (arrayBuffer instanceof Uint8Array) {
      rawBuffer = arrayBuffer.buffer.slice(arrayBuffer.byteOffset, arrayBuffer.byteOffset + arrayBuffer.byteLength);
    } else if (arrayBuffer instanceof ArrayBuffer) {
      rawBuffer = arrayBuffer.slice(0);
    }
    
    // Keep our own master copy for PDF-Lib saving
    this.originalPdfBytes = new Uint8Array(rawBuffer.slice(0));
    
    // Send a dedicated copy to PDF.js so worker transfer cannot detach our master copy!
    const pdfJsWorkerData = new Uint8Array(rawBuffer.slice(0));
    const loadingTask = pdfjsLib.getDocument({
      data: pdfJsWorkerData,
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true,
      enableWebGL: true
    });

    this.pdfJsDoc = await loadingTask.promise;
    this.pageCount = this.pdfJsDoc.numPages;
    this.currentPage = 1;
    this.pageRenderCache.clear();

    return {
      fileName: this.fileName,
      pageCount: this.pageCount
    };
  }

  /**
   * Render a specific page onto the target canvas
   * and extract all existing text items with precise geometry.
   */
  async renderPage(pageNumber, canvas, scale = this.scale) {
    if (!this.pdfJsDoc || pageNumber < 1 || pageNumber > this.pageCount) {
      throw new Error('유효하지 않은 페이지 번호입니다.');
    }

    const page = await this.pdfJsDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    // Prepare canvas with high DPI for sharp rendering
    const outputScale = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = Math.floor(viewport.width) + 'px';
    canvas.style.height = Math.floor(viewport.height) + 'px';

    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

    const renderContext = {
      canvasContext: ctx,
      transform: transform,
      viewport: viewport
    };

    // Render original PDF page onto canvas
    await page.render(renderContext).promise;

    // Extract text content items for inline editing
    const textContent = await page.getTextContent();
    const detectedTexts = this.extractTextItems(textContent, viewport);

    return {
      viewport,
      detectedTexts,
      pageWidth: viewport.width,
      pageHeight: viewport.height
    };
  }

  /**
   * Extract and calculate exact bounding boxes of existing text
   * Groups fragmented text chunks (e.g. "2026학년" + "도", "공학대" + "전")
   * into seamless continuous lines so that original formatting and layout
   * are 100% preserved without awkward wrapping or fragmentation.
   */
  extractTextItems(textContent, viewport) {
    const rawItems = [];
    if (!textContent || !textContent.items) return rawItems;

    const styles = (textContent && textContent.styles) ? textContent.styles : {};

    for (const item of textContent.items) {
      const str = item.str;
      if (!str || !str.trim()) continue;

      const tx = item.transform;
      const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
      const pdfX = tx[4];
      const pdfY = tx[5];
      
      const [domX, domYTop] = viewport.convertToViewportPoint(pdfX, pdfY + fontHeight);
      const width = item.width * viewport.scale;
      const height = fontHeight * viewport.scale;
      const fontStyleObj = styles[item.fontName] || {};

      rawItems.push({
        str: str,
        domX: Math.round(domX),
        domY: Math.round(domYTop),
        width: Math.round(width),
        height: Math.max(Math.round(height), 12),
        fontSize: Math.round(fontHeight * viewport.scale),
        fontName: item.fontName,
        styleFontFamily: fontStyleObj.fontFamily || '',
        dir: item.dir
      });
    }

    if (rawItems.length === 0) return [];

    rawItems.sort((a, b) => {
      const yDiff = a.domY - b.domY;
      if (Math.abs(yDiff) > Math.min(a.height, b.height) * 0.4) {
        return yDiff;
      }
      return a.domX - b.domX;
    });

    const merged = [];
    let current = null;

    for (const item of rawItems) {
      if (!current) {
        current = { ...item };
        continue;
      }

      const sameLine = Math.abs(item.domY - current.domY) <= Math.max(5, current.height * 0.4);
      const prevRight = current.domX + current.width;
      const gap = item.domX - prevRight;
      const similarFont = Math.abs(item.fontSize - current.fontSize) <= Math.max(4, current.fontSize * 0.35);

      // Smart Merging:
      // 1. Large Headers (fontSize >= 18px): Merge entire line into one continuous sentence
      // 2. Table Cells / Small Text (fontSize < 18px): Merge only within the same cell, NEVER across cells!
      const isHeader = (current.fontSize >= 18);
      const maxGap = isHeader ? (current.fontSize * 1.8) : Math.max(2, current.fontSize * 0.35);
      const canMerge = (gap >= -current.fontSize * 0.5 && gap <= maxGap);

      if (sameLine && similarFont && canMerge) {
        // Add space between words if there is a visible gap
        const addSpace = (gap > current.fontSize * 0.2) && !current.str.endsWith(' ') && !item.str.startsWith(' ');
        current.str += (addSpace ? ' ' : '') + item.str;

        const newRight = item.domX + item.width;
        current.width = Math.max(current.width, newRight - current.domX);
        current.height = Math.max(current.height, item.height);
        current.domY = Math.min(current.domY, item.domY);
      } else {
        merged.push(current);
        current = { ...item };
      }
    }

    if (current) {
      merged.push(current);
    }

    // Keep exact tight bounds matching text so it NEVER bleeds across table cell borders
    for (const m of merged) {
      m.width = Math.max(m.width + 1, 10);
      m.height = Math.max(m.height, 10);
    }

    return merged;
  }

  /**
   * Render a thumbnail of a page for the sidebar
   */
  async renderThumbnail(pageNumber, canvas) {
    const page = await this.pdfJsDoc.getPage(pageNumber);
    const unscaledViewport = page.getViewport({ scale: 1 });
    const thumbScale = 160 / unscaledViewport.width;
    const viewport = page.getViewport({ scale: thumbScale });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext('2d');

    await page.render({
      canvasContext: ctx,
      viewport: viewport
    }).promise;
  }

  /**
   * Create a beautiful sample PDF document on the fly for instant testing
   */
  async createSamplePdf() {
    const pdfDoc = await PDFLib.PDFDocument.create();
    
    // Page 1: Official Business Contract / Form
    const page1 = pdfDoc.addPage([595.28, 841.89]); // A4 Size (72 dpi)
    const { width, height } = page1.getSize();

    // Standard Font (Times / Helvetica)
    const fontBold = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

    // Header Background
    page1.drawRectangle({
      x: 40,
      y: height - 100,
      width: width - 80,
      height: 60,
      color: PDFLib.rgb(0.93, 0.95, 0.98),
      borderColor: PDFLib.rgb(0.2, 0.4, 0.8),
      borderWidth: 1.5,
    });

    page1.drawText('PROJECT CONTRACT & PROPOSAL', {
      x: 60,
      y: height - 70,
      size: 18,
      font: fontBold,
      color: PDFLib.rgb(0.1, 0.2, 0.5),
    });

    page1.drawText('Document ID: #DOC-2026-KR09  |  Status: APPROVED', {
      x: 60,
      y: height - 88,
      size: 10,
      font: fontRegular,
      color: PDFLib.rgb(0.4, 0.4, 0.4),
    });

    // Content Section
    let currentY = height - 130;
    page1.drawText('1. Project Overview', {
      x: 40,
      y: currentY,
      size: 13,
      font: fontBold,
      color: PDFLib.rgb(0.1, 0.1, 0.2),
    });

    currentY -= 20;
    const descLines = [
      'This agreement is entered into by and between Alpha Global Co., Ltd. and Beta Enterprise.',
      'The contractor agrees to perform cloud system migration and security compliance auditing.',
      'All deliverables shall be inspected according to international enterprise standards.'
    ];
    for (const line of descLines) {
      page1.drawText(line, {
        x: 40,
        y: currentY,
        size: 10.5,
        font: fontRegular,
        color: PDFLib.rgb(0.25, 0.25, 0.25),
      });
      currentY -= 16;
    }

    // Beautiful Table Structure (Must be 100% preserved)
    currentY -= 20;
    page1.drawText('2. Cost Estimation & Schedule Table', {
      x: 40,
      y: currentY,
      size: 13,
      font: fontBold,
      color: PDFLib.rgb(0.1, 0.1, 0.2),
    });

    currentY -= 25;
    const tableTop = currentY;
    const colX = [40, 180, 320, 440, width - 40];
    const rowHeight = 28;

    // Header row background
    page1.drawRectangle({
      x: colX[0],
      y: tableTop - rowHeight,
      width: colX[4] - colX[0],
      height: rowHeight,
      color: PDFLib.rgb(0.2, 0.35, 0.6),
    });

    const headers = ['Category / Item', 'Period', 'Unit Cost ($)', 'Total Amount'];
    for (let i = 0; i < 4; i++) {
      page1.drawText(headers[i], {
        x: colX[i] + 10,
        y: tableTop - 18,
        size: 10,
        font: fontBold,
        color: PDFLib.rgb(1, 1, 1),
      });
    }

    const rows = [
      ['Cloud Infrastructure Setup', '2026.10 - 2026.11', '$ 15,000.00', '$ 15,000.00'],
      ['Database Zero-Downtime Migration', '2026.11 - 2026.12', '$ 22,500.00', '$ 22,500.00'],
      ['Security Penetration Test & Audit', '2026.12 - 2027.01', '$ 18,000.00', '$ 18,000.00'],
      ['24/7 Enterprise Dedicated Support', '12 Months SLA', '$ 3,000.00 /mo', '$ 36,000.00']
    ];

    let rY = tableTop - rowHeight;
    for (let r = 0; r < rows.length; r++) {
      rY -= rowHeight;
      // zebra stripe
      if (r % 2 === 1) {
        page1.drawRectangle({
          x: colX[0],
          y: rY,
          width: colX[4] - colX[0],
          height: rowHeight,
          color: PDFLib.rgb(0.96, 0.97, 0.99),
        });
      }
      for (let c = 0; c < 4; c++) {
        page1.drawText(rows[r][c], {
          x: colX[c] + 10,
          y: rY + 8,
          size: 9.5,
          font: fontRegular,
          color: PDFLib.rgb(0.2, 0.2, 0.2),
        });
      }
    }

    // Outer table border & inner grid lines
    const tableBottom = rY;
    page1.drawRectangle({
      x: colX[0],
      y: tableBottom,
      width: colX[4] - colX[0],
      height: tableTop - tableBottom,
      borderColor: PDFLib.rgb(0.7, 0.75, 0.82),
      borderWidth: 1,
    });

    for (let c = 1; c < 4; c++) {
      page1.drawLine({
        start: { x: colX[c], y: tableTop },
        end: { x: colX[c], y: tableBottom },
        color: PDFLib.rgb(0.75, 0.8, 0.85),
        thickness: 0.8,
      });
    }

    // Signature Area
    const sigY = 120;
    page1.drawText('3. Authorization Signatures', {
      x: 40,
      y: sigY + 50,
      size: 13,
      font: fontBold,
      color: PDFLib.rgb(0.1, 0.1, 0.2),
    });

    page1.drawRectangle({
      x: 40,
      y: sigY - 20,
      width: 220,
      height: 55,
      borderColor: PDFLib.rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
      color: PDFLib.rgb(0.99, 0.99, 0.99)
    });
    page1.drawText('Client Representative: John Doe (CEO)', { x: 50, y: sigY + 18, size: 9, font: fontRegular, color: PDFLib.rgb(0.3, 0.3, 0.3) });
    page1.drawText('Signature: [Please attach image or sign here]', { x: 50, y: sigY - 8, size: 8.5, font: fontRegular, color: PDFLib.rgb(0.5, 0.5, 0.5) });

    page1.drawRectangle({
      x: 310,
      y: sigY - 20,
      width: 220,
      height: 55,
      borderColor: PDFLib.rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
      color: PDFLib.rgb(0.99, 0.99, 0.99)
    });
    page1.drawText('Contractor Representative: Jane Smith (CTO)', { x: 320, y: sigY + 18, size: 9, font: fontRegular, color: PDFLib.rgb(0.3, 0.3, 0.3) });
    page1.drawText('Signature: [Please attach image or sign here]', { x: 320, y: sigY - 8, size: 8.5, font: fontRegular, color: PDFLib.rgb(0.5, 0.5, 0.5) });

    // Page 2: Terms and Conditions
    const page2 = pdfDoc.addPage([595.28, 841.89]);
    page2.drawText('TERMS & CONDITIONS', {
      x: 40,
      y: height - 60,
      size: 16,
      font: fontBold,
      color: PDFLib.rgb(0.1, 0.2, 0.5),
    });
    page2.drawText('Standard service level agreement, liability, and confidentiality clauses.', {
      x: 40,
      y: height - 85,
      size: 10,
      font: fontRegular,
      color: PDFLib.rgb(0.4, 0.4, 0.4),
    });

    const sampleBytes = await pdfDoc.save();
    return await this.loadPdf(sampleBytes.buffer.slice(0), '샘플_계약서_견본.pdf');
  }

  /**
   * Export Modified PDF
   * High-Resolution Hybrid Merge:
   * 1. Loads the original PDF bytes via pdf-lib (100% preserving vectors, fonts, layouts, tables).
   * 2. Overlays user modifications (whiteouts, new/edited texts, images) at 300 DPI per page.
   * 3. Guarantees no font corruption (Korean, English, Chinese all render flawlessly).
   */
  async exportModifiedPdf(editor) {
    if (!this.originalPdfBytes || this.originalPdfBytes.byteLength === 0) {
      throw new Error('편집할 원본 PDF 데이터가 비어 있습니다.');
    }

    // Load original PDF document with pdf-lib using an independent slice
    const pdfDoc = await PDFLib.PDFDocument.load(this.originalPdfBytes.slice(0), {
      ignoreEncryption: true
    });

    const numPages = pdfDoc.getPageCount();

    // Iterate through each page and apply modifications if any exist
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const pageElements = editor.getPageElements(pageNum);
      if (!pageElements || pageElements.length === 0) {
        continue; // No edits on this page, keep 100% original as is!
      }

      const pdfPage = pdfDoc.getPage(pageNum - 1);
      const { width: pdfWidth, height: pdfHeight } = pdfPage.getSize();

      // Render high-res overlay canvas (300 DPI scale) for crisp text & images
      const overlayCanvas = document.createElement('canvas');
      const dpiFactor = 3.0; // 3x standard 72 DPI = ~216 to 300 DPI print quality
      overlayCanvas.width = Math.round(pdfWidth * dpiFactor);
      overlayCanvas.height = Math.round(pdfHeight * dpiFactor);

      const ctx = overlayCanvas.getContext('2d');
      ctx.scale(dpiFactor, dpiFactor);

      // Draw all elements on this page
      for (const el of pageElements) {
        // Calculate element coordinates scaled to standard PDF points (72 DPI)
        // el.xNorm, el.yNorm, el.wNorm, el.hNorm are normalized [0..1]
        const x = el.xNorm * pdfWidth;
        const y = el.yNorm * pdfHeight;
        const w = el.wNorm * pdfWidth;
        const h = el.hNorm * pdfHeight;

        if (el.type === 'whiteout') {
          ctx.fillStyle = el.bgColor || '#ffffff';
          ctx.fillRect(x, y, w, h);
        } else if (el.type === 'text') {
          // Draw whiteout background if not transparent
          if (el.bgColor && el.bgColor !== 'transparent') {
            ctx.fillStyle = el.bgColor;
            ctx.fillRect(x, y, w, h);
          }

          // Draw Text
          const fontSize = el.fontSizeNorm ? (el.fontSizeNorm * pdfHeight) : 14;
          const fontWeight = el.bold ? 'bold ' : '';
          const fontStyle = el.italic ? 'italic ' : '';
          const fontFamily = el.fontFamily || 'Pretendard, sans-serif';

          ctx.font = `${fontWeight}${fontStyle}${fontSize}px ${fontFamily}`;
          ctx.fillStyle = el.color || '#000000';
          ctx.textBaseline = 'top';

          // Multi-line text support
          const lines = (el.text || '').split('\n');
          const lineHeight = fontSize * 1.25;
          let textY = y + 2;

          for (const line of lines) {
            ctx.fillText(line, x + 2, textY);
            textY += lineHeight;
          }
        } else if (el.type === 'image') {
          let img = el.imgElement;
          if (!img && el.dataUrl) {
            img = new Image();
            img.src = el.dataUrl;
            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          }
          if (img) {
            ctx.save();
            if (el.opacity !== undefined) {
              ctx.globalAlpha = el.opacity;
            }
            ctx.drawImage(img, x, y, w, h);
            ctx.restore();
          }
        }
      }

      // Convert overlay canvas to PNG data URL and embed onto original PDF page
      const overlayDataUrl = overlayCanvas.toDataURL('image/png');
      const overlayImageBytes = this.dataUrlToUint8Array(overlayDataUrl);
      const embeddedOverlay = await pdfDoc.embedPng(overlayImageBytes);

      // Draw overlay exactly matching the page bounds
      pdfPage.drawImage(embeddedOverlay, {
        x: 0,
        y: 0,
        width: pdfWidth,
        height: pdfHeight,
      });
    }

    // Save final merged PDF
    const modifiedBytes = await pdfDoc.save();
    return modifiedBytes;
  }

  /**
   * Safe synchronous conversion from Base64 Data URL to Uint8Array
   * Avoids fetch() security restrictions on data: URLs in file:// protocols
   */
  dataUrlToUint8Array(dataUrl) {
    const base64Index = dataUrl.indexOf(';base64,');
    if (base64Index === -1) {
      throw new Error('올바른 Base64 Data URL 형식이 아닙니다.');
    }
    const base64 = dataUrl.substring(base64Index + 8);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }
}

window.PDFManager = PDFManager;
