<p align="right">
  <strong>English</strong> | <a href="README_KR.md">한국어</a>
</p>

# 📄 PDF Studio Pro - Lossless Client-Side PDF Editor

> **"A 100% client-side, privacy-first web editor for modifying PDF documents without breaking tables, vectors, or layouts."**  
> Edit text directly, insert images, and add redaction patches while preserving original binary vector tables and layouts with zero server dependency.

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2bb379?style=for-the-badge&logo=github)](https://lolonoa-ralo.github.io/pdf-studio-pro/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-HTML5%20%2F%20CSS3%20%2F%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#-technology-stack)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25_Local_(Zero_Server)-brightgreen?style=for-the-badge&logo=shield)](https://github.com/Lolonoa-Ralo/pdf-studio-pro)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-Support_Author-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/ralo2400)

---

## 🌐 Live Demo
Experience PDF Studio Pro instantly in your browser without any installation:  
👉 **[https://lolonoa-ralo.github.io/pdf-studio-pro/](https://lolonoa-ralo.github.io/pdf-studio-pro/)**

---

## 🔒 100% Client-Side Privacy & Zero Data Leakage

Your documents never leave your computer:

* **Zero Server & Zero Database**: There is no backend server (No Node.js, Python, PHP, or external DB). All processing occurs directly inside your local browser engine.
* **Pure In-Memory Processing**: Uploaded documents are handled strictly inside your browser's volatile RAM through HTML5 File API and Web Workers. Not a single byte is transmitted over the network.
* **100% Air-Gapped / Offline Ready**: Works completely offline. Disconnect your internet connection or turn on Airplane mode—PDF Studio Pro runs with full functionality.

---

## ✨ Key Features

### 📐 1. 100% Lossless Table & Vector Preservation
* **No Broken Layouts**: Unlike conventional converters (e.g. PDF to Word/HTML) that scramble layouts, PDF Studio Pro preserves original binary vectors, borders, and complex tables with 100% fidelity.
* **Sub-pixel Accuracy**: Retains original form structures, grid lines, and embedded artwork exactly as designed.

### ✍️ 2. Seamless In-Place Text Editing
* **Non-Destructive Detection**: Clicking text triggers real-time in-place editing without distorting original font rendering.
* **Dual-Classification Font Matching**: Automatically detects font styles (Serif / Nanum Myeongjo vs. Sans-serif / Pretendard / Noto Sans KR) and font weights for natural inline modifications.
* **Ascender/Descender Bound Masking**: Eliminates dirty residue, comma tails, or punctuation debris when moving edited text.

### 🖼️ 3. Freeform Image Attachment & Clipboard Paste
* **Instant Paste (`Ctrl + V`)**: Copy any image to your clipboard and paste it directly onto any PDF page.
* **Intuitive Controls**: Drag to reposition, resize with proportional handles, and adjust layer opacity.

### 🛡️ 4. Whiteout & Redaction Patches
* **One-Click Concealment**: Instantly overlay opaque whiteout patches to redact sensitive information, unwanted text, or expired clauses cleanly.

### 🎨 5. Modern UX & Visual Excellence
* **Dark Mode & Light Mode**: Fluidly switch between sleek dark and clean daylight themes.
* **Bilingual Support (i18n)**: One-click live toggle between English (EN) and Korean (KO).
* **Multi-Level Undo/Redo**: Full state snapshot history (`Ctrl+Z` / `Ctrl+Y`).
* **High-Resolution 300 DPI Export**: Synthesizes all modifications into a print-ready vector PDF for instant download.

---

## 🚀 Quick Start Guide

Built purely with **Vanilla Web Technologies**—no build tools, bundlers, or package managers required.

### Option A: Open Directly in Browser
Download or clone this repository, then double-click `index.html` to open it in Chrome, Edge, Firefox, or Safari.

### Option B: Deploy to GitHub Pages (Free Hosting)
1. Fork or push this repository to your GitHub account (`https://github.com/<username>/pdf-studio-pro`).
2. Go to **Settings** ➔ **Pages**.
3. Under **Build and deployment**, set:
   * **Source**: `Deploy from a branch`
   * **Branch**: `main` (or `master`)
   * **Folder**: `/ (root)`
4. Click **Save**. Within 1–2 minutes, your web application will be live at:
   ```text
   https://<your-username>.github.io/pdf-studio-pro/
   ```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `Ctrl + Z` | Undo last edit action |
| `Ctrl + Y` | Redo previously undone action |
| `Ctrl + V` | Paste copied image directly from clipboard |
| `Delete` | Remove selected text box, image, or patch |
| `Escape` | Deselect active canvas element |
| `Ctrl + Scroll` | Zoom canvas in / out |

---

## 🛠️ Technology Stack

* **Markup**: HTML5 (Accessible, semantic layout)
* **Styling**: Pure Vanilla CSS3 (Custom design system tokens, responsive toolbar, Dark/Light mode)
* **Scripting**: Pure Vanilla JavaScript (Modern ES6+, Zero external build dependencies)
* **PDF Rendering**: [PDF.js](https://mozilla.github.io/pdf.js/) (High-performance canvas rendering)
* **Lossless Synthesis**: [PDF-Lib](https://pdf-lib.js.org/) (High-DPI vector overlay synthesis)
* **Typography**: Pretendard, Noto Sans KR, Nanum Myeongjo, Batang

---

## 📂 Repository Structure

```text
pdf-studio-pro/
├── css/
│   └── app.css             # Main styling, dark/light theme, and layout rules
├── js/
│   ├── app.js              # Application controller & UI event binder
│   ├── editor.js           # Multi-mode visual editor (select, edit, move, whiteout)
│   ├── i18n.js             # Bilingual localization manager (EN / KO)
│   └── pdf-manager.js      # PDF.js rendering & PDF-Lib hybrid export engine
├── lib/
│   ├── pdf.min.js          # Standalone PDF.js library
│   ├── pdf.worker.min.js   # PDF.js Web Worker
│   └── pdf-lib.min.js      # Standalone PDF-Lib library
├── index.html              # Monolithic SPA entrypoint
├── README.md               # English documentation (Default display)
└── README_KR.md            # Korean documentation
```

---

## ☕ Support & Donation
If PDF Studio Pro helped streamline your workflow or saved you time, consider supporting open-source development!  
👉 **[Buy Me a Coffee](https://buymeacoffee.com/ralo2400)**

---

## 📄 License
This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute for both personal and commercial purposes.
