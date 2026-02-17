# MIRAE Laboratory Website

연구실 웹사이트 프로젝트입니다.

## 프로젝트 구조

### Contents (마크다운 기반 자료)

편집 가능한 자료는 **public/contents/** 아래 마크다운(.md)으로 두고, 빌드 시 `public/data/*.json`으로 생성됩니다.
옵시디언 등에서 **public/contents** 폴더를 루트로 열면 md와 이미지 경로가 그대로 보입니다.

| 폴더 / 파일            | 생성되는 JSON                      | 사용 페이지 |
| ---------------------- | ---------------------------------- | ----------- |
| **professor.md** | `public/data/professor.json`     | Professor   |
| **people/*.md**  | `public/data/members.json`       | People      |
| **archive/*.md** | `public/data/archive-index.json` | Archive     |

- **이미지·PDF**: `contents/files/` 에 두고, md에서는 `../files/이미지.png` 또는 사이트 기준 `/contents/files/이미지.png` 로 참조.
- **빌드**: `npm run build` 시 `build:archive` → `build:contents` → React 빌드 순으로 실행됩니다.
- 각 하위 폴더의 README에 frontmatter 형식이 정리되어 있습니다.

---

## People (멤버)

각 멤버는 **한 개의 마크다운(.md) 파일**로 작성합니다. 파일명(확장자 제외)이 `id`가 됩니다.

### Frontmatter

| 필드          | 필수 | 설명                            |
| ------------- | ---- | ------------------------------- |
| name          | ✓   | 이름                            |
| role          |      | 직함 (예: Graduate Student)     |
| bio           |      | 짧은 소개                       |
| avatar        |      | 프로필 이미지 URL               |
| email         |      | 이메일                          |
| link          |      | 개인/연구실 링크                |
| researchAreas |      | 연구 분야 (아래처럼 리스트)     |
| order         |      | 정렬 순서 (숫자, 작을수록 먼저) |

### researchAreas 예시

```yaml
researchAreas:
  - AI
  - NDT
```

또는 한 줄: `researchAreas: "AI, NDT"`

빌드 시 `npm run build:contents`가 이 폴더의 .md를 읽어 `public/data/members.json`을 생성합니다.

---

# Archive (Archive)위치: `public/contents/archive/*.md`

- 빌드 시 `public/data/archive-index.json` 생성.
- 이미지: `../files/이미지.png` 로 참조 (옵시디언·사이트 공통).
- Frontmatter 등은 config.js `archiveCategories` 참고.

## Frontmatter 필드

| 필드                | 필수 | 설명                                   |
| ------------------- | ---- | -------------------------------------- |
| title               | ✓   | 제목                                   |
| date                |      | 날짜 (예: "2025-02-14")                |
| category            |      | 카테고리 (Paper, Tutorials, News 등)   |
| type                |      | 타입 (journal, conference, patent 등)  |
| tags                |      | 태그 배열                              |
| authors             |      | 저자 배열 (Achievements 필터링에 사용) |
| source              |      | 출처 URL                               |
| country             |      | 국가                                   |
| institute           |      | 기관                                   |
| correspondingAuthor |      | 교신저자                               |
| abstract            |      | 초록                                   |
| language            |      | 언어 (ko, en 등)                       |

## Achievements 페이지

Archive의 모든 항목 중에서 `authors` 필드에 "Hogeon Seo" 또는 "서호건"이 포함된 항목만 Achievements 페이지에 표시됩니다.
카테고리는 동적으로 추출되어 필터링 메뉴로 표시됩니다.

---

## 정적 파일 (이미지·PDF)

이 폴더에 프로필 사진, 로고, 배너, CV·학술이력서 PDF 등을 둡니다.

- **사이트**: `/contents/files/파일명` 으로 제공됩니다.
- **옵시디언**: `public/contents` 를 루트로 열면, 스크랩 md에서 `../files/이미지.png` 로 참조 시 미리보기가 됩니다.

이전에 `public/files/` 에 두었던 파일이 있다면 이 폴더(`public/contents/files/`)로 옮겨 주세요.

---

## 개발 환경 설정

### 필수 요구사항

- Node.js (권장: v20 이상)
- npm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 로컬 테스트용 빌드
npm run build:local

# 빌드 후 로컬 서버 실행
npm run serve:live
```

### 개발 모드 (자동 빌드)

```bash
npm run dev:build
```

이 명령어는 파일 변경 시 자동으로 빌드하고 로컬 서버를 실행합니다.

---

## 배포

GitHub Pages에 배포하려면:

1. `package.json`의 `homepage` 값 확인
2. 다음 명령어 실행:

```bash
npm run deploy
```

또는 GitHub Actions를 사용하는 경우, `main` 브랜치에 푸시하면 자동으로 배포됩니다.

---

## 주요 기능

- **Professor 페이지**: 교수 프로필 및 연구 이력
- **People 페이지**: 연구실 멤버 소개
- **Achievements 페이지**: 연구 성과물 (Archive에서 저자 필터링)
- **Archive 페이지**: 연구 자료 및 스크랩
- **Repositories 페이지**: GitHub 저장소 목록
- **Contact 페이지**: 연락처 및 문의

---

## 기술 스택

- React 18
- React Router
- Redux Toolkit
- React Bootstrap
- Styled Components
- React Markdown

---

## 라이선스

MIT
