# Content (md 기반 자료)

편집 가능한 자료는 **public/content/** 아래 마크다운(.md)으로 두고, 빌드 시 `public/data/*.json`으로 생성됩니다.  
옵시디언 등에서 **public/content** 폴더를 루트로 열면 md와 이미지 경로가 그대로 보입니다.

| 폴더 / 파일 | 생성되는 JSON | 사용 페이지 |
|-------------|----------------|------------|
| **professor.md** | `public/data/professor.json` | Professor |
| **people/*.md** | `public/data/members.json` | People |
| **scraps/*.md** | `public/data/scraps-index.json` | Archive |

- **이미지·PDF**: `content/files/` 에 두고, md에서는 `../files/이미지.png` 또는 사이트 기준 `/content/files/이미지.png` 로 참조.
- **빌드**: `npm run build` 시 `build:scraps` → `build:content` → React 빌드 순으로 실행됩니다.
- 각 하위 폴더의 README에 frontmatter 형식이 정리되어 있습니다.
