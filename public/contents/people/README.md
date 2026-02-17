# People (멤버)

각 멤버는 **한 개의 .md 파일**로 작성합니다. 파일명(확장자 제외)이 `id`가 됩니다.

## 프로필 이미지 (avatar)

같은 폴더(`public/contents/people/`)에 있는 이미지는 **파일명만** 적으면 됩니다.

```yaml
avatar: Inhye_Park.png
```

- **파일명만** (예: `Inhye_Park.png`) → 빌드 시 자동으로 `/contents/people/Inhye_Park.png` 로 변환됩니다.
- **절대 경로** (예: `/contents/people/이름.png`) 또는 **외부 URL** (`https://...`) 도 그대로 사용 가능합니다.

## Frontmatter

| 필드 | 필수 | 설명 |
|------|------|------|
| name | ✓ | 이름 |
| role | | 직함 |
| bio | | 짧은 소개 |
| avatar | | 프로필 이미지 (위 참고) |
| email | | 이메일 |
| link | | 개인/연구실 링크 |
| researchAreas | | 연구 분야 (리스트 또는 "A, B" 문자열) |
| order | | 정렬 순서 (숫자, 작을수록 먼저) |

빌드 시 `public/data/members.json`이 생성됩니다.
