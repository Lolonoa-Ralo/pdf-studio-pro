<p align="right">
  <a href="README.md">English</a> | <strong>한국어</strong>
</p>

# 📄 PDF Studio Pro - 100% 무손실 클라이언트 사이드 PDF 편집기

> **"서버 전송 제로, 표와 서식 100% 무손실 보존 — 브라우저에서 바로 편집하는 안전한 웹 PDF 편집기."**  
> 원본 바이너리 구조와 복잡한 표를 1픽셀도 손상시키지 않고, 기존 텍스트 수정, 자유로운 이동, 이미지 첨부, 화이트아웃 패치를 100% 로컬 환경에서 지원합니다.

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2bb379?style=for-the-badge&logo=github)](https://lolonoa-ralo.github.io/pdf-studio-pro/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-HTML5%20%2F%20CSS3%20%2F%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#-기술-스택)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25_Local_(Zero_Server)-brightgreen?style=for-the-badge&logo=shield)](https://github.com/Lolonoa-Ralo/pdf-studio-pro)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-Support_Author-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/ralo2400)

---

## 🌐 라이브 데모 (Live Demo)
별도의 설치 없이 지금 바로 웹 브라우저에서 체험해보실 수 있습니다:  
👉 **[https://lolonoa-ralo.github.io/pdf-studio-pro/](https://lolonoa-ralo.github.io/pdf-studio-pro/)**

---

## 🔒 100% 개인정보 보호 및 보안 보장

사용자의 문서는 컴퓨터 외부로 절대 유출되지 않습니다:

* **서버 및 데이터베이스(DB) 없음**: 백엔드 서버나 외부 데이터베이스가 전혀 존재하지 않으며, 순수 바닐라 자바스크립트 클라이언트 기술로만 작동합니다.
* **로컬 브라우저 메모리(RAM) 내 100% 처리**: 업로드한 모든 PDF 문서와 수정 내역은 사용자의 브라우저 메모리에서만 즉각 처리되며, 외부 네트워크로 1바이트의 데이터도 전송되지 않습니다.
* **오프라인 / 비행기 모드 완벽 지원**: 인터넷 연결을 차단하거나 비행기 모드 상태에서도 모든 기능이 100% 정상 작동합니다.

---

## ✨ 핵심 기능 (Key Features)

### 📐 1. 원본 PDF 표 & 벡터 100% 무손실 보존
* **레이아웃 붕괴 제로**: 문서를 강제로 변환(Reflow)하여 서식을 깨뜨리는 일반 변환기와 달리, 원본 바이너리를 온전히 유지한 채 수정 사항을 정밀 1:1 합성합니다.
* **서식 완벽 유지**: 복잡한 관공서/기업 계약서의 표 테두리, 셀 간격, 로고, 도장, 벡터 라인이 1픽셀도 어긋나지 않습니다.

### ✍️ 2. 원클릭 기존 텍스트 수정 및 글꼴 매칭
* **비파괴 텍스트 선택**: 마우스로 기존 텍스트를 선택해도 원본 글꼴이 왜곡되거나 깨지지 않습니다.
* **이원화 글꼴 자동 판별**: 큰 제목(명조체 Bold) 및 본문/표 내용(고딕체 Pretendard / Noto Sans KR)을 자동으로 판별하여 원본 글꼴 서식 그대로 자연스럽게 수정합니다.
* **글자 파편 없는 깔끔한 이동**: 글자 상/하단 높이(어센더/디센더)를 정밀 계산하여 마스킹하므로, 텍스트를 이동해도 원본 자리에 쉼표 꼬리나 따옴표 등 지저분한 글자 잔상이 남지 않습니다.

### 🖼️ 3. 자유로운 이미지 첨부 & 클립보드 붙여넣기
* **즉시 붙여넣기 (`Ctrl + V`)**: 클립보드에 복사된 이미지를 작업 중인 PDF 화면에 즉시 붙여넣을 수 있습니다.
* **직관적인 조작**: 마우스 드래그로 위치 이동, 모서리 핸들을 통한 리사이즈, 불투명도 조절을 지원합니다.

### 🛡️ 4. 화이트아웃 (가림 패치)
* **원클릭 가림막**: 민감한 개인정보, 불필요한 문구, 삭제할 조항을 깨끗한 흰색 패치로 즉시 가릴 수 있습니다.

### 🎨 5. 세련된 UX & 최신 디자인
* **다크 모드 & 화이트 모드**: 주간 및 야간 작업 환경에 맞추어 눈이 편안한 테마로 즉각 전환 가능합니다.
* **글로벌 다국어 지원 (i18n)**: 한국어(KO) 및 영어(EN)를 상단 버튼으로 실시간 전환할 수 있습니다.
* **실행 취소 / 다시 실행**: 강력한 스냅샷 히스토리 스택(`Ctrl + Z` / `Ctrl + Y`)을 지원합니다.
* **고해상도 300 DPI 저장**: 모든 수정을 인쇄 품질 수준으로 영구 합성하여 즉시 다운로드할 수 있습니다.

---

## 🚀 빠른 시작 가이드 (Quick Start Guide)

빌드 도구나 패키지 설치가 전혀 필요 없는 **순수 바닐라 웹 기술**로 제작되었습니다.

### 방법 A: 브라우저에서 바로 열기
저장소를 다운로드하거나 클론한 후, 폴더 내의 `index.html` 파일을 크롬, 엣지, 웨일, 사파리 등의 브라우저로 더블 클릭하여 엽니다.

### 방법 B: GitHub Pages로 무료 웹 호스팅
1. 이 저장소 코드를 본인의 깃허브 계정에 업로드합니다 (`https://github.com/<username>/pdf-studio-pro`).
2. 저장소 상단의 **Settings** ➔ 왼쪽 **Pages** 메뉴로 이동합니다.
3. **Build and deployment** 항목에서:
   * **Source**: `Deploy from a branch` 선택
   * **Branch**: `main` (또는 `master`) 선택
   * **Folder**: `/ (root)` 선택
4. **Save**를 누르면 약 1~2분 뒤 나만의 무료 웹사이트 주소가 완성됩니다:
   ```text
   https://<your-username>.github.io/pdf-studio-pro/
   ```

---

## ⌨️ 단축키 안내

| 단축키 | 설명 |
| :--- | :--- |
| `Ctrl + Z` | 실행 취소 (Undo) |
| `Ctrl + Y` | 다시 실행 (Redo) |
| `Ctrl + V` | 클립보드 이미지 즉시 붙여넣기 |
| `Delete` | 선택된 요소(텍스트/이미지/패치) 삭제 |
| `Escape` | 선택 해제 |
| `Ctrl + 마우스 휠` | 캔버스 확대 / 축소 |

---

## 🛠️ 기술 스택 (Technology Stack)

* **UI & 마크업**: HTML5 (웹 표준 시맨틱 레이아웃)
* **스타일링**: Pure Vanilla CSS3 (커스텀 디자인 토큰, 반응형 툴바, 다크/라이트 테마)
* **스크립트**: Pure Vanilla JavaScript (Modern ES6+, 외부 빌드 도구 의존성 제로)
* **PDF 렌더링**: [PDF.js](https://mozilla.github.io/pdf.js/) (초고속 오프라인 캔버스 렌더링)
* **무손실 합성**: [PDF-Lib](https://pdf-lib.js.org/) (고해상도 벡터 오버레이 합성)
* **타이포그래피**: Pretendard, Noto Sans KR, 나눔명조, 바탕체

---

## 📂 저장소 구조 (Repository Structure)

```text
pdf-studio-pro/
├── css/
│   └── app.css             # 메인 스타일시트, 다크/화이트 테마, 레이아웃 규칙
├── js/
│   ├── app.js              # 어플리케이션 메인 컨트롤러 및 이벤트 바인딩
│   ├── editor.js           # 캔버스 편집 엔진 (선택, 수정, 이동, 화이트아웃)
│   ├── i18n.js             # 다국어(한국어/영어) 매니저
│   └── pdf-manager.js      # PDF.js 렌더링 및 PDF-Lib 무손실 합성 엔진
├── lib/
│   ├── pdf.min.js          # 로컬 독립형 PDF.js 라이브러리
│   ├── pdf.worker.min.js   # PDF.js 웹 워커
│   └── pdf-lib.min.js      # 로컬 독립형 PDF-Lib 라이브러리
├── index.html              # 단일 페이지 웹앱 메인 파일
├── README.md               # 영문 설명서 (기본 표시)
└── README_KR.md            # 한국어 설명서
```

---

## ☕ 개발자 후원 (Buy Me a Coffee)
PDF Studio Pro가 작업 시간 단축에 도움이 되셨다면, 커피 한 잔으로 따뜻한 응원을 보내주세요! 오픈소스 개발을 지속하는 데 큰 힘이 됩니다.  
👉 **[Buy Me a Coffee로 커피 후원하기](https://buymeacoffee.com/ralo2400)**

---

## 📄 라이선스 (License)
본 프로젝트는 [MIT License](LICENSE)를 따릅니다. 개인적, 상업적 목적으로 자유롭게 사용, 수정, 배포하실 수 있습니다.
