# AI 온보딩 에듀테크 랩 (AI Onboarding EduTech Lab)

AI 온보딩 에듀테크 랩의 랜딩 페이지 소스 코드입니다.

## 📁 파일 구조
- `index.html`: 메인 랜딩 페이지
- `course_detail.html`: 학생용 커리큘럼 상세 (C-001)
- `course_detail_general.html`: 일반인용 커리큘럼 상세 (G-002)
- `course_detail_worker.html`: 직장인용 커리큘럼 상세 (W-001)
- `course_detail_edu.html`: 교육관계자용 커리큘럼 상세 (E-001)
- `hero_image.png`: 히어로 섹션 이미지

## 🚀 웹사이트 배포 방법 (누구나 볼 수 있게 만들기)

가장 쉽고 빠른 두 가지 방법을 추천합니다.

### 방법 1: Netlify Drop (가장 쉬움, 1분 소요)
로그인이나 설치 없이 바로 링크를 만들 수 있습니다.

1. [Netlify Drop](https://app.netlify.com/drop) 사이트에 접속합니다.
2. 컴퓨터의 `ailanding` 폴더 전체를 드래그해서 브라우저 창에 놓습니다.
3. 업로드가 완료되면 즉시 '랜덤 주소'가 생성되어 접속 가능합니다.
4. (선택) 회원가입을 하면 주소를 내가 원하는대로(예: `ai-edutech-lab.netlify.app`) 바꿀 수 있습니다.

### 방법 2: GitHub Pages (안정적, 업데이트 용이)
GitHub 계정이 있다면 이 방법을 추천합니다.

1. GitHub에 새 저장소(New Repository)를 만듭니다.
2. 터미널에서 다음 명령어로 코드를 GitHub에 올립니다.
   ```bash
   git remote add origin [저장소 주소]
   git push -u origin main
   ```
3. GitHub 저장소의 **Settings > Pages** 메뉴로 이동합니다.
4. **Source**를 `Deploy from a branch`, **Branch**를 `main`으로 설정하고 Save를 누릅니다.
5. 1~2분 후 `.github.io`로 끝나는 주소가 생성됩니다.

## 🛠️ 수정 방법
`index.html` 및 각 `html` 파일을 메모장이나 코드 에디터(VS Code 등)로 열어 텍스트를 수정하면 됩니다.
