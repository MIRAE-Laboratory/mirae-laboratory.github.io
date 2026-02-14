# People (멤버)

각 멤버는 **한 개의 마크다운(.md) 파일**로 작성합니다. 파일명(확장자 제외)이 `id`가 됩니다.

## Frontmatter

| 필드 | 필수 | 설명 |
|------|------|------|
| name | ✓ | 이름 |
| role | | 직함 (예: Graduate Student) |
| bio | | 짧은 소개 |
| avatar | | 프로필 이미지 URL |
| email | | 이메일 |
| link | | 개인/연구실 링크 |
| researchAreas | | 연구 분야 (아래처럼 리스트) |
| order | | 정렬 순서 (숫자, 작을수록 먼저) |

## researchAreas 예시

```yaml
researchAreas:
  - AI
  - NDT
```

또는 한 줄: `researchAreas: "AI, NDT"`

빌드 시 `npm run build:content`가 이 폴더의 .md를 읽어 `public/data/members.json`을 생성합니다.
