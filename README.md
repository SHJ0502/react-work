🛒 풀스택 쇼핑몰 프로젝트
🚀 프로젝트 개요
이 프로젝트는 React (Next.js) 기반의 프론트엔드와 Node.js (Express) 기반의 백엔드를 MySQL 데이터베이스와 연동하여 구축한 풀스택 쇼핑몰 애플리케이션입니다. 사용자 인증 (일반 로그인 및 소셜 OAuth), 상품 관리 (CRUD), 그리고 반응형 UI를 통해 실제 서비스와 유사한 경험을 제공하는 것을 목표로 합니다.

✨ 주요 기능
사용자 인증:

이메일/비밀번호 기반의 일반 로그인 (추후 구현 예정)

네이버 OAuth 2.0을 활용한 소셜 로그인

카카오 OAuth 2.0을 활용한 소셜 로그인

JWT(JSON Web Token)를 이용한 사용자 세션 관리

상품 관리 (CRUD):

상품 조회: 등록된 모든 상품 목록을 확인합니다.

상품 추가: 새로운 상품 정보를 등록합니다. (이름, 가격, 재고 등)

상품 수정: 기존 상품 정보를 업데이트합니다.

상품 삭제: 불필요한 상품을 삭제합니다.

사용자 친화적인 폼과 목록 UI를 제공합니다.

반응형 웹 디자인: Tailwind CSS를 활용하여 모바일, 태블릿, 데스크톱 등 다양한 디바이스에서 최적화된 사용자 경험을 제공합니다.

API 통신: axios 라이브러리를 사용하여 프론트엔드와 백엔드 간의 효율적인 데이터 통신을 구현합니다.

데이터베이스 연동: MySQL 데이터베이스를 사용하여 상품, 사용자, 주문 등의 데이터를 영구적으로 저장하고 관리합니다.

💻 기술 스택
프론트엔드 (Frontend)
React: 사용자 인터페이스 구축을 위한 JavaScript 라이브러리

Next.js: React 애플리케이션을 위한 프레임워크 (App Router 사용, SSR/SSG 지원)

Tailwind CSS: 유틸리티 우선(Utility-first) CSS 프레임워크로 빠르고 유연한 스타일링

Axios: HTTP 클라이언트 라이브러리 (API 요청 처리)

JavaScript (ES6+)

HTML5 / CSS3

백엔드 (Backend)
Node.js: JavaScript 런타임 환경

Express.js: Node.js를 위한 웹 애플리케이션 프레임워크

MySQL: 관계형 데이터베이스 관리 시스템

mysql2/promise: Node.js에서 MySQL과 연동하기 위한 비동기 드라이버

dotenv: 환경 변수 관리를 위한 라이브러리

cors: 교차 출처 리소스 공유(CORS) 처리 미들웨어

jsonwebtoken (JWT): JSON Web Token을 생성 및 검증

axios: 외부 API (OAuth) 호출에 사용

⚙️ 개발 환경 설정
이 프로젝트를 로컬에서 실행하기 위해서는 프론트엔드와 백엔드 각각의 설정이 필요합니다.

전제 조건
Node.js: LTS 버전 (npm 또는 Yarn 포함)

MySQL: 로컬 또는 원격 MySQL 서버 인스턴스

DBeaver (또는 MySQL Workbench): 데이터베이스 스키마 생성 및 데이터 삽입을 위해 권장

1. 백엔드 설정 (backend/)
프로젝트 클론:

git clone https://github.com/SHJ0502/velero-dashboard-go.git # 또는 해당 쇼핑몰 프로젝트 저장소
cd velero-dashboard-go/backend # 백엔드 디렉토리로 이동

의존성 설치:

npm install

MySQL 데이터베이스 설정:

DBeaver 등에서 shopDB (또는 원하는 이름) 데이터베이스를 생성합니다.

shopping-mall-db-schema-mysql-final-execution Artifact에 있는 SQL DDL 스크립트를 사용하여 users, products, orders, order_items 테이블을 생성합니다.

insert-sample-products-mysql-again Artifact에 있는 SQL을 사용하여 샘플 상품 데이터를 삽입합니다.

환경 변수 설정:
backend/ 디렉토리 내에 .env 파일을 생성하고 다음 내용을 추가합니다.

YOUR_MYSQL_ROOT_PASSWORD는 실제 MySQL 비밀번호로 변경해야 합니다.

YOUR_NAVER_CLIENT_ID, YOUR_NAVER_CLIENT_SECRET, YOUR_KAKAO_REST_API_KEY, YOUR_KAKAO_CLIENT_SECRET는 각 소셜 로그인 개발자 센터에서 발급받은 값으로 채워 넣어야 합니다.

JWT_SECRET은 임의의 강력한 문자열로 변경하는 것을 권장합니다.

# .env (backend)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_ROOT_PASSWORD
DB_DATABASE=shopDB
DB_PORT=3306

# 네이버 OAuth 환경 변수
NAVER_CLIENT_ID=YOUR_NAVER_CLIENT_ID
NAVER_CLIENT_SECRET=YOUR_NAVER_CLIENT_SECRET
NAVER_CALLBACK_URL=http://localhost:5000/api/auth/naver/callback

# 카카오 OAuth 환경 변수
KAKAO_REST_API_KEY=YOUR_KAKAO_REST_API_KEY
KAKAO_CLIENT_SECRET=YOUR_KAKAO_CLIENT_SECRET # Client Secret을 활성화했다면 필요
KAKAO_CALLBACK_URL=http://localhost:5000/api/auth/kakao/callback

# JWT 시크릿 키
JWT_SECRET=R2o8zX7yV1uW3tS5qP7oN9mL1kI3jH5gF7eD9cB1aZ3xY5wV7uT9sR1qP3oN5mL7kI9jH1gF3eD5cB7aZ9xY

백엔드 서버 실행:

npm start # 또는 node index.js

서버가 http://localhost:5000에서 실행됩니다.

2. 프론트엔드 설정 (frontend/)
프론트엔드 디렉토리로 이동:

cd ../frontend # 백엔드 디렉토리에서 이동
# 또는 git clone 후 cd velero-dashboard-go/frontend

의존성 설치:

npm install

환경 변수 설정:
frontend/ 디렉토리 내에 .env.local 파일을 생성하고 다음 내용을 추가합니다.

# .env.local (frontend)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

프론트엔드 애플리케이션 실행:

npm run dev

애플리케이션이 개발 모드로 시작되며, 일반적으로 http://localhost:3000에서 접근할 수 있습니다.

🤝 기여 방법
이 프로젝트는 오픈 소스로 개발되며, 여러분의 기여를 환영합니다!

저장소를 Fork 합니다.

새로운 브랜치를 생성합니다 (git checkout -b feature/your-feature-name).

변경 사항을 커밋합니다 (git commit -m 'feat: Add new feature').

원격 저장소에 푸시합니다 (git push origin feature/your-feature-name).

Pull Request를 생성합니다.

📄 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.