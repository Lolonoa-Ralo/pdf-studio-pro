/**
 * Main Application Controller
 * Coordinates UI, i18n, Theme Manager, PDF Manager, and Visual Editor.
 */

document.addEventListener('DOMContentLoaded', () => {
  const app = new PDFApp();
  window.app = app;
});

class PDFApp {
  constructor() {
    this.pdfManager = new PDFManager();
    this.editor = new PDFEditor(this);

    this.currentScale = 1.35; // Default scale for crisp view
    this.initDOMElements();
    this.initTheme();
    this.initLang();
    this.bindUIEvents();
  }

  initDOMElements() {
    // Utility & Modal Controls
    this.langToggleBtn = document.getElementById('langToggleBtn');
    this.currentLangLabel = document.getElementById('currentLangLabel');
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.themeIcon = document.getElementById('themeIcon');

    // Buttons
    this.fileInput = document.getElementById('fileInput');
    this.imageInput = document.getElementById('imageInput');
    this.openPdfBtn = document.getElementById('openPdfBtn');
    this.samplePdfBtn = document.getElementById('samplePdfBtn');
    this.emptyOpenBtn = document.getElementById('emptyOpenBtn');
    this.emptySampleBtn = document.getElementById('emptySampleBtn');
    this.downloadPdfBtn = document.getElementById('downloadPdfBtn');
    this.resetEditsBtn = document.getElementById('resetEditsBtn');

    // Page Navigation
    this.navControls = document.getElementById('navControls');
    this.prevPageBtn = document.getElementById('prevPageBtn');
    this.nextPageBtn = document.getElementById('nextPageBtn');
    this.pageNumberInput = document.getElementById('pageNumberInput');
    this.pageCountText = document.getElementById('pageCountText');

    // Zoom
    this.zoomOutBtn = document.getElementById('zoomOutBtn');
    this.zoomInBtn = document.getElementById('zoomInBtn');
    this.zoomFitBtn = document.getElementById('zoomFitBtn');
    this.zoomLevelText = document.getElementById('zoomLevelText');

    // Tool Ribbon
    this.toolRibbon = document.getElementById('toolRibbon');
    this.toolTabs = document.querySelectorAll('.tool-tab');
    this.undoBtn = document.getElementById('undoBtn');
    this.redoBtn = document.getElementById('redoBtn');
    this.deleteBtn = document.getElementById('deleteBtn');

    // Layout
    this.sidebar = document.getElementById('sidebar');
    this.thumbnailList = document.getElementById('thumbnailList');
    this.toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
    this.canvasViewport = document.getElementById('canvasViewport');
    this.emptyState = document.getElementById('emptyState');
    this.pageContainerWrapper = document.getElementById('pageContainerWrapper');
    this.fileInfoBadge = document.getElementById('fileInfoBadge');

    // Inspector
    this.inspector = document.getElementById('inspector');
    this.inspectorTitle = document.getElementById('inspectorTitle');
    this.textProps = document.getElementById('textProps');
    this.imageProps = document.getElementById('imageProps');
    this.whiteoutProps = document.getElementById('whiteoutProps');
    this.commonProps = document.getElementById('commonProps');
    this.docInfoProps = document.getElementById('docInfoProps');

    // Inspector Inputs
    this.propFontFamily = document.getElementById('propFontFamily');
    this.propFontSize = document.getElementById('propFontSize');
    this.propColor = document.getElementById('propColor');
    this.propBoldBtn = document.getElementById('propBoldBtn');
    this.propItalicBtn = document.getElementById('propItalicBtn');
    this.propBgColor = document.getElementById('propBgColor');
    this.propBgTransparent = document.getElementById('propBgTransparent');
    this.propOpacity = document.getElementById('propOpacity');
    this.propOpacityVal = document.getElementById('propOpacityVal');
    this.propBringForward = document.getElementById('propBringForward');
    this.propSendBackward = document.getElementById('propSendBackward');
    this.propWhiteoutColor = document.getElementById('propWhiteoutColor');
    this.propDeleteBtn = document.getElementById('propDeleteBtn');

    // Toast & Overlay
    this.toastContainer = document.getElementById('toastContainer');
    this.loadingOverlay = document.getElementById('loadingOverlay');
    this.loadingText = document.getElementById('loadingText');
  }

  // --- Theme Management ---
  initTheme() {
    const savedTheme = localStorage.getItem('pdf_studio_theme') || 'dark';
    this.setTheme(savedTheme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pdf_studio_theme', theme);
    if (this.themeIcon) {
      this.themeIcon.innerText = theme === 'dark' ? '☀️' : '🌙';
    }
    if (this.themeToggleBtn) {
      this.themeToggleBtn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  // --- Language Management ---
  initLang() {
    if (window.i18n) {
      window.i18n.applyTranslations();
      this.updateLangUI(window.i18n.getLang());
    }

    window.addEventListener('i18n:changed', (e) => {
      this.updateLangUI(e.detail.lang);
    });
  }

  updateLangUI(lang) {
    if (this.currentLangLabel) {
      // Button shows the OTHER language to switch to
      this.currentLangLabel.innerText = lang === 'en' ? 'KO' : 'EN';
    }
    if (this.langToggleBtn) {
      this.langToggleBtn.title = lang === 'en' ? '한국어로 변경 (KO)' : 'Switch to English (EN)';
    }

    // Refresh file badge text if empty
    if (!this.pdfManager.fileName && this.fileInfoBadge) {
      this.fileInfoBadge.innerHTML = `<span>${window.i18n.t('noFileLoaded')}</span>`;
    }

    // Refresh thumbnails page labels
    const labels = document.querySelectorAll('.thumbnail-label');
    labels.forEach((lbl, idx) => {
      lbl.innerText = window.i18n.t('pageLabel', { n: idx + 1 });
    });

    // Refresh inspector titles
    if (this.editor.selectedElement) {
      this.updateInspector(this.editor.selectedElement);
    } else if (this.editor.selectedDetectedItem) {
      this.updateInspectorForDetectedText(this.editor.selectedDetectedItem, {
        fontFamily: this.propFontFamily.value,
        isBold: this.propBoldBtn.classList.contains('active')
      });
    } else {
      this.updateInspector(null);
    }
  }


  bindUIEvents() {
    // Language & Theme Toggle
    if (this.langToggleBtn) {
      this.langToggleBtn.addEventListener('click', () => {
        window.i18n.toggleLang();
      });
    }

    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => {
        this.toggleTheme();
      });
    }


    // Open File Handlers
    this.openPdfBtn.addEventListener('click', () => this.fileInput.click());
    this.emptyOpenBtn.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.loadFile(e.target.files[0]);
      }
    });

    // Sample PDF
    this.samplePdfBtn.addEventListener('click', () => this.loadSamplePdf());
    this.emptySampleBtn.addEventListener('click', () => this.loadSamplePdf());

    // Click outside or on blank spaces to deselect completely
    this.canvasViewport.addEventListener('mousedown', (e) => {
      const isMovableItem = e.target.closest('.mod-item');
      const isDetectionBox = e.target.closest('.detected-text-box');
      if (!isMovableItem && !isDetectionBox) {
        this.editor.deselect();
      }
    });

    // Drag & Drop onto Viewport
    this.canvasViewport.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.emptyState.classList.add('dragover');
    });

    this.canvasViewport.addEventListener('dragleave', (e) => {
      e.preventDefault();
      this.emptyState.classList.remove('dragover');
    });

    this.canvasViewport.addEventListener('drop', (e) => {
      e.preventDefault();
      this.emptyState.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          this.loadFile(file);
        } else if (file.type.startsWith('image/')) {
          this.editor.addImage(file);
        }
      }
    });

    // Page Navigation
    this.prevPageBtn.addEventListener('click', () => this.goToPage(this.pdfManager.currentPage - 1));
    this.nextPageBtn.addEventListener('click', () => this.goToPage(this.pdfManager.currentPage + 1));
    this.pageNumberInput.addEventListener('change', (e) => {
      const p = parseInt(e.target.value, 10);
      if (!isNaN(p)) this.goToPage(p);
    });

    // Zoom Controls
    this.zoomInBtn.addEventListener('click', () => this.setZoom(this.currentScale + 0.15));
    this.zoomOutBtn.addEventListener('click', () => this.setZoom(this.currentScale - 0.15));
    this.zoomFitBtn.addEventListener('click', () => this.zoomToFit());

    // Ctrl + Mouse Wheel Zoom
    this.canvasViewport.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.setZoom(this.currentScale + delta);
      }
    }, { passive: false });

    // Mode Switching
    this.toolTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.mode;
        if (mode === 'add-image') {
          this.imageInput.click();
        } else {
          this.setMode(mode);
        }
      });
    });

    this.imageInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.editor.addImage(e.target.files[0]);
        this.imageInput.value = ''; // Reset
      }
    });

    // Toolbar Action Buttons
    this.undoBtn.addEventListener('click', () => this.editor.undo());
    this.redoBtn.addEventListener('click', () => this.editor.redo());
    this.deleteBtn.addEventListener('click', () => this.editor.deleteSelected());
    if (this.resetEditsBtn) {
      this.resetEditsBtn.addEventListener('click', () => this.editor.resetCurrentPage());
    }

    // Sidebar Toggle
    this.toggleSidebarBtn.addEventListener('click', () => {
      this.sidebar.classList.toggle('collapsed');
      setTimeout(() => this.zoomToFit(), 200);
    });

    // Download PDF Button
    this.downloadPdfBtn.addEventListener('click', () => this.downloadModifiedPdf());

    // Bind Inspector Inputs to Selected Element
    this.bindInspectorEvents();
  }

  ensureEditableSelected() {
    if (!this.editor.selectedElement && this.editor.selectedDetectedItem) {
      return this.editor.convertOriginalTextToEditable(
        this.editor.selectedDetectedItem, 
        this.editor.selectedDetectedBox
      );
    }
    return this.editor.selectedElement;
  }

  bindInspectorEvents() {
    this.propFontFamily.addEventListener('change', () => {
      const elem = this.ensureEditableSelected();
      if (elem && elem.type === 'text') {
        this.editor.saveHistorySnapshot();
        elem.fontFamily = this.propFontFamily.value;
        this.editor.renderCurrentPageElements();
      }
    });

    this.propFontSize.addEventListener('input', () => {
      const elem = this.ensureEditableSelected();
      if (elem && elem.type === 'text') {
        const sizePx = parseInt(this.propFontSize.value, 10) || 14;
        elem.fontSizeNorm = sizePx / this.editor.pageHeight;
        this.editor.renderCurrentPageElements();
      }
    });

    this.propFontSize.addEventListener('change', () => {
      this.editor.saveHistorySnapshot();
    });

    this.propColor.addEventListener('input', () => {
      const elem = this.ensureEditableSelected();
      if (elem && elem.type === 'text') {
        elem.color = this.propColor.value;
        this.editor.renderCurrentPageElements();
      }
    });

    this.propColor.addEventListener('change', () => {
      this.editor.saveHistorySnapshot();
    });

    this.propBoldBtn.addEventListener('click', () => {
      const elem = this.ensureEditableSelected();
      if (elem && elem.type === 'text') {
        this.editor.saveHistorySnapshot();
        elem.bold = !elem.bold;
        this.propBoldBtn.classList.toggle('active', elem.bold);
        this.editor.renderCurrentPageElements();
      }
    });

    this.propItalicBtn.addEventListener('click', () => {
      const elem = this.ensureEditableSelected();
      if (elem && elem.type === 'text') {
        this.editor.saveHistorySnapshot();
        elem.italic = !elem.italic;
        this.propItalicBtn.classList.toggle('active', elem.italic);
        this.editor.renderCurrentPageElements();
      }
    });

    this.propBgColor.addEventListener('input', () => {
      const elem = this.ensureEditableSelected();
      if (elem && elem.type === 'text') {
        elem.bgColor = this.propBgColor.value;
        this.propBgTransparent.checked = false;
        this.editor.renderCurrentPageElements();
      }
    });

    this.propBgTransparent.addEventListener('change', () => {
      const elem = this.ensureEditableSelected();
      if (elem && elem.type === 'text') {
        this.editor.saveHistorySnapshot();
        elem.bgColor = this.propBgTransparent.checked ? 'transparent' : this.propBgColor.value;
        this.editor.renderCurrentPageElements();
      }
    });

    this.propOpacity.addEventListener('input', () => {
      if (this.editor.selectedElement && this.editor.selectedElement.type === 'image') {
        const op = parseInt(this.propOpacity.value, 10) / 100;
        this.editor.selectedElement.opacity = op;
        this.propOpacityVal.innerText = this.propOpacity.value + '%';
        this.editor.renderCurrentPageElements();
      }
    });

    this.propOpacity.addEventListener('change', () => {
      this.editor.saveHistorySnapshot();
    });

    this.propWhiteoutColor.addEventListener('input', () => {
      if (this.editor.selectedElement && this.editor.selectedElement.type === 'whiteout') {
        this.editor.selectedElement.bgColor = this.propWhiteoutColor.value;
        this.editor.renderCurrentPageElements();
      }
    });

    this.propWhiteoutColor.addEventListener('change', () => {
      this.editor.saveHistorySnapshot();
    });

    this.propBringForward.addEventListener('click', () => {
      if (!this.editor.selectedElement) return;
      const elements = this.editor.getPageElements(this.editor.currentPage);
      const idx = elements.indexOf(this.editor.selectedElement);
      if (idx !== -1 && idx < elements.length - 1) {
        this.editor.saveHistorySnapshot();
        const item = elements.splice(idx, 1)[0];
        elements.push(item);
        this.editor.renderCurrentPageElements();
        this.editor.selectElement(item.id);
      }
    });

    this.propSendBackward.addEventListener('click', () => {
      if (!this.editor.selectedElement) return;
      const elements = this.editor.getPageElements(this.editor.currentPage);
      const idx = elements.indexOf(this.editor.selectedElement);
      if (idx > 0) {
        this.editor.saveHistorySnapshot();
        const item = elements.splice(idx, 1)[0];
        elements.unshift(item);
        this.editor.renderCurrentPageElements();
        this.editor.selectElement(item.id);
      }
    });

    this.propDeleteBtn.addEventListener('click', () => {
      this.editor.deleteSelected();
    });
  }

  setMode(mode) {
    this.toolTabs.forEach(t => {
      t.classList.toggle('active', t.dataset.mode === mode);
    });
    this.editor.setMode(mode);

    if (mode === 'edit-text') {
      this.showToast(window.i18n.t('toastTextEditOpened'), 'info');
    } else if (mode === 'add-text') {
      this.showToast(window.i18n.t('toastTextAdded'), 'info');
    } else if (mode === 'whiteout') {
      this.showToast(window.i18n.t('toastWhiteoutAdded'), 'info');
    }
  }

  showLoading(text) {
    this.loadingText.innerText = text || window.i18n.t('loadingGeneral');
    this.loadingOverlay.classList.add('active');
  }

  hideLoading() {
    this.loadingOverlay.classList.remove('active');
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  async loadFile(file) {
    try {
      this.showLoading(window.i18n.t('loadingParsing'));
      const arrayBuffer = await file.arrayBuffer();
      await this.pdfManager.loadPdf(arrayBuffer, file.name);

      this.onPdfLoaded();
      this.showToast(window.i18n.t('toastPdfLoaded', { name: file.name }), 'success');
    } catch (err) {
      console.error(err);
      this.showToast(window.i18n.t('toastLoadError') + err.message, 'error');
    } finally {
      this.hideLoading();
    }
  }

  async loadSamplePdf() {
    try {
      this.showLoading(window.i18n.t('loadingSample'));
      await this.pdfManager.createSamplePdf();
      this.onPdfLoaded();
      this.showToast(window.i18n.t('toastSampleLoaded'), 'success');
    } catch (err) {
      console.error(err);
      this.showToast(window.i18n.t('toastSampleError') + err.message, 'error');
    } finally {
      this.hideLoading();
    }
  }

  onPdfLoaded() {
    this.editor.reset();
    this.emptyState.style.display = 'none';
    this.navControls.style.visibility = 'visible';
    this.downloadPdfBtn.removeAttribute('disabled');

    this.fileInfoBadge.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
      <span title="${this.pdfManager.fileName}">${this.pdfManager.fileName}</span>
    `;
    this.fileInfoBadge.classList.add('has-file');

    this.pageCountText.innerText = this.pdfManager.pageCount;
    this.pageNumberInput.max = this.pdfManager.pageCount;

    this.generateThumbnails();
    this.goToPage(1);
  }

  async generateThumbnails() {
    this.thumbnailList.innerHTML = '';
    for (let i = 1; i <= this.pdfManager.pageCount; i++) {
      const item = document.createElement('div');
      item.className = `thumbnail-item ${i === 1 ? 'active' : ''}`;
      item.dataset.page = i;

      const canvas = document.createElement('canvas');
      item.appendChild(canvas);

      const label = document.createElement('div');
      label.className = 'thumbnail-label';
      label.innerText = window.i18n.t('pageLabel', { n: i });
      item.appendChild(label);

      item.addEventListener('click', () => {
        this.goToPage(i);
      });

      this.thumbnailList.appendChild(item);

      // Render thumbnail asynchronously
      this.pdfManager.renderThumbnail(i, canvas).catch(console.error);
    }
  }

  async goToPage(pageNum) {
    if (pageNum < 1 || pageNum > this.pdfManager.pageCount) return;

    this.pdfManager.currentPage = pageNum;
    this.pageNumberInput.value = pageNum;
    this.prevPageBtn.disabled = (pageNum <= 1);
    this.nextPageBtn.disabled = (pageNum >= this.pdfManager.pageCount);

    // Update thumbnail active status
    const allThumbs = this.thumbnailList.querySelectorAll('.thumbnail-item');
    allThumbs.forEach(t => {
      t.classList.toggle('active', parseInt(t.dataset.page, 10) === pageNum);
    });

    await this.renderCurrentPage();
  }

  async renderCurrentPage() {
    try {
      this.showLoading(window.i18n.t('loadingPage', { n: this.pdfManager.currentPage }));

      // Temporary dummy canvas to measure viewport & detect text
      const tempCanvas = document.createElement('canvas');
      const { viewport, detectedTexts, pageWidth, pageHeight } = 
        await this.pdfManager.renderPage(this.pdfManager.currentPage, tempCanvas, this.currentScale);

      // Setup editor interactive layers
      const targetCanvas = this.editor.setupPage(
        this.pdfManager.currentPage,
        pageWidth,
        pageHeight,
        detectedTexts
      );

      // Copy rendered image onto the active page canvas
      targetCanvas.width = tempCanvas.width;
      targetCanvas.height = tempCanvas.height;
      targetCanvas.style.width = tempCanvas.style.width;
      targetCanvas.style.height = tempCanvas.style.height;

      const ctx = targetCanvas.getContext('2d');
      ctx.drawImage(tempCanvas, 0, 0);

      this.editor.deselect();
    } catch (err) {
      console.error(err);
      this.showToast('Rendering error: ' + err.message, 'error');
    } finally {
      this.hideLoading();
    }
  }

  setZoom(scale) {
    const clamped = Math.max(0.6, Math.min(2.5, scale));
    this.currentScale = Math.round(clamped * 100) / 100;
    this.zoomLevelText.innerText = Math.round(this.currentScale * 100) + '%';
    this.renderCurrentPage();
  }

  zoomToFit() {
    const viewportWidth = this.canvasViewport.clientWidth - 80;
    const fitScale = Math.max(0.8, Math.min(2.0, viewportWidth / 620));
    this.setZoom(fitScale);
  }

  updateUndoRedoUI() {
    this.undoBtn.disabled = (this.editor.undoStack.length === 0);
    this.redoBtn.disabled = (this.editor.redoStack.length === 0);
  }

  updateInspector(elem) {
    this.textProps.style.display = 'none';
    this.imageProps.style.display = 'none';
    this.whiteoutProps.style.display = 'none';
    this.commonProps.style.display = 'none';
    this.docInfoProps.style.display = 'none';
    this.deleteBtn.disabled = true;

    if (!elem) {
      this.inspectorTitle.innerText = window.i18n.t('docInfoTitle');
      this.docInfoProps.style.display = 'block';
      return;
    }

    this.commonProps.style.display = 'block';
    this.deleteBtn.disabled = false;

    if (elem.type === 'text') {
      this.inspectorTitle.innerText = window.i18n.t('textPropsTitle');
      this.textProps.style.display = 'flex';
      this.propFontFamily.value = elem.fontFamily || "Pretendard, 'Noto Sans KR', sans-serif";
      const pxSize = Math.round((elem.fontSizeNorm || (14 / this.editor.pageHeight)) * this.editor.pageHeight);
      this.propFontSize.value = pxSize;
      this.propColor.value = elem.color || '#000000';
      this.propBoldBtn.classList.toggle('active', !!elem.bold);
      this.propItalicBtn.classList.toggle('active', !!elem.italic);
      if (elem.bgColor && elem.bgColor !== 'transparent') {
        this.propBgColor.value = elem.bgColor;
        this.propBgTransparent.checked = false;
      } else {
        this.propBgTransparent.checked = true;
      }
    } else if (elem.type === 'image') {
      this.inspectorTitle.innerText = window.i18n.t('imagePropsTitle');
      this.imageProps.style.display = 'flex';
      const op = Math.round((elem.opacity !== undefined ? elem.opacity : 1.0) * 100);
      this.propOpacity.value = op;
      this.propOpacityVal.innerText = op + '%';
    } else if (elem.type === 'whiteout') {
      this.inspectorTitle.innerText = window.i18n.t('whiteoutPropsTitle');
      this.whiteoutProps.style.display = 'flex';
      this.propWhiteoutColor.value = elem.bgColor || '#ffffff';
    }
  }

  updateInspectorForDetectedText(item, fontProps) {
    this.textProps.style.display = 'flex';
    this.imageProps.style.display = 'none';
    this.whiteoutProps.style.display = 'none';
    this.commonProps.style.display = 'block';
    this.docInfoProps.style.display = 'none';
    this.deleteBtn.disabled = true;

    this.inspectorTitle.innerText = window.i18n.t('textPropsTitle');
    this.propFontFamily.value = fontProps.fontFamily;
    this.propFontSize.value = item.fontSize;
    this.propColor.value = '#000000';
    this.propBoldBtn.classList.toggle('active', !!fontProps.isBold);
    this.propItalicBtn.classList.remove('active');
    this.propBgTransparent.checked = true;
  }

  async downloadModifiedPdf() {
    try {
      this.showLoading(window.i18n.t('loadingExport'));
      const modifiedBytes = await this.pdfManager.exportModifiedPdf(this.editor);

      // Trigger Browser Download
      const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = this.pdfManager.fileName.replace(/\.pdf$/i, '');
      const prefix = window.i18n.getLang() === 'ko' ? '수정본_' : 'modified_';
      a.download = `${prefix}${baseName}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (a.parentNode) {
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
      }, 500);

      this.showToast(window.i18n.t('toastDownloadSuccess'), 'success');
    } catch (err) {
      console.error(err);
      this.showToast(window.i18n.t('toastDownloadError') + err.message, 'error');
    } finally {
      this.hideLoading();
    }
  }
}
