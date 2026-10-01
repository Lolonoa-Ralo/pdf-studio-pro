/**
 * Internationalization (i18n) Module
 * Supports English (Default) and Korean with instant live switching
 */

const I18N_TRANSLATIONS = {
  en: {
    // App Header & Branding
    appTitle: "PDF Studio Pro",
    noFileLoaded: "No document opened",
    prevPage: "Previous Page",
    nextPage: "Next Page",
    zoomOut: "Zoom Out (Ctrl + -)",
    zoomIn: "Zoom In (Ctrl + +)",
    zoomFit: "Fit to Width",
    openPdf: "Open PDF",
    samplePdf: "Try Sample PDF",
    samplePdfTooltip: "Instantly create & load an interactive sample contract PDF",
    downloadPdf: "Download PDF",
    toggleTheme: "Toggle Theme (Dark / Light)",
    toggleLang: "한국어로 변경 (KO)",
    donateBtn: "Buy Me a Coffee",
    
    // Tool Ribbon
    toolSelect: "Select / Move",
    toolEditText: "Edit Text",
    badgeRecommended: "Auto",
    toolAddText: "New Text Box",
    toolAddImage: "Attach Image",
    toolWhiteout: "Whiteout Patch",
    undoTooltip: "Undo (Ctrl + Z)",
    redoTooltip: "Redo (Ctrl + Y)",
    deleteTooltip: "Delete Item (Delete)",
    resetEditsBtn: "Reset Page",
    resetEditsTooltip: "Revert all changes on this page back to original PDF",

    // Sidebar
    sidebarTitle: "Page Thumbnails",
    toggleSidebarTooltip: "Collapse/Expand Sidebar",
    pageLabel: "Page {n}",

    // Empty Welcome State
    emptyTitle: "Open a PDF to start editing",
    emptyDesc: "Drag and drop your PDF here or choose from your computer.<br><strong>100% Client-Side. Tables, vectors, and layouts remain perfectly preserved without breaking.</strong>",
    emptyOpenBtn: "Choose PDF from Computer",
    emptySampleBtn: "Start with Sample Contract",
    featureLossless: "100% Lossless Vectors & Tables",
    featureTextEdit: "1-Click Existing Text Editing",
    featureImages: "Drag & Drop Image Insertion",

    // Inspector Panel
    inspectorTitle: "Properties",
    docInfoTitle: "Getting Started",
    textPropsTitle: "Text Formatting",
    fontFamily: "Font",
    fontSize: "Size",
    fontColor: "Text Color",
    fontStyle: "Style",
    boldTooltip: "Bold",
    italicTooltip: "Italic",
    bgPatch: "Background Patch",
    bgTransparent: "Transparent",
    
    imagePropsTitle: "Image Settings",
    opacity: "Opacity",
    bringForward: "Bring to Front",
    sendBackward: "Send to Back",

    whiteoutPropsTitle: "Whiteout Settings",
    patchColor: "Patch Color",
    deleteItem: "Delete Item",

    docGuideTitle: "💡 How to Edit Text:",
    docGuide1: "1. Select <strong>[Edit Text]</strong> in the top toolbar.",
    docGuide2: "2. Click on any text you want to change.",
    docGuide3: "3. Type directly with your keyboard!",
    docGuideImgTitle: "🖼️ Image Insertion:",
    docGuideImg1: "Click [Attach Image] or copy an image and press <code>Ctrl + V</code>.",

    // Toast Notifications
    toastPdfLoaded: "'{name}' loaded successfully!",
    toastLoadError: "Failed to open PDF: ",
    toastSampleLoaded: "Interactive sample contract PDF loaded!",
    toastSampleError: "Failed to generate sample: ",
    toastUndo: "Action undone.",
    toastRedo: "Action redone.",
    toastResetPage: "All edits reverted! Current page restored to 100% pristine original.",
    toastTextSelected: "Text selected. (Double-click to edit content)",
    toastTextEditOpened: "Text editor opened with original font style. Start typing!",
    toastTextAdded: "New text box created.",
    toastWhiteoutAdded: "Whiteout patch added.",
    toastImageAdded: "Image attached successfully!",
    toastItemDeleted: "Selected item deleted.",
    toastDownloadSuccess: "Modified PDF downloaded securely!",
    toastDownloadError: "Failed to save PDF: ",
    toastCopied: "Copied to clipboard!",

    // Loading overlay
    loadingParsing: "Analyzing and rendering PDF document...",
    loadingSample: "Generating high-fidelity sample PDF...",
    loadingExport: "Losslessly synthesizing edits into original PDF...",
    loadingPage: "Rendering page {n}...",
    loadingGeneral: "Processing..."
  },

  ko: {
    // App Header & Branding
    appTitle: "PDF Studio Pro",
    noFileLoaded: "문서를 열어주세요",
    prevPage: "이전 페이지",
    nextPage: "다음 페이지",
    zoomOut: "축소 (Ctrl + -)",
    zoomIn: "확대 (Ctrl + +)",
    zoomFit: "너비 맞춤",
    openPdf: "PDF 열기",
    samplePdf: "샘플 PDF 체험",
    samplePdfTooltip: "테스트용 정교한 예제 계약서 PDF를 생성하여 바로 불러옵니다",
    downloadPdf: "수정본 다운로드",
    toggleTheme: "테마 변경 (다크 / 라이트 모드)",
    toggleLang: "Switch to English (EN)",
    donateBtn: "커피 후원하기",
    
    // Tool Ribbon
    toolSelect: "선택 / 이동",
    toolEditText: "기존 텍스트 수정",
    badgeRecommended: "추천",
    toolAddText: "새 텍스트 상자",
    toolAddImage: "이미지 첨부",
    toolWhiteout: "화이트아웃 (가림 패치)",
    undoTooltip: "실행 취소 (Ctrl + Z)",
    redoTooltip: "다시 실행 (Ctrl + Y)",
    deleteTooltip: "선택 항목 삭제 (Delete)",
    resetEditsBtn: "원본 복원",
    resetEditsTooltip: "현재 페이지의 모든 수정 사항을 초기화하고 깨끗한 원본으로 되돌립니다",

    // Sidebar
    sidebarTitle: "페이지 목록",
    toggleSidebarTooltip: "사이드바 접기/펼치기",
    pageLabel: "{n} 페이지",

    // Empty Welcome State
    emptyTitle: "편집할 PDF 파일을 열어주세요",
    emptyDesc: "이곳으로 PDF 파일을 드래그 앤 드롭하거나 아래 버튼을 클릭하여 선택하세요.<br><strong>100% 클라이언트 로컬 구동. 원본의 모든 표, 서식, 벡터 레이아웃이 완벽하게 무손실 보존됩니다.</strong>",
    emptyOpenBtn: "내 컴퓨터에서 PDF 선택",
    emptySampleBtn: "샘플 PDF로 바로 시작하기",
    featureLossless: "원본 표/서식 100% 무손실 보존",
    featureTextEdit: "기존 텍스트 원클릭 즉시 수정",
    featureImages: "자유로운 이미지 첨부 & 붙여넣기",

    // Inspector Panel
    inspectorTitle: "속성 패널",
    docInfoTitle: "문서 안내",
    textPropsTitle: "텍스트 서식",
    fontFamily: "글꼴",
    fontSize: "크기",
    fontColor: "글자 색상",
    fontStyle: "스타일",
    boldTooltip: "굵게",
    italicTooltip: "기울임",
    bgPatch: "배경 패치 (화이트아웃)",
    bgTransparent: "투명",
    
    imagePropsTitle: "이미지 설정",
    opacity: "불투명도",
    bringForward: "맨 앞으로",
    sendBackward: "맨 뒤로",

    whiteoutPropsTitle: "패치 설정",
    patchColor: "패치 색상",
    deleteItem: "항목 삭제",

    docGuideTitle: "💡 기존 텍스트 수정 방법:",
    docGuide1: "1. 상단의 <strong>[기존 텍스트 수정]</strong> 툴을 선택합니다.",
    docGuide2: "2. 수정하고 싶은 글자 위를 마우스로 클릭합니다.",
    docGuide3: "3. 원하는 내용으로 바로 타이핑하여 바꿉니다!",
    docGuideImgTitle: "🖼️ 이미지 첨부:",
    docGuideImg1: "[이미지 첨부] 버튼을 누르거나, 클립보드 복사 후 <code>Ctrl + V</code>로 즉시 붙여넣을 수 있습니다.",

    // Toast Notifications
    toastPdfLoaded: "'{name}'을 성공적으로 열었습니다!",
    toastLoadError: "PDF 파일을 불러오는데 실패했습니다: ",
    toastSampleLoaded: "표와 서식이 포함된 샘플 계약서가 로드되었습니다!",
    toastSampleError: "샘플 PDF 생성 실패: ",
    toastUndo: "실행 취소되었습니다.",
    toastRedo: "다시 실행되었습니다.",
    toastResetPage: "현재 페이지의 모든 수정 사항이 초기화되어 원본으로 복원되었습니다!",
    toastTextSelected: "텍스트가 선택되었습니다. (더블 클릭하면 내용을 수정할 수 있습니다)",
    toastTextEditOpened: "원본 글꼴 형태로 수정 상자가 열렸습니다. 바로 입력하세요!",
    toastTextAdded: "새 텍스트 상자가 추가되었습니다.",
    toastWhiteoutAdded: "화이트아웃 패치가 추가되었습니다.",
    toastImageAdded: "이미지가 성공적으로 첨부되었습니다!",
    toastItemDeleted: "선택한 항목이 삭제되었습니다.",
    toastDownloadSuccess: "수정된 PDF가 안전하게 다운로드되었습니다!",
    toastDownloadError: "PDF 저장 실패: ",
    toastCopied: "클립보드에 복사되었습니다!",

    // Loading overlay
    loadingParsing: "PDF 문서를 분석하고 렌더링하는 중...",
    loadingSample: "테스트용 고화질 샘플 계약서 PDF를 생성하는 중...",
    loadingExport: "수정 사항을 원본 PDF에 무손실로 합성하는 중...",
    loadingPage: "{n} 페이지 렌더링 중...",
    loadingGeneral: "작업을 처리하는 중...",


  }
};

class I18nManager {
  constructor(defaultLang = 'en') {
    // Check saved preference or default to English
    const saved = localStorage.getItem('pdf_studio_lang');
    this.currentLang = (saved === 'ko' || saved === 'en') ? saved : defaultLang;
  }

  getLang() {
    return this.currentLang;
  }

  setLang(lang) {
    if (lang !== 'en' && lang !== 'ko') return;
    this.currentLang = lang;
    localStorage.setItem('pdf_studio_lang', lang);
    this.applyTranslations();
  }

  toggleLang() {
    const nextLang = this.currentLang === 'en' ? 'ko' : 'en';
    this.setLang(nextLang);
    return nextLang;
  }

  t(key, params = {}) {
    const dict = I18N_TRANSLATIONS[this.currentLang] || I18N_TRANSLATIONS.en;
    let text = dict[key] || I18N_TRANSLATIONS.en[key] || key;
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return text;
  }

  applyTranslations() {
    document.documentElement.lang = this.currentLang;

    // Elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit')) {
          el.value = translation;
        } else {
          el.innerHTML = translation;
        }
      }
    });

    // Elements with data-i18n-title
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const translation = this.t(key);
      if (translation) {
        el.setAttribute('title', translation);
      }
    });

    // Trigger custom event for dynamic updates in app controller
    window.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: this.currentLang } }));
  }
}

window.i18n = new I18nManager('en');
