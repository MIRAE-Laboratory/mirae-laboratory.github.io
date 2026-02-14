# Scraps (Archive 소스)

각 스크랩은 **한 개의 마크다운(.md) 파일**로 작성합니다.

- 파일 위치: `content/scraps/*.md`
- 파일명(확장자 제외)이 URL용 `slug`가 됩니다. frontmatter에서 `slug`로 덮어쓸 수 있습니다.
- **빌드 시** `npm run build:scraps`가 이 폴더의 모든 `.md`를 읽어 `public/data/scraps-index.json`을 생성합니다.
- Archive 페이지는 그 인덱스를 불러와 목록·필터·검색에 사용합니다.

## Frontmatter (YAML)

`config.js`의 `archiveCategories`와 맞추면 됩니다.

| 필드 | 필수 | 설명 |
|------|------|------|
| title | ✓ | 제목 |
| date | | 날짜 (예: "2025-02-14") |
| category | | Paper / Technical Tips / News / Tutorials 중 하나 |
| tags | | 문자열 배열 (예: `- ML` 줄 여러 개) |
| source | | 원문 URL |
| country | | 국가 |
| institute | | 소속 기관 |
| correspondingAuthor | | 교신저자 |
| abstract | | 요약 (목록 카드에 표시) |
| type | | paper, blog, news, tutorial 등 |
| language | | en, ko 등 |

## 예시

```yaml
---
title: 논문 또는 노트 제목
date: "2025-02-14"
category: Paper
tags:
  - ML
  - survey
source: https://arxiv.org/abs/...
country: South Korea
institute: Seoul National University
abstract: 한 줄 요약.
type: paper
language: ko
---

# 본문

마크다운 본문은 추후 상세 페이지에서 사용할 수 있습니다.
```

새 `.md` 파일을 추가한 뒤 `npm run build`(또는 `npm run build:scraps`)를 다시 실행하면 인덱스에 반영됩니다.
