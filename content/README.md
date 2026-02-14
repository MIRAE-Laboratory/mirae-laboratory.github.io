# Content (md 기반 자료)

편집 가능한 자료는 모두 **마크다운(.md)** 또는 **JSON**으로 두고, 빌드 시 `public/data/*.json`으로 생성됩니다.

| 폴더 / 파일 | 생성되는 JSON | 사용 페이지 |
|-------------|----------------|------------|
| **professor.md** | `public/data/professor.json` | Professor |
| **people/*.md** | `public/data/members.json` | People |
| **scraps/*.md** | `public/data/scraps-index.json` | Archive |

- **빌드**: `npm run build` 시 `build:scraps` → `build:content` → React 빌드 순으로 실행됩니다.
- **로컬**: `npm start` 전에 위 스크립트가 자동 실행되므로, md/JSON만 수정하면 됩니다.
- 각 하위 폴더의 README에 frontmatter 형식이 정리되어 있습니다.
