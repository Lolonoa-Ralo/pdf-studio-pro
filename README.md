# PDF Studio Pro - Lossless Client-Side PDF Editor

<p align="center">
  <strong>A 100% client-side, privacy-first web application for editing PDF documents without breaking tables, vectors, or original layouts.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Tech-Vanilla_JS_|_HTML5_|_CSS3-orange.svg" alt="Pure Vanilla">
  <img src="https://img.shields.io/badge/Privacy-100%25_Local_(Zero_Server)-brightgreen.svg" alt="100% Local Privacy">
  <img src="https://img.shields.io/badge/Deployment-GitHub_Pages_Ready-success.svg" alt="GitHub Pages Ready">
</p>

---

## 🌐 Language / 언어 선택

- **English** (Default below)
- <details><summary><strong>🇰🇷 한국어 설명서 보기 (Click to view Korean Guide)</strong></summary>

---

### 🇰🇷 PDF Studio Pro - 100% 무손실 클라이언트 사이드 PDF 편집기

원본 PDF의 **표, 벡터 그래픽, 서식, 레이아웃을 100% 무손실로 완벽 보존**하면서, 기존 텍스트 수정, 자유로운 이동, 이미지 첨부 및 고해상도 PDF 다운로드를 지원하는 웹 기반 PDF 편집 솔루션입니다.

#### 🔒 100% 개인정보 보호 및 보안 보장
- **서버 및 데이터베이스(DB) 없음**: 백엔드 서버나 외부 데이터베이스로 데이터를 일절 전송하지 않습니다.
- **로컬 브라우저 메모리(RAM) 내 100% 처리**: 사용자가 업로드한 모든 PDF 파일과 수정본은 사용자의 PC 내부 브라우저 메모리에서만 처리되며, 외부 네트워크로 1바이트도 유출되지 않습니다.
- **오프라인 / 비행기 모드 완벽 지원**: 인터넷 연결을 끊거나 비행기 모드 상태에서도 100% 동일하게 모든 기능이 동작합니다.

#### 🌟 핵심 기능
1. **원본 PDF 100% 무손실 보존**:
   - 일반 변환기(PDF to Word/HTML)처럼 문서를 다시 구조화(Reflow)하지 않고, 원본 바이너리를 온전히 유지한 채 수정 사항을 1:1 고해상도로 정밀 합성합니다.
   - 복잡한 표 테두리, 셀 간격, 로고, 벡터 라인이 1픽셀도 어긋나지 않습니다.
2. **비파괴 텍스트 선택 및 원본 글꼴 매칭**:
   - 마우스로 텍스트를 선택해도 원본 글꼴이 왜곡되거나 깨지지 않고 100% 그대로 유지됩니다.
   - 대형 제목(명조체 Bold) 및 본문/표 내용(고딕체 Pretendard / Noto Sans KR)을 자동 판별하여 원본 글꼴 서식 그대로 수정할 수 있습니다.
3. **글자 파편 없는 깔끔한 이동**:
   - 텍스트를 드래그하여 이동할 때, 어센더(따옴표, 대문자 꼭대기)와 디센더(g, y, p, 쉼표의 꼬리)를 계산한 정밀 마스킹 패치를 적용하여 원본 자리에 지저분한 글자 잔상/파편이 전혀 남지 않습니다.
4. **자유로운 이미지 첨부 & 클립보드 붙여넣기**:
   - 파일 첨부뿐만 아니라 클립보드에 복사된 이미지를 `Ctrl + V`로 즉시 붙여넣고 드래그 이동, 리사이즈, 불투명도 조절이 가능합니다.
5. **화이트아웃 (가림 패치)**:
   - 가리고 싶은 영역에 원클릭으로 흰색 패치를 배치하여 불필요한 문구나 표의 내용을 감출 수 있습니다.
6. **고해상도(300 DPI) PDF 다운로드**:
   - 수정본 다운로드 클릭 시 모든 수정 사항이 원본 PDF에 인쇄 품질 수준으로 영구 합성되어 저장됩니다.
7. **글로벌 다국어 지원 (영어 / 한국어 실시간 전환)**:
   - 전 세계 사용자를 위해 기본 영어(English) UI로 구동되며, 상단 🌐 버튼으로 언제든 한국어(KO)로 원클릭 전환할 수 있습니다.
8. **다크 모드 & 화이트(라이트) 모드 & 커피 후원 기능**:
   - 야간 작업과 밝은 환경 모두를 위한 세련된 다크/화이트 테마 전환 및 오픈소스 개발자를 위한 따뜻한 커피 후원 팝업을 지원합니다.

#### 🚀 로컬 실행 방법
1. **방법 1 (가장 간단)**: 폴더 내의 `실행하기.bat` 더블 클릭
2. **방법 2**: `index.html` 파일을 더블 클릭하여 크롬/엣지 등의 웹 브라우저로 열기

#### 🌐 GitHub Pages 무료 웹사이트 호스팅 방법
1. 본 저장소의 코드를 GitHub Repository에 업로드합니다.
2. 저장소의 **[Settings]** ➔ **[Pages]** 메뉴로 이동합니다.
3. **Branch** 설정을 `main` (또는 `master`), 폴더를 `/ (root)`로 선택하고 **[Save]**를 클릭합니다.
4. 1~2분 뒤 생성되는 `https://<username>.github.io/<repo-name>/` 주소를 통해 전 세계 어디서든 웹 브라우저로 접속할 수 있습니다.

#### ⌨️ 단축키 안내
- `Ctrl + Z`: 실행 취소 (Undo)
- `Ctrl + Y`: 다시 실행 (Redo)
- `Ctrl + V`: 클립보드 이미지 즉시 붙여넣기
- `Delete`: 선택된 요소 삭제
- `Escape`: 선택 해제
- `Ctrl + 마우스 휠`: 확대 / 축소

</details>

---

## 📖 English Guide

### 🌟 Overview

**PDF Studio Pro** is an open-source, ultra-fast, and entirely client-side web application designed to edit PDFs directly inside the browser. Unlike conventional converters that break complex layouts, font metrics, or table borders, PDF Studio Pro guarantees **100% lossless preservation of original vectors, forms, tables, and document structures**.

---

### 🔒 100% Client-Side Privacy & Security

> **Your documents never leave your computer.**

- **Zero Server & Zero Database**: This project contains no server-side backend (No Node.js, Python, PHP, or DB). All logic runs locally via Vanilla JavaScript.
- **In-Memory Local Processing**: Files are processed strictly within your browser's RAM through HTML5 File API, `PDF.js`, and `pdf-lib`.
- **Zero Telemetry / No Network Requests**: No external API calls, analytics, or tracking scripts.
- **Air-Gapped & Offline Ready**: Unplug your ethernet cable or turn on Airplane mode — PDF Studio Pro operates with 100% functionality completely offline.

---

### ✨ Key Features

- **100% Lossless Table & Vector Preservation**: Original PDF binaries, vector strokes, and table grids remain pristine without displacement or awkward reflowing.
- **Non-Destructive Text Selection**: Selecting text does not alter, mask, or distort original font rendering or layout.
- **Accurate Font Matching**: Automatically detects font classifications (Serif / Nanum Myeongjo vs Sans-serif / Pretendard / Noto Sans KR) and font weights for seamless inline editing.
- **Clean Text Moving Without Artifacts**: Moving text calculates precise ascender and descender bounds, completely eliminating leftover punctuation fragments, quotes, or trailing dots.
- **Image Insertion & Clipboard Paste**: Insert PNG/JPEG images via file upload or instant `Ctrl + V` clipboard paste, with intuitive drag, resize handles, and opacity control.
- **Whiteout Masking Patches**: Instantly place opaque patches to cleanly redact confidential data or unused table cells.
- **Interactive Multi-Level Undo / Redo**: Complete history snapshot stack for effortless undoing (`Ctrl+Z`) and redoing (`Ctrl+Y`).
- **High-Resolution 300 DPI Export**: Synthesizes overlays at print-quality resolution into the original PDF with a single click.
- **Bilingual Internationalization (EN / KO)**: English by default for global audiences with instant 1-click Korean language switching.
- **Dark Mode & Light Mode**: Seamless theme toggle preserving eyes during day and night work.
- **Buy Me a Coffee Donation**: Built-in support dialog for contributors and users who wish to support continued open-source development.

---

### 🚀 Getting Started

#### Option A: Run Locally (Instant & Offline)
1. Clone or download this repository.
2. Double-click `실행하기.bat` (Windows) or open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).
3. No installation, `npm install`, or local server setup required!

#### Option B: Deploy to GitHub Pages (Free Web Hosting in 3 Minutes)
1. Fork or push this repository to your GitHub account.
2. In your repository, navigate to **Settings** ➔ **Pages**.
3. Under **Build and deployment**, set:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or `master`)
   - **Folder**: `/ (root)`
4. Click **Save**. Within 1–2 minutes, your website will be live at:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

---

### 📁 Repository Structure

```plaintext
├── css/
│   └── app.css             # Design system, responsive toolbar, & canvas styling
├── js/
│   ├── app.js              # Application controller & inspector panel logic
│   ├── editor.js           # Multi-mode visual editor (select, edit, drag, resize, whiteout)
│   └── pdf-manager.js      # PDF.js rendering & PDF-Lib lossless hybrid export
├── lib/
│   ├── pdf.min.js          # Standalone PDF.js library
│   ├── pdf.worker.min.js   # PDF.js Web Worker
│   └── pdf-lib.min.js      # Standalone PDF-Lib library
├── index.html              # Main single-page interface
├── 실행하기.bat             # 1-click launcher for Windows
└── README.md               # Documentation (English & Korean)
```

---

### ⌨️ Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `Ctrl + Z` | Undo last action |
| `Ctrl + Y` | Redo action |
| `Ctrl + V` | Paste image from clipboard |
| `Delete` | Delete selected element |
| `Escape` | Deselect active element |
| `Ctrl + MouseWheel` | Zoom In / Out |

---

### 🛠️ Technology Stack

- **Core**: Vanilla HTML5, Modern JavaScript (ES6+), Vanilla CSS3 (Custom Design System, Dark Mode Toolbar)
- **PDF Rendering**: [PDF.js](https://mozilla.github.io/pdf.js/) (Local offline bundle with CDN fallback)
- **PDF Modification**: [PDF-Lib](https://pdf-lib.js.org/) (High-DPI hybrid overlay synthesis)
- **Typography**: Pretendard, Noto Sans KR, Nanum Myeongjo, Batang

---

### 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute for both personal and commercial purposes.
