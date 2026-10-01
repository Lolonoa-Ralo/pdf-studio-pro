/**
 * PDF Visual Editor Module
 * Manages interactive layers, text modification, image insertion,
 * whiteouts, drag & drop, resizing, undo/redo history.
 */

class PDFEditor {
  constructor(app) {
    this.app = app;
    this.mode = 'select'; // 'select' | 'edit-text' | 'add-text' | 'add-image' | 'whiteout'
    this.elementsByPage = new Map(); // pageNumber -> Array of element objects
    this.selectedElement = null;
    this.currentPage = 1;
    this.pageWidth = 0;  // in current DOM pixels
    this.pageHeight = 0; // in current DOM pixels

    // History for Undo / Redo
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 30;

    // Drag / Resize state
    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = null;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.initialElemBounds = null;

    this.bindEvents();
  }

  setMode(newMode) {
    this.mode = newMode;
    const container = document.getElementById('pageContainer');
    if (container) {
      container.classList.remove('mode-select', 'mode-edit', 'mode-add-text', 'mode-whiteout');
      if (newMode === 'edit-text') container.classList.add('mode-edit');
      else if (newMode === 'select') container.classList.add('mode-select');
      else if (newMode === 'add-text') container.classList.add('mode-add-text');
      else if (newMode === 'whiteout') container.classList.add('mode-whiteout');
    }
  }

  getPageElements(pageNum) {
    if (!this.elementsByPage.has(pageNum)) {
      this.elementsByPage.set(pageNum, []);
    }
    return this.elementsByPage.get(pageNum);
  }

  saveHistorySnapshot() {
    // Deep clone the current elements map
    const snapshot = new Map();
    for (const [page, list] of this.elementsByPage.entries()) {
      const clonedList = list.map(item => ({ ...item }));
      snapshot.set(page, clonedList);
    }
    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = []; // clear redo on new action
    this.app.updateUndoRedoUI();
  }

  undo() {
    if (this.undoStack.length === 0) return;
    // Save current to redo
    const currentSnapshot = new Map();
    for (const [page, list] of this.elementsByPage.entries()) {
      currentSnapshot.set(page, list.map(item => ({ ...item })));
    }
    this.redoStack.push(currentSnapshot);

    const prevSnapshot = this.undoStack.pop();
    this.elementsByPage = prevSnapshot;
    this.deselect();
    this.renderCurrentPageElements();
    this.app.updateUndoRedoUI();
    this.app.showToast(window.i18n ? window.i18n.t('toastUndo') : 'Action undone.', 'info');
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const currentSnapshot = new Map();
    for (const [page, list] of this.elementsByPage.entries()) {
      currentSnapshot.set(page, list.map(item => ({ ...item })));
    }
    this.undoStack.push(currentSnapshot);

    const nextSnapshot = this.redoStack.pop();
    this.elementsByPage = nextSnapshot;
    this.deselect();
    this.renderCurrentPageElements();
    this.app.updateUndoRedoUI();
    this.app.showToast(window.i18n ? window.i18n.t('toastRedo') : 'Action redone.', 'info');
  }

  /**
   * Reset editor state when a new PDF is loaded
   */
  reset() {
    this.elementsByPage.clear();
    this.selectedElement = null;
    this.undoStack = [];
    this.redoStack = [];
    this.app.updateUndoRedoUI();
  }

  /**
   * Reset all edits on current page back to 100% pristine original PDF
   */
  resetCurrentPage() {
    this.saveHistorySnapshot();
    this.elementsByPage.set(this.currentPage, []);
    this.deselect();
    this.renderCurrentPageElements();
    this.app.renderCurrentPage();
    this.app.showToast(window.i18n ? window.i18n.t('toastResetPage') : 'Current page restored to original.', 'success');
  }

  /**
   * Setup interactive page container and layers for the rendered page
   */
  setupPage(pageNumber, pageWidth, pageHeight, detectedTexts) {
    this.currentPage = pageNumber;
    this.pageWidth = pageWidth;
    this.pageHeight = pageHeight;

    const wrapper = document.getElementById('pageContainerWrapper');
    wrapper.innerHTML = '';

    // Page Container
    const container = document.createElement('div');
    container.id = 'pageContainer';
    container.className = 'page-container';
    container.style.width = pageWidth + 'px';
    container.style.height = pageHeight + 'px';
    if (this.mode === 'edit-text') container.classList.add('mode-edit');
    else if (this.mode === 'select') container.classList.add('mode-select');
    else if (this.mode === 'add-text') container.classList.add('mode-add-text');
    else if (this.mode === 'whiteout') container.classList.add('mode-whiteout');

    // Canvas for PDF rendering
    const pdfCanvas = document.createElement('canvas');
    pdfCanvas.id = 'pdfCanvas';
    pdfCanvas.className = 'pdf-render-canvas';
    container.appendChild(pdfCanvas);

    // Text detection layer (for original text inline editing)
    const textLayer = document.createElement('div');
    textLayer.id = 'textDetectionLayer';
    textLayer.className = 'text-detection-layer';
    this.setupDetectedTexts(textLayer, detectedTexts);
    container.appendChild(textLayer);

    // Elements layer (for whiteouts, edits, new texts, images)
    const elementsLayer = document.createElement('div');
    elementsLayer.id = 'elementsLayer';
    elementsLayer.className = 'elements-layer';
    container.appendChild(elementsLayer);

    wrapper.appendChild(container);
    wrapper.style.display = 'block';

    // Click on page background to add text/whiteout or deselect
    elementsLayer.addEventListener('mousedown', (e) => {
      if (e.target === elementsLayer) {
        if (this.mode === 'add-text') {
          const rect = elementsLayer.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;
          this.addNewText(clickX, clickY);
        } else if (this.mode === 'whiteout') {
          const rect = elementsLayer.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;
          this.addWhiteout(clickX, clickY);
        } else {
          this.deselect();
        }
      }
    });

    // Render any existing modifications on this page
    this.renderCurrentPageElements();

    return pdfCanvas;
  }

  /**
   * Populate detected text boxes for 1-click in-place editing
   */
  /**
   * Detect font family and weight matching the original PDF text
   */
  detectFontProperties(fontName, styleFontFamily, fontSize, text) {
    const fn = ((fontName || '') + ' ' + (styleFontFamily || '')).toLowerCase();
    
    // Check if original is Serif (Batang / Myeongjo / Times / Mincho)
    const isSerif = fn.includes('batang') || fn.includes('myeongjo') || fn.includes('myungjo') || 
                    fn.includes('serif') || fn.includes('times') || fn.includes('roman') || 
                    fn.includes('mincho') || fn.includes('song') || fn.includes('바탕') || fn.includes('명조');

    // Check if original is Sans-serif (Gothic / Dotum / Arial / Pretendard / Malgun)
    const isSans = fn.includes('gothic') || fn.includes('dotum') || fn.includes('sans') || 
                   fn.includes('arial') || fn.includes('helvetica') || fn.includes('pretendard') ||
                   fn.includes('malgun') || fn.includes('고딕') || fn.includes('돋움');

    let fontFamily;
    let isBold = fn.includes('bold') || fn.includes('black') || fn.includes('heavy') || 
                 fn.includes('w7') || fn.includes('w8') || fn.includes('w9') || (fontSize >= 18);

    if (isSerif && !isSans) {
      fontFamily = "'Nanum Myeongjo', 'Batang', serif";
    } else if (isSans && !isSerif) {
      fontFamily = "Pretendard, 'Noto Sans KR', sans-serif";
    } else {
      // If neither is explicitly declared in PDF font styles:
      if (fontSize >= 18) {
        // Large document titles are predominantly Nanum Myeongjo Bold
        fontFamily = "'Nanum Myeongjo', 'Batang', serif";
        isBold = true;
      } else {
        // Normal text, table cells, form labels and input fields (e.g. "사이버보안전공")
        // Standard Korean documents predominantly use Gothic/Sans-serif
        fontFamily = "Pretendard, 'Noto Sans KR', sans-serif";
      }
    }

    return { fontFamily, isBold };
  }

  /**
   * Captures the high-resolution pixel snippet of the original PDF text
   * directly from the rendered canvas. Guarantees 100.000% visual preservation of
   * the original font, glyph shapes, and weights without any font distortion!
   */
  captureOriginalSnippet(domX, domY, width, height) {
    const canvas = document.getElementById('pdfCanvas');
    if (!canvas) return null;

    const scaleX = canvas.width / this.pageWidth;
    const scaleY = canvas.height / this.pageHeight;

    // Zero-collision tight crop strictly matching text boundaries
    const sx = Math.max(0, Math.round(domX * scaleX));
    const sy = Math.max(0, Math.round(domY * scaleY));
    const sw = Math.min(canvas.width - sx, Math.round(width * scaleX));
    const sh = Math.min(canvas.height - sy, Math.round(height * scaleY));

    if (sw <= 0 || sh <= 0) return null;

    const snippetCanvas = document.createElement('canvas');
    snippetCanvas.width = sw;
    snippetCanvas.height = sh;
    const sCtx = snippetCanvas.getContext('2d');
    sCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);

    return snippetCanvas.toDataURL('image/png');
  }

  setupDetectedTexts(layer, detectedTexts) {
    layer.innerHTML = '';
    if (!detectedTexts) return;

    for (const item of detectedTexts) {
      if (item.isConverted) continue; // Skip already converted items

      const fontProps = this.detectFontProperties(item.fontName, item.styleFontFamily, item.fontSize, item.str);
      const box = document.createElement('div');
      box.className = 'detected-text-box';
      box.style.left = item.domX + 'px';
      box.style.top = item.domY + 'px';
      box.style.width = (item.width + 4) + 'px';
      box.style.height = (item.height + 2) + 'px';
      box.title = `"${item.str}" (클릭: 선택 / 더블클릭: 원본 글꼴로 수정)`;

      let startX = 0;
      let startY = 0;
      let isMouseDown = false;

      // Mouse down: prepare for click selection or drag move
      box.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only primary mouse button
        startX = e.clientX;
        startY = e.clientY;
        isMouseDown = true;

        const onMouseMove = (moveEvent) => {
          if (!isMouseDown) return;
          const dist = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
          if (dist > 4) {
            // Drag started! Transform to movable element and start dragging
            isMouseDown = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            const movable = this.convertOriginalTextToEditable(item, box, true);
            if (movable) {
              this.startDragging(moveEvent, movable);
            }
          }
        };

        const onMouseUp = () => {
          isMouseDown = false;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      // Click: Select WITHOUT altering original font pixels!
      box.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.mode === 'edit-text') {
          // In Edit Mode: Open editable box directly with exact matching font
          this.convertOriginalTextToEditable(item, box);
        } else {
          // In Select Mode: Select cleanly without modifying or masking original canvas!
          this.selectDetectedText(item, box, fontProps);
        }
      });

      // Double-click: Directly open editable box in exact matching font
      box.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        this.convertOriginalTextToEditable(item, box);
      });

      layer.appendChild(box);
    }
  }

  /**
   * Select detected text cleanly without altering or masking the original canvas.
   * Original font, glyphs, and styling remain 100% intact!
   */
  selectDetectedText(item, box, fontProps) {
    this.deselect();
    this.selectedDetectedItem = item;
    this.selectedDetectedBox = box;
    box.classList.add('selected');

    // Show properties in inspector panel
    this.app.updateInspectorForDetectedText(item, fontProps);
  }

  /**
   * Transform original PDF text into an editable element with matching font
   * In [기존 텍스트 수정] or inline editing: Uses matching Nanum Myeongjo or Pretendard font
   */
  convertOriginalTextToEditable(textItem, domBox, isDrag = false) {
    if (textItem.isConverted) return null;
    textItem.isConverted = true;

    if (domBox) {
      domBox.style.display = 'none'; // Hide detection trigger
    }

    if (this.selectedDetectedBox === domBox) {
      this.selectedDetectedBox = null;
      this.selectedDetectedItem = null;
    }

    this.saveHistorySnapshot();

    // 1. Leave clean whiteout mask at original position
    const fs = textItem.fontSize || 14;
    const isHeader = (fs >= 18);

    // Padding calculations strictly covering ascenders, accents, quotes, and descenders:
    // Top padding: Ascenders, uppercase, quotes, apostrophes (3~6px)
    const padTop = isHeader ? 6 : Math.max(3, Math.round(fs * 0.2));

    // Bottom padding: Descenders (g, p, y, q, j, commas, periods) which extend 0.25~0.35x fs below baseline (5~10px)
    const padBottom = isHeader ? 10 : Math.max(5, Math.round(fs * 0.35));

    // Side padding: Italic slants, serif overhangs, font bounds tolerances (2~4px)
    const padSide = isHeader ? 4 : Math.max(2, Math.round(fs * 0.15));

    const maskElem = {
      id: 'mask_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      type: 'whiteout',
      xNorm: Math.max(0, textItem.domX - padSide) / this.pageWidth,
      yNorm: Math.max(0, textItem.domY - padTop) / this.pageHeight,
      wNorm: (textItem.width + (padSide * 2)) / this.pageWidth,
      hNorm: (textItem.height + padTop + padBottom) / this.pageHeight,
      bgColor: '#ffffff',
      isOriginMask: true
    };

    const { fontFamily, isBold } = this.detectFontProperties(
      textItem.fontName, 
      textItem.styleFontFamily, 
      textItem.fontSize, 
      textItem.str
    );

    const extraWidth = Math.max(16, Math.round((textItem.fontSize || 14) * 0.8));

    const movableElem = {
      id: 'elem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      type: 'text',
      text: textItem.str,
      xNorm: textItem.domX / this.pageWidth,
      yNorm: textItem.domY / this.pageHeight,
      wNorm: (textItem.width + extraWidth) / this.pageWidth,
      hNorm: Math.max(textItem.height, 14) / this.pageHeight,
      fontSizeNorm: (textItem.fontSize) / this.pageHeight,
      fontFamily: fontFamily,
      color: '#000000',
      bgColor: 'transparent',
      bold: isBold,
      italic: false,
      maskId: maskElem.id
    };

    const elements = this.getPageElements(this.currentPage);
    elements.push(maskElem);
    elements.push(movableElem);
    this.renderCurrentPageElements();

    // Select the movable element immediately
    this.selectElement(movableElem.id);

    if (!isDrag) {
      const domElem = document.getElementById(movableElem.id);
      if (domElem) {
        const editor = domElem.querySelector('.mod-text-editor');
        if (editor) {
          editor.focus();
          // Select all text for immediate replacement on typing
          try {
            const range = document.createRange();
            range.selectNodeContents(editor);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          } catch (e) {
            // Ignore selection range errors
          }
        }
      }
      this.app.showToast(window.i18n ? window.i18n.t('toastTextEditOpened') : 'Text editor opened. Start typing!', 'success');
    }

    return movableElem;
  }

  /**
   * Add a brand new text box
   */
  addNewText(x, y, initialText = (window.i18n && window.i18n.getLang() === 'ko' ? '새 텍스트' : 'New Text')) {
    this.saveHistorySnapshot();

    const defaultWidth = 140;
    const defaultHeight = 28;
    const defaultFontSize = 15;

    const elem = {
      id: 'elem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      type: 'text',
      text: initialText,
      xNorm: Math.max(0, x) / this.pageWidth,
      yNorm: Math.max(0, y) / this.pageHeight,
      wNorm: defaultWidth / this.pageWidth,
      hNorm: defaultHeight / this.pageHeight,
      fontSizeNorm: defaultFontSize / this.pageHeight,
      fontFamily: 'Pretendard, sans-serif',
      color: '#000000',
      bgColor: 'transparent',
      bold: false,
      italic: false
    };

    const elements = this.getPageElements(this.currentPage);
    elements.push(elem);
    this.renderCurrentPageElements();
    this.selectElement(elem.id);

    // Switch back to select mode for smooth UX
    this.app.setMode('select');
  }

  /**
   * Add a whiteout patch
   */
  addWhiteout(x, y, w = 120, h = 30) {
    this.saveHistorySnapshot();

    const elem = {
      id: 'elem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      type: 'whiteout',
      xNorm: Math.max(0, x) / this.pageWidth,
      yNorm: Math.max(0, y) / this.pageHeight,
      wNorm: w / this.pageWidth,
      hNorm: h / this.pageHeight,
      bgColor: '#ffffff'
    };

    const elements = this.getPageElements(this.currentPage);
    elements.push(elem);
    this.renderCurrentPageElements();
    this.selectElement(elem.id);

    this.app.setMode('select');
    this.app.showToast(window.i18n ? window.i18n.t('toastWhiteoutAdded') : 'Whiteout patch added.', 'info');
  }

  /**
   * Add Image element from data URL or image file
   */
  async addImage(imageFileOrDataUrl) {
    let dataUrl = imageFileOrDataUrl;
    if (imageFileOrDataUrl instanceof File || imageFileOrDataUrl instanceof Blob) {
      dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFileOrDataUrl);
      });
    }

    // Load image object to determine natural proportions
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    this.saveHistorySnapshot();

    // Default sizing: max 200px width, proportional height
    const maxWidth = Math.min(220, this.pageWidth * 0.4);
    const aspect = img.naturalHeight / img.naturalWidth;
    const finalW = maxWidth;
    const finalH = maxWidth * aspect;

    // Place in center of page viewport
    const startX = Math.max(20, (this.pageWidth - finalW) / 2);
    const startY = Math.max(40, (this.pageHeight - finalH) / 2);

    const elem = {
      id: 'elem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      type: 'image',
      dataUrl: dataUrl,
      imgElement: img,
      xNorm: startX / this.pageWidth,
      yNorm: startY / this.pageHeight,
      wNorm: finalW / this.pageWidth,
      hNorm: finalH / this.pageHeight,
      opacity: 1.0
    };

    const elements = this.getPageElements(this.currentPage);
    elements.push(elem);
    this.renderCurrentPageElements();
    this.selectElement(elem.id);
    this.app.setMode('select');
    this.app.showToast(window.i18n ? window.i18n.t('toastImageAdded') : 'Image attached successfully!', 'success');
  }

  /**
   * Render all elements on the active page
   */
  renderCurrentPageElements() {
    const layer = document.getElementById('elementsLayer');
    if (!layer) return;

    layer.innerHTML = '';
    const elements = this.getPageElements(this.currentPage);

    for (const elem of elements) {
      const domElem = this.createDOMElement(elem);
      layer.appendChild(domElem);
    }
  }

  /**
   * Create DOM representation of an element
   */
  createDOMElement(elem) {
    const div = document.createElement('div');
    div.id = elem.id;
    div.className = `mod-item mod-${elem.type}`;
    if (this.selectedElement && this.selectedElement.id === elem.id) {
      div.classList.add('selected');
    }

    // Apply normalized coordinates to current page pixel dimensions
    const pxX = Math.round(elem.xNorm * this.pageWidth);
    const pxY = Math.round(elem.yNorm * this.pageHeight);
    const pxW = Math.round(elem.wNorm * this.pageWidth);
    const pxH = Math.round(elem.hNorm * this.pageHeight);

    div.style.left = pxX + 'px';
    div.style.top = pxY + 'px';
    div.style.width = pxW + 'px';
    div.style.height = pxH + 'px';

    if (elem.type === 'whiteout') {
      div.style.backgroundColor = elem.bgColor || '#ffffff';
      if (elem.isOriginMask) {
        div.style.pointerEvents = 'none'; // Permanently covers original position
      }
    } else if (elem.type === 'text') {
      const fontSize = Math.round((elem.fontSizeNorm || (14 / this.pageHeight)) * this.pageHeight);
      div.style.fontSize = fontSize + 'px';
      div.style.fontFamily = elem.fontFamily || 'Pretendard, sans-serif';
      div.style.color = elem.color || '#000000';
      div.style.backgroundColor = (elem.bgColor && elem.bgColor !== 'transparent') ? elem.bgColor : 'transparent';
      div.style.fontWeight = elem.bold ? 'bold' : 'normal';
      div.style.fontStyle = elem.italic ? 'italic' : 'normal';
      div.style.whiteSpace = 'nowrap';
      div.style.minWidth = 'max-content';
      div.style.overflow = 'visible';

      const editor = document.createElement('div');
      editor.className = 'mod-text-editor';
      editor.contentEditable = 'true';
      editor.spellcheck = false; // Prevent annoying red spellcheck squiggles
      editor.innerText = elem.text || '';
      
      // Sync on text edit
      editor.addEventListener('input', () => {
        elem.text = editor.innerText;
        if (editor.scrollHeight > div.clientHeight) {
          const newH = editor.scrollHeight + 6;
          div.style.height = newH + 'px';
          elem.hNorm = newH / this.pageHeight;
        }
        if (editor.scrollWidth > div.clientWidth) {
          const newW = editor.scrollWidth + 8;
          div.style.width = newW + 'px';
          elem.wNorm = newW / this.pageWidth;
        }
      });

      editor.addEventListener('blur', () => {
        this.saveHistorySnapshot();
      });

      div.appendChild(editor);
    } else if (elem.type === 'image') {
      const img = document.createElement('img');
      img.src = elem.dataUrl;
      if (elem.opacity !== undefined) {
        img.style.opacity = elem.opacity;
      }
      div.appendChild(img);
    }

    // Add resize handles if selected
    if (this.selectedElement && this.selectedElement.id === elem.id) {
      this.attachResizeHandles(div, elem);
    }

    // Element selection and drag start
    div.addEventListener('mousedown', (e) => {
      if (elem.isOriginMask) return;
      if (e.target.classList.contains('resize-handle')) return;
      e.stopPropagation();
      this.selectElement(elem.id);
      this.startDragging(e, elem);
    });

    return div;
  }

  attachResizeHandles(parentDiv, elem) {
    const handles = ['nw', 'ne', 'sw', 'se'];
    for (const h of handles) {
      const handleDiv = document.createElement('div');
      handleDiv.className = `resize-handle ${h}`;
      handleDiv.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        this.startResizing(e, elem, h);
      });
      parentDiv.appendChild(handleDiv);
    }
  }

  selectElement(elemId) {
    const elements = this.getPageElements(this.currentPage);
    const target = elements.find(el => el.id === elemId);
    if (!target) return;

    this.selectedElement = target;
    
    // Highlight in DOM
    const allDoms = document.querySelectorAll('.mod-item');
    allDoms.forEach(d => {
      d.classList.remove('selected');
      const handles = d.querySelectorAll('.resize-handle');
      handles.forEach(h => h.remove());
    });

    const targetDom = document.getElementById(elemId);
    if (targetDom) {
      targetDom.classList.add('selected');
      this.attachResizeHandles(targetDom, target);
    }

    this.app.updateInspector(target);
  }

  deselect() {
    this.selectedElement = null;
    if (this.selectedDetectedBox) {
      this.selectedDetectedBox.classList.remove('selected');
      this.selectedDetectedBox = null;
      this.selectedDetectedItem = null;
    }
    const allDoms = document.querySelectorAll('.mod-item');
    allDoms.forEach(d => {
      d.classList.remove('selected');
      const handles = d.querySelectorAll('.resize-handle');
      handles.forEach(h => h.remove());
    });
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    this.app.updateInspector(null);
  }

  deleteSelected() {
    if (!this.selectedElement) return;
    this.saveHistorySnapshot();

    const elements = this.getPageElements(this.currentPage);
    const idx = elements.findIndex(el => el.id === this.selectedElement.id);
    if (idx !== -1) {
      elements.splice(idx, 1);
    }

    this.deselect();
    this.renderCurrentPageElements();
    this.app.showToast(window.i18n ? window.i18n.t('toastItemDeleted') : 'Selected item deleted.', 'info');
  }

  startDragging(e, elem) {
    if (this.mode !== 'select') return;
    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.initialElemBounds = {
      xNorm: elem.xNorm,
      yNorm: elem.yNorm,
      wNorm: elem.wNorm,
      hNorm: elem.hNorm
    };

    const onMouseMove = (moveEvent) => {
      if (!this.isDragging) return;
      const dx = moveEvent.clientX - this.dragStartX;
      const dy = moveEvent.clientY - this.dragStartY;

      const dxNorm = dx / this.pageWidth;
      const dyNorm = dy / this.pageHeight;

      elem.xNorm = Math.max(0, Math.min(1 - elem.wNorm, this.initialElemBounds.xNorm + dxNorm));
      elem.yNorm = Math.max(0, Math.min(1 - elem.hNorm, this.initialElemBounds.yNorm + dyNorm));

      const dom = document.getElementById(elem.id);
      if (dom) {
        dom.style.left = Math.round(elem.xNorm * this.pageWidth) + 'px';
        dom.style.top = Math.round(elem.yNorm * this.pageHeight) + 'px';
      }
    };

    const onMouseUp = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      this.saveHistorySnapshot();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  startResizing(e, elem, handle) {
    this.isResizing = true;
    this.resizeHandle = handle;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.initialElemBounds = {
      xNorm: elem.xNorm,
      yNorm: elem.yNorm,
      wNorm: elem.wNorm,
      hNorm: elem.hNorm
    };

    const onMouseMove = (moveEvent) => {
      if (!this.isResizing) return;
      const dx = (moveEvent.clientX - this.dragStartX) / this.pageWidth;
      const dy = (moveEvent.clientY - this.dragStartY) / this.pageHeight;

      let { xNorm, yNorm, wNorm, hNorm } = this.initialElemBounds;

      if (handle === 'se') {
        wNorm = Math.max(0.02, wNorm + dx);
        hNorm = Math.max(0.015, hNorm + dy);
      } else if (handle === 'sw') {
        const newW = Math.max(0.02, wNorm - dx);
        xNorm = xNorm + (wNorm - newW);
        wNorm = newW;
        hNorm = Math.max(0.015, hNorm + dy);
      } else if (handle === 'ne') {
        wNorm = Math.max(0.02, wNorm + dx);
        const newH = Math.max(0.015, hNorm - dy);
        yNorm = yNorm + (hNorm - newH);
        hNorm = newH;
      } else if (handle === 'nw') {
        const newW = Math.max(0.02, wNorm - dx);
        const newH = Math.max(0.015, hNorm - dy);
        xNorm = xNorm + (wNorm - newW);
        yNorm = yNorm + (hNorm - newH);
        wNorm = newW;
        hNorm = newH;
      }

      elem.xNorm = Math.max(0, xNorm);
      elem.yNorm = Math.max(0, yNorm);
      elem.wNorm = wNorm;
      elem.hNorm = hNorm;

      const dom = document.getElementById(elem.id);
      if (dom) {
        dom.style.left = Math.round(elem.xNorm * this.pageWidth) + 'px';
        dom.style.top = Math.round(elem.yNorm * this.pageHeight) + 'px';
        dom.style.width = Math.round(elem.wNorm * this.pageWidth) + 'px';
        dom.style.height = Math.round(elem.hNorm * this.pageHeight) + 'px';
      }
    };

    const onMouseUp = () => {
      this.isResizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      this.saveHistorySnapshot();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  bindEvents() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Don't intercept if user is typing in a contenteditable or input
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      const isInput = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || (document.activeElement && document.activeElement.isContentEditable);

      if (e.key === 'Escape') {
        this.deselect();
        return;
      }

      if (e.key === 'Delete' && !isInput) {
        this.deleteSelected();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (!isInput) {
          e.preventDefault();
          this.undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (!isInput) {
          e.preventDefault();
          this.redo();
        }
      }
    });

    // Clipboard Paste (Ctrl+V) Image Support
    window.addEventListener('paste', (e) => {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          this.addImage(file);
          break;
        }
      }
    });
  }
}

window.PDFEditor = PDFEditor;
