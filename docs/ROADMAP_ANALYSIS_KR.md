# 연구실 웹사이트 확장 로드맵 분석

> GitHub Pages(정적 호스팅) 환경에서 요청하신 기능의 **실현 가능 여부**와 **구현 방안**을 정리한 문서입니다.

---

## 현재 사이트 구조 요약

- **스택**: React (Create React App) + Redux + React Router + Bootstrap
- **호스팅**: GitHub Pages → **서버 없음, 정적 파일만 제공**
- **데이터**: GitHub REST API(사용자 정보, 레포 목록) 사용 중

---

## 요청 기능별 분석

### 1. 프로필 및 성과 (교수님 + 학생, 논문/특허/포스터)

| 항목 | 가능 여부 | 설명 |
|------|-----------|------|
| 교수님·학생 프로필 | ✅ **가능** | 정적 데이터(JSON/YAML/ config)로 관리 후 React에서 렌더링 |
| 논문·특허·포스터 목록 | ✅ **가능** | 같은 방식으로 목록 데이터화 후 표/카드 형태로 표시 |

**구현 방향**

- `src/data/` 또는 `public/data/`에 예: `members.json`, `publications.json` 추가
- 프로필: 이름, 사진 URL, 소개, 연구 분야 등
- 성과: 제목, 저자, 연도, 링크, 타입(논문/특허/포스터), DOI 등
- 새 페이지: `/People`, `/Publications` (또는 `/Research`) 추가 후 해당 데이터 사용

**제한 사항**: 없음. GitHub Pages에서 그대로 구현 가능합니다.

---

### 2. 스크랩 콘텐츠 + 메타(키워드) + 키워드 검색

| 항목 | 가능 여부 | 설명 |
|------|-----------|------|
| 스크랩을 마크다운으로 보관 | ✅ **가능** | repo에 `.md` 파일로 저장 (예: `content/scraps/` ). **Obsidian과 형식 호환 권장** |
| 메타 정보(키워드 등) | ✅ **가능** | YAML frontmatter 사용 (`tags`/`keywords`, `title`, `date` 등). Obsidian frontmatter와 동일 형식 |
| 방문자가 키워드로 검색·정렬 | ✅ **가능** | **클라이언트(브라우저) 검색**으로 구현 |

**제한 사항**

- **실시간 스크래핑**: GitHub Pages에는 서버가 없어 **사이트 자체에서 스크래핑 불가**
- **대안**  
  - **A.** 로컬/개발 PC에서 스크래핑 스크립트(Python 등) 실행 → 마크다운 생성 → 결과를 repo에 커밋  
  - **B.** GitHub Actions로 주기적(예: 매일) 스크래핑 후 생성된 마크다운을 자동 커밋  
  - **C.** 외부 서비스(예: Zapier, n8n)로 스크랩 후 웹훅/API로 GitHub에 파일 생성 (고급)

**구현 방향**

1. **Obsidian 호환 스크랩 마크다운 형식**  
   같은 `.md` 파일을 **Obsidian에서 읽고 편집**하고, **웹사이트에서는 frontmatter로 검색·표시**할 수 있도록 형식을 맞춥니다.

   - **YAML frontmatter**: Obsidian이 그대로 인식합니다. `tags`, `aliases`, `date` 등은 Obsidian 기본 필드와 호환됩니다.
   - **본문**: 표준 마크다운. Obsidian의 `[[위키링크]]`, `#태그`, `![[임베드]]` 등도 그대로 사용 가능합니다.
   - **한 파일 = 한 노트**: 폴더 하나를 Obsidian vault(또는 하위 폴더)로 열면 그래프·링크·태그가 모두 동작합니다.

   **스크랩 시 수집·기입 권장 메타 (국가·기관·교신저자 검색용)**  
   방문자가 **국가**, **기관(Institute)**, **교신저자(Corresponding author)** 로 필터/검색할 수 있도록 아래 필드를 frontmatter에 두는 것을 권장합니다. 스크래핑 스크립트나 수동 입력 시 채우면 됩니다.

   | 필드 (권장 키) | 타입 | 설명 | 예시 |
   |----------------|------|------|------|
   | `country` / `countries` | 문자열 또는 배열 | 논문/콘텐츠의 소속 국가. 복수 국가면 배열 | `"South Korea"` 또는 `["USA", "China"]` |
   | `institute` / `institution` / `organization` | 문자열 또는 배열 | 소속 기관명. 복수면 배열 | `"MIT"`, `["Seoul National University", "KAIST"]` |
   | `authors` | 배열 | 저자 전체 (선택). 검색·표시용 | `["Hong G.", "Kim S.", "Lee M."]` |
   | `correspondingAuthor` | 문자열 또는 배열 | 교신저자 이름. 복수면 배열 | `"Mi, Professor"` 또는 `["Mi, Professor", "Lee, M."]` |

   **Obsidian 호환성**: 위 필드는 모두 **일반 YAML 키**이므로 Obsidian과 충돌하지 않습니다. Obsidian은 frontmatter의 임의 키를 그대로 보존하며, **Dataview** 플러그인으로 `country`, `institute`, `correspondingAuthor` 등으로 테이블·리스트 조회가 가능합니다. 별도 예약어가 없어 호환에 유리합니다.

   **권장 예시 (Obsidian + 웹사이트 공용, 국가·기관·교신저자 포함):**

   ```markdown
   ---
   title: "콘텐츠 제목"
   date: 2025-02-14
   category: "Paper"
   # categories: ["Paper", "Technical Tips"]   # 복수 메뉴에 노출할 때
   tags:
     - 키워드1
     - 키워드2
   source: "https://..."
   # 국가·기관·저자 (검색/필터용)
   country: "South Korea"
   # countries: ["USA", "China"]   # 복수 국가일 때
   institute: "Seoul National University"
   # institution: ["MIT", "Harvard"]   # 복수 기관일 때
   authors:
     - "Hong G."
     - "Kim S."
     - "Lee M."
   correspondingAuthor: "Mi, Professor"
   # correspondingAuthor: ["Mi, Professor", "Lee M."]   # 복수 교신저자일 때
   # 웹 전용 메타 (Obsidian은 무시해도 됨)
   relatedIds: []
   hypePhase: "Peak"
   ---
   본문 내용. Obsidian [[위키링크]]나 #태그 도 사용 가능.
   ```

   **호환 포인트 요약:**

   | 항목 | Obsidian | 웹사이트 |
   |------|----------|----------|
   | frontmatter | ✅ 그대로 표시·검색 가능 | ✅ 키워드 검색·관계 맵용으로 파싱 |
   | `tags` (YAML 배열) | ✅ 태그 패널·필터에 사용 | ✅ 키워드로 활용 (배열이면 그대로 사용) |
   | `title`, `date`, `aliases` | ✅ 기본 지원 | ✅ 목록/정렬에 사용 |
   | `country`, `institute`, `correspondingAuthor` | ✅ Dataview 등으로 조회·필터 | ✅ 국가·기관·교신저자 필터/검색 |
   | `category` (메뉴용) | ✅ Dataview로 그룹 조회 | ✅ 상단 메뉴별 스크랩 모음 (Paper, Technical Tips 등) |
   | 본문 `[[링크]]`, `#태그` | ✅ 그래프·백링크 동작 | 본문 렌더 시 링크는 선택적으로 변환 또는 유지 |
   | 한 파일 = 한 노트 | ✅ 그래프에서 1노드 1파일 | ✅ 1파일 = 검색 결과 1건 |

   **저장 위치 권장**: `content/scraps/` (이 폴더를 Obsidian에서 열거나, vault 하위로 추가하면 동기화 유지 가능)

   **메뉴용 카테고리 (category)**  
   웹사이트 **상단 메뉴**를 카테고리로 나누고, 메뉴 클릭 시 해당 카테고리에 속한 스크랩만 모아서 보여 주는 방식을 권장합니다. 예: 메뉴 "Paper" → 학술 논문 스크랩 모음, "Technical Tips" → 기술 팁 스크랩 모음. **category**는 사용자가 콘텐츠를 **직관적으로 찾는 메뉴 구조**에 쓰고, **tags**는 세부 키워드 검색·관계 맵(노드·엣지)에 그대로 사용하면 됩니다. 관계 맵은 태그 기준으로 그리되, 필요 시 카테고리별로 필터링해 볼 수 있게 할 수 있습니다.

   - **구현**: 사이트 설정(예: `config.js`)에 메뉴 목록을 정의 (예: `["Paper", "Technical Tips", "News", "Tutorials"]`)하고, 각 스크랩 frontmatter에 `category: "Paper"` 등 **하나(또는 복수)** 지정. 라우트는 예: `/archive`, `/archive/Paper`, `/archive/Technical-Tips` 형태로 두고, 경로에 따라 해당 category만 필터해 표시.
   - **Obsidian**: `category` 역시 일반 YAML 키이므로 Dataview로 폴더처럼 그룹 조회 가능 (예: `WHERE category = "Paper"`).

   **추가로 고려할 스크랩 메타 (카테고리·필드)**  
   스크래핑 시 아래 메타를 함께 수집·기입하면 필터·검색·정렬·표시에 유리합니다. 모두 YAML frontmatter이므로 Obsidian(Dataview)과 호환됩니다.

   | 메타 카테고리 | 권장 필드 (키) | 타입 | 설명 | 예시 |
   |---------------|----------------|------|------|------|
   | **메뉴용 카테고리** | `category` / `categories` | 문자열 또는 배열 | 상단 메뉴 항목과 1:1 대응. 해당 메뉴에 스크랩 모음 표시 | `"Paper"`, `"Technical Tips"`, `["Paper", "Tutorials"]` |
   | **콘텐츠 유형** | `type` / `contentType` | 문자열 | 논문/뉴스/블로그/튜토리얼 등 | `"paper"`, `"news"`, `"blog"`, `"conference"`, `"patent"`, `"poster"` |
   | **언어** | `language` | 문자열 (ISO 639-1) | 본문 언어. 다국어 필터용 | `"en"`, `"ko"`, `"zh"` |
   | **출판 정보** | `venue` / `journal` / `conference` | 문자열 | 게재처·학회·저널명 | `"Nature"`, `"CHI 2024"` |
   | **식별자** | `doi`, `pmid`, `arxiv`, `isbn` | 문자열 | 논문·도서 식별. 인용·링크 생성용 | `doi: "10.1234/..."` |
   | **요약** | `abstract` / `summary` | 문자열 | 짧은 요약. 카드·미리보기용 | 한두 문장 |
   | **썸네일** | `image` / `thumbnail` | 문자열 (URL) | 카드·OG 이미지 | `"https://..."` 또는 `/images/xxx.jpg` |
   | **수집 시점** | `scrapedAt` / `collectedAt` | 문자열 (ISO 8601) | 스크랩한 날시. 신선도·정렬용 | `"2025-02-14T12:00:00Z"` |
   | **도메인/대분류** | `domain` / `topic` | 문자열 또는 배열 | 분야(태그보다 상위). 예: ML, NLP, HCI | `"ML"`, `["NLP", "HCI"]` |
   | **상태** | `status` | 문자열 | 초안/검토완료/아카이브 등 (선택) | `"archived"`, `"reviewed"` |
   | **중요도·관련도** | `importance` / `relevance` | 숫자 (0–1 또는 1–5) | 정렬·하이라이트용 (선택) | `0.8` 또는 `4` |
   | **URL 슬러그** | `slug` | 문자열 | 고정 URL 경로. 사람이 읽기 좋은 ID | `"gartner-hype-2024"` |
   | **라이선스** | `license` | 문자열 | 원문 라이선스. 표시·이용 범위 참고 | `"CC-BY"`, `"all-rights-reserved"` |

   - **Obsidian**: 위 필드 모두 일반 YAML이므로 Dataview로 조회·필터 가능. `type`, `language`, `domain` 등으로 그룹/테이블 뷰 구성에 적합합니다.
   - **웹사이트**: 콘텐츠 유형·언어·venue·도메인으로 필터, `scrapedAt`·`importance`로 정렬, `abstract`·`image`로 카드 미리보기, `doi`/`slug`로 상세 페이지 링크 생성에 활용할 수 있습니다.

2. **빌드 시점**: `public/content/scraps/` 아래 마크다운을 읽어 `scraps-index.json` 생성 (Node 스크립트)  
   또는  
   **런타임**: `public/content/scraps/*.md`를 `fetch`로 불러와 파싱 (또는 미리 만들어 둔 `scraps-index.json`만 로드)

3. 검색/정렬: React 상태로 키워드 입력값을 두고, 인덱스 배열을 필터/정렬해 결과만 렌더링 → **완전히 클라이언트에서 동작**

---

### 3. 관계 맵 (콘텐츠 간 관계, 키워드 중요도/영향도)

| 항목 | 가능 여부 | 설명 |
|------|-----------|------|
| 콘텐츠 간 관계 시각화 | ✅ **가능** | 노드-엣지 그래프를 **브라우저에서** 그림 |
| 키워드 중요도·영향도 강조 | ✅ **가능** | 노드 크기/색/라벨로 표현 가능 |

**구현 방향**

- **데이터**: 각 스크랩/콘텐츠의 frontmatter에 `relatedIds: ["id1","id2"]` 또는 공통 `keywords`로 관계 정의  
  중요도/영향도는 `influence: 0.8` 같은 숫자 필드 추가
- **시각화**: [D3.js](https://d3js.org/), [react-force-graph](https://github.com/vasturiano/react-force-graph), [vis-network](https://visjs.org/) 등으로  
  - 노드 = 콘텐츠(또는 키워드), 엣지 = 관계  
  - 노드 크기 = 중요도/영향도
- 데이터는 위에서 만든 `scraps-index.json`에 관계·점수 필드를 넣어 두면 됨 → **전부 정적 JSON으로 처리 가능**

**제한 사항**: 없음. 복잡도는 “관계 데이터 설계 + 라이브러리 선택” 수준입니다.

---

### 4. 하이프 사이클 (Hype Cycle)

| 항목 | 가능 여부 | 설명 |
|------|-----------|------|
| 콘텐츠/도구를 하이프 사이클 위에 배치 | ✅ **가능** | 각 항목에 phase·visibility 메타 저장 후 곡선 위에 점으로 표시 |
| 키워드별 하이프 사이클 | ✅ **가능** | 키워드 필터링 후 해당 콘텐츠만 같은 차트에 표시 |

**구현 방향**

- **데이터**: frontmatter에 예: `hypePhase: "Peak"`, `hypeVisibility: "High"` 또는 `expectation: 0.8`, `visibility: 0.6` 같은 수치
- **차트**:  
  - 배경: 하이프 사이클 곡선을 SVG/Canvas로 그림 (고정 배경)  
  - 점: 각 콘텐츠를 (x=시간/단계, y=기대치) 위치에 표시  
- 키워드 선택 시: 현재 쓰는 `scraps-index.json`에서 해당 키워드 포함 항목만 필터링해 같은 차트에 그리면 됨

**제한 사항**: 없음. 전부 정적 데이터 + 클라이언트 렌더링으로 가능합니다.

---

### 5. 데모 페이지 (성과 데모)

| 항목 | 가능 여부 | 설명 |
|------|-----------|------|
| 데모 전용 페이지 | ✅ **가능** | 새 라우트 `/Demos` 추가 후 링크/iframe/임베드 목록 |

**구현 방향**

- 데모가 **외부 URL**이면: 카드에 제목·설명·링크·썸네일만 넣어서 연결
- **코드 샌드박스/CodePen** 등: iframe 임베드
- **영상**: YouTube/Vimeo 임베드
- **간단한 웹 데모**: 같은 repo의 `docs/` 또는 별도 GitHub Pages 경로에 올린 뒤 iframe으로 넣기

**제한 사항**: 없음.

---

## GitHub Pages 환경의 공통 제약 요약

| 제약 | 대응 |
|------|------|
| 서버 없음 (백엔드 불가) | 모든 로직을 클라이언트(React)에서 처리. 데이터는 JSON/마크다운 등 **정적 파일**로 제공 |
| 실시간 스크래핑 불가 | 스크래핑은 **로컬 스크립트** 또는 **GitHub Actions**로 실행 후, 결과 파일을 repo에 커밋 |
| DB 없음 | 데이터를 JSON/YAML/마크다운 파일로 저장하고, 빌드 시 또는 런타임에 fetch |
| 검색 엔진 수준의 대용량 검색 어려움 | 콘텐츠 수가 수백~수천 개 수준이면 클라이언트 검색으로 충분. 그 이상은 정적 인덱스(예: Lunr.js) 또는 외부 검색 서비스 고려 |

---

## 권장 구현 순서 (단계별)

한 번에 다 하기보다, 아래 순서로 단계를 나누는 것을 권장합니다.

1. **Phase 1 – 사람 & 성과**
   - `members.json`, `publications.json` (및 필요 시 `patents.json`, `posters.json`) 추가
   - 페이지: People(또는 About Lab), Publications(Research) 추가
   - 기존 About Me는 “연구실 소개”로 확장하거나, “People”에서 교수님을 첫 번째로 노출

2. **Phase 2 – 스크랩 & 검색**
   - 스크랩 마크다운 형식·저장 위치 정하기 (`content/scraps/` 등)
   - 스크래핑은 로컬 스크립트 또는 GitHub Actions로 수행 후 마크다운 커밋
   - 빌드 시 또는 수동으로 `scraps-index.json` 생성
   - 페이지: “Archive” 또는 “Scraps” + 키워드 검색/필터 UI

3. **Phase 3 – 관계 맵**
   - 스크랩 메타에 `relatedIds`, `keywords`, 중요도/영향도 필드 추가
   - 관계 맵 전용 페이지 추가, force-graph 등으로 시각화

4. **Phase 4 – 하이프 사이클**
   - 메타에 `hypePhase`, `hypeVisibility` (또는 수치) 추가
   - “Hype Cycle” 페이지 추가, 키워드 필터 연동

5. **Phase 5 – 데모**
   - “Demos” 페이지 추가, 논문/특허/프로젝트별 데모 링크·iframe 정리

---

## 대안/확장 옵션 (제약이 걸릴 때)

- **검색이 매우 많아지면**:  
  - 클라이언트 검색 라이브러리([Lunr.js](https://lunrjs.com/), [FlexSearch](https://github.com/nextapps-de/flexsearch))로 미리 인덱스 생성 후 빌드에 포함  
  - 또는 Algolia 등 외부 검색 서비스(무료 티어 존재)

- **스크래핑을 완전 자동화하고 싶으면**:  
  - GitHub Actions + Python(Beautiful Soup/Scrapy) 또는 Puppeteer  
  - 스크립트를 repo에 두고, schedule로 주기 실행 후 변경분만 커밋

- **나중에 서버가 생기면**:  
  - 지금 설계한 “JSON + 마크다운” 구조를 그대로 API 응답으로 바꿔도 됨.  
  - 프론트는 “fetch URL”만 바꾸면 되어, 지금 정적 구조로 가는 것이 유리합니다.

---

## 기타 중요 고려 사항 (이런 웹사이트에서 두면 좋은 것)

연구실·연구자 웹사이트를 오래 유지하고, 검색·접근성·신뢰를 높이려면 아래 항목도 함께 고려하는 것을 권장합니다.

### 검색 노출·학술 발견 (SEO & Scholarly)

| 항목 | 권장 사항 |
|------|-----------|
| **메타 태그** | 각 페이지별 `title`, `description` (React Helmet 등). 공유 시 미리보기용 **Open Graph** (`og:title`, `og:description`, `og:image`) |
| **Sitemap** | 정적 `sitemap.xml` 생성(빌드 스크립트에 포함) → Google Search Console 제출 |
| **구조화 데이터 (JSON-LD)** | [Schema.org](https://schema.org/) 타입 활용: `Organization`(연구실), `Person`(교수·학생), `ScholarlyArticle`(논문). Google·학술 검색에서 리치 결과에 유리 |
| **논문 페이지** | 논문별 고유 URL + 메타에 DOI, 저자, 연도 → 인용·검색에 도움 |

### 접근성 (Accessibility)

| 항목 | 권장 사항 |
|------|-----------|
| **시맨틱 HTML** | 제목 계층(`h1`→`h2`), `main`, `nav`, `article` 등 적절히 사용 |
| **대체 텍스트** | 이미지·차트에 `alt` 또는 `aria-label` 제공 (관계 맵·하이프 사이클 포함) |
| **키보드·포커스** | 탭 이동, 포커스 표시 유지. 모달·필터는 Esc로 닫기 등 |
| **색 대비** | 라이트/다크 테마 모두에서 텍스트와 배경 대비 충분히 (WCAG AA 수준 권장) |

### 성능·체감 속도

| 항목 | 권장 사항 |
|------|-----------|
| **번들 크기** | 관계 맵·하이프 사이클용 라이브러리(D3, force-graph 등)는 **코드 스플리팅**으로 해당 페이지에서만 로드 |
| **이미지** | 프로필·데모 썸네일은 적절한 크기·포맷(WebP 등). `loading="lazy"` 활용 |
| **데이터 로딩** | 스크랩 인덱스(`scraps-index.json`)가 크면, 빌드 시 인덱스만 두고 상세는 필요 시 로드하는 방식 고려 |

### 스크랩·저작권·윤리

| 항목 | 권장 사항 |
|------|-----------|
| **출처 표기** | 스크랩 frontmatter에 `source` URL 필수. 본문 또는 목록에 "출처: …" 링크 유지 |
| **저작권** | 수집한 콘텐츠의 이용 조건 확인. 요약·메타만 보여 주고 원문은 링크로만 연결하는 방식이 안전 |
| **robots.txt** | 스크랩한 원본 사이트의 정책 준수. 자체 사이트는 검색 허용이 일반적 |

### URL·공유·인용

| 항목 | 권장 사항 |
|------|-----------|
| **고정 URL** | 논문/스크랩/데모별 고유 경로 (예: `/publications/2024-xxx`, `/archive/note-id`) → 북마크·인용 시 유리 |
| **해시 라우터** | 현재 `HashRouter` 사용 시 URL이 `#/Archive` 형태. 공유를 더 깔끔하게 하려면 GitHub Pages에서 BrowserRouter + 404 리다이렉트 방식 검토 가능(선택) |
| **인용 내보내기** | Publications 페이지에 **BibTeX** 또는 **RIS** 다운로드 링크 제공 시 연구자 UX 크게 향상 |

### 다국어·콘텐츠 신선도

| 항목 | 권장 사항 |
|------|-----------|
| **다국어** | 한국어/영어 동시 제공 시: 데이터에 `titleKo`/`titleEn` 등 분리하거나 i18n 라이브러리 도입. 초기에는 한 언어로 시작해도 무방 |
| **콘텐츠 갱신** | 마크다운·JSON 수정 후 **빌드·배포**가 필요. GitHub Actions로 `main` 푸시 시 자동 빌드·배포 설정해 두면 편함 |

### 운영·유지보수

| 항목 | 권장 사항 |
|------|-----------|
| **데이터 형식 버전** | `members`, `publications`, 스크랩 frontmatter 스키마를 문서화해 두고, 필드 추가 시 **하위 호환** 유지 (기존 필드 이름 변경은 최소화) |
| **문서화** | 이 로드맵 문서처럼 "어디에 어떤 데이터를 두는지", "스크랩 메타 필드 정의"를 `docs/`에 유지 → 나중에 본인·팀원이 수정할 때 유리 |
| **분석(선택)** | 방문 통계가 필요하면 **쿠키 없이 동작하는 분석**(예: Plausible) 또는 GitHub 트래픽만 활용. 개인정보 최소화 권장 |

---

## 요약 표

| 기능 | GitHub Pages에서 가능? | 비고 |
|------|------------------------|------|
| 교수·학생 프로필 & 성과(논문/특허/포스터) | ✅ 가능 | JSON/정적 데이터 + 새 페이지 |
| 스크랩 마크다운 + 메타(키워드) | ✅ 가능 | 스크래핑은 외부/로컬/Actions |
| 키워드 검색·정렬 | ✅ 가능 | 클라이언트 검색 |
| 관계 맵 (콘텐츠·키워드 중요도) | ✅ 가능 | D3/force-graph 등 |
| 하이프 사이클 (전체·키워드별) | ✅ 가능 | 메타 + SVG/Canvas |
| 데모 페이지 | ✅ 가능 | 링크/iframe/임베드 |

**결론**: 말씀하신 기능은 **GitHub Pages만으로도 모두 실현 가능**합니다.  
불가능한 부분은 “사이트 서버에서의 실시간 스크래핑” 하나이며, 이는 **스크래핑을 repo 밖(로컬/Actions/외부 서비스)에서 하고 결과만 마크다운/JSON으로 커밋**하는 방식으로 해결할 수 있습니다.

원하시면 Phase 1(프로필·성과 데이터 구조 + People/Publications 페이지)부터 구체적인 파일 구조와 React 컴포넌트 예시를 이어서 작성해 드리겠습니다.

---

## 검토 및 수정 이력 (사이트 반영 후)

- **NavBar**: `/Archive/Paper` 등 서브경로에서도 "Archive" 메뉴가 active로 표시되도록 `pathname.startsWith("/Archive")` 조건 추가.
- **페이지 제목**: People, Publications, Archive에 `updateTitle`로 문서 제목 설정. `config.js`에 `siteName` 추가 후 `"People | Lab"` 형태로 통일.
- **접근성**: 로딩 시 `aria-busy`, `aria-live`, Spinner에 `role="status"` 및 `aria-label` 추가. Archive 검색/국가 필터에 `aria-label`, 검색 입력은 `type="search"`. Publications 타입 필터 Badge에 `tabIndex={0}` 및 `onKeyDown`(Enter/Space)로 키보드 조작 지원, 그룹에 `role="group"` 및 `aria-label` 추가.
- **SEO/시맨틱**: 각 페이지 메인 제목을 `Title size="h1"`로 변경(한 페이지당 h1 하나).
- **Publications**: `typeLabel`에 "other" 추가. 타입 Badge는 `bg="primary"` 유지.

**2차 검토 (추가 수정)**

- **Home / AllProjects**: `userData`가 로딩 전일 때 `updateTitle`이 "undefined | …"가 되지 않도록 `userData?.name` 체크 후 타이틀 설정. `siteName` 사용으로 통일.
- **NotFound**: 문서 제목을 `Page not found | ${siteName}` 형태로 변경.
- **Archive**: 카테고리 "All"이 알 수 없는 slug(예: `/Archive/Unknown`)일 때도 선택된 상태로 표시되도록 `c.id === "all" && categoryId === "all"` 조건 추가. 스크랩 카드 제목을 `source`가 있으면 링크로 표시(새 탭, `aria-label` 포함). 제목/본문 없을 때 "Untitled" 표시.
- **People**: 이름·역할 없을 때 "—", 아바타 이니셜 없을 때 "?" 표시. 이니셜은 `toUpperCase()` 적용.
- **Publications**: 제목 없을 때 "Untitled" 표시.

**3차 검토 (추가 수정)**

- **index.html**: 기본 `<title>`을 "Research Lab"으로 변경. og:title, og:description, og:site_name, twitter:image:alt를 연구실 사이트에 맞게 수정(초기 로드·캐럴러용).
- **People / Publications / Archive**: 스크롤 시 "맨 위로" 버튼 표시. `ScrollToTopButton` 컴포넌트 추가(스크롤 400px 초과 시 표시, 클릭 시 `window.scrollTo` smooth).
