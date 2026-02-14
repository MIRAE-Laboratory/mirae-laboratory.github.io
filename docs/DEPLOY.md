# GitHub Pages 배포 방법

## 왜 `git push`만 하면 사이트가 안 바뀌나요?

이 프로젝트는 **Create React App + gh-pages** 방식입니다.

- **`main` 브랜치**: 소스 코드(React, `src/`, `public/` 등)가 올라가는 곳입니다.
- **실제 웹사이트**: **`gh-pages` 브랜치**에 있는 **빌드 결과물**(`build/` 폴더)만 GitHub Pages가 서비스합니다.

그래서 **`git push`만 하면 `main`에 소스만 올라가고, `gh-pages`는 그대로**라서  
브라우저에서 보는 https://mirae-laboratory.github.io 는 **예전 상태**로 보입니다.

---

## 사이트를 갱신하려면

코드 수정 후 **아래 순서**로 진행하세요.

1. **의존성 설치** (처음 한 번, 또는 `node_modules`가 없을 때)
   ```bash
   npm install
   ```
   - `react-scripts`를 찾을 수 없다는 오류가 나오면, 이 단계를 먼저 실행하세요.

2. **로컬에서 빌드 & 배포**
   ```bash
   npm run deploy
   ```
   - 이 명령이 `npm run build`로 `build/` 폴더를 만들고  
   - **`gh-pages` 브랜치에 `build/` 내용만 푸시**합니다.
   - 그 후 몇 분 지나면 https://mirae-laboratory.github.io 에 반영됩니다.

3. **(선택) 소스도 GitHub에 남기고 싶다면**
   ```bash
   git add .
   git commit -m "메시지"
   git push origin main
   ```
   - 이건 **소스 백업/버전 관리**용이고, **사이트 갱신과는 별개**입니다.

---

## 요약

| 하고 싶은 일           | 해야 할 것        |
|------------------------|-------------------|
| **실제 사이트를 바꾸기** | `npm run deploy`  |
| **소스만 GitHub에 올리기** | `git push origin main` |

**둘 다 하려면**: `git push`로 소스 올린 뒤, **반드시 `npm run deploy`를 한 번 더 실행**해야 웹사이트에 변경 내용이 보입니다.

---

## 배포했는데 화면이 안 바뀌어요

### 1. GitHub Pages가 `gh-pages` 브랜치를 쓰는지 확인

`npm run deploy`는 **`gh-pages` 브랜치**에만 올립니다.  
GitHub이 **다른 브랜치**(예: `main`)를 보고 있으면, 아무리 deploy 해도 예전 내용만 보입니다.

**확인 방법**

1. GitHub에서 저장소 열기 → **Settings** → 왼쪽에서 **Pages**
2. **Build and deployment** → **Source**가 **Deploy from a branch**인지 확인
3. **Branch**를 **`gh-pages`** / **`/(root)`** 로 설정
4. Save 후 1–2분 기다리기

처음에 **main**으로 되어 있었다면, 여기서 **gh-pages**로 바꾼 뒤 다시 **https://mirae-laboratory.github.io** 에 접속해 보세요.

### 2. 캐시 / 주소

- **강력 새로고침**: Ctrl+Shift+R (Windows) 또는 Cmd+Shift+R (Mac)
- **시크릿(프라이빗) 창**에서 같은 주소로 접속
- 이 앱은 **Hash 라우터**를 쓰므로, **https://mirae-laboratory.github.io/#/** 처럼 `#/`까지 있는 주소로 접속해 보기

### 3. 배포 지연

GitHub Pages 반영에는 보통 1–3분 걸립니다. 조금 기다린 뒤 다시 접속해 보세요.

### 4. 브라우저·서비스 워커 캐시 (배포는 됐는데 화면만 안 바뀔 때)

배포는 정상인데, **예전에 접속했던 브라우저**에서는 계속 옛날 화면만 보일 수 있습니다.  
이 프로젝트는 **서비스 워커**로 오프라인 캐시를 쓰기 때문에, 한 번 캐시된 페이지가 오래 유지됩니다.

**다음 순서대로 해보세요.**

1. **시크릿(프라이빗) 창**에서  
   **https://mirae-laboratory.github.io/#/**  
   주소를 **처음부터 새로** 열어 보세요. (다른 탭이 아니라 새 시크릿 창)
2. 그래도 예전 화면이면, **같은 사이트**에서 **캐시와 서비스 워커를 지우세요**:
   - **Chrome / Edge**: F12 → **Application** 탭 → 왼쪽 **Storage** → **Clear site data** 한 번 클릭  
     그 다음 **Application** → **Service Workers** → **Unregister** (있다면)
   - **Firefox**: F12 → **Storage** 탭 → **Clear All** (해당 사이트 기준)
3. 탭을 **완전히 닫은 뒤**, 다시 **https://mirae-laboratory.github.io/#/** 로 접속해 보세요.

시크릿 창에서 **새 화면(People, Publications, Archive 메뉴 등)**이 보이면, 배포는 된 것이고 기존 브라우저 캐시/서비스 워커만 지우면 됩니다.

---

## `npm run deploy` 시 `Error: spawn ENAMETOOLONG` (Windows)

Windows에서 **경로가 긴 폴더**(예: `C:\OneDrive\MIRAE\mirae-laboratory.github.io`)에서 `gh-pages`가 Git 명령을 실행할 때 **명령줄 길이 제한**에 걸려 이 오류가 날 수 있습니다.

**해결 방법 (둘 중 하나)**

### 방법 1: GitHub Actions로 배포 (권장)

로컬에서 `npm run deploy`를 하지 않고, **푸시할 때마다 자동으로 빌드·배포**되게 할 수 있습니다.

1. 이 저장소에 **`.github/workflows/deploy.yml`** 이 있으면, `main` 브랜치에 `git push`할 때마다 Actions가 빌드 후 GitHub Pages에 배포합니다.
2. **한 번만 설정**: GitHub 저장소 **Settings → Pages** → **Build and deployment** → **Source**를 **GitHub Actions**로 선택해 두세요. (기존에 "Deploy from a branch"였다면 여기서 "GitHub Actions"로 바꾸면 됩니다.)
3. 그 다음부터는 **`git push origin main`**만 하면 자동으로 빌드·배포되고, 몇 분 뒤 사이트가 갱신됩니다. 로컬에서 `npm run deploy`는 실행하지 않아도 됩니다.

### 방법 2: 짧은 경로에서 deploy 실행

1. 프로젝트를 **경로가 짧은 폴더**로 복사하거나 클론합니다.  
   예: `C:\mirae` 또는 `D:\mirae`
2. 그 폴더에서 `npm install` → `npm run build` → `npm run deploy` 실행
3. (선택) Git으로 원격이 연결돼 있다면, 같은 저장소를 짧은 경로에 클론한 뒤 그곳에서만 `npm run deploy`를 실행해도 됩니다.
