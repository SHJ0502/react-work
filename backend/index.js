//index.js (backend)

//필요한 모듈들을 가져온다
const express = require('express');
const cors = require('cors');
require('dotenv').config(); //.env 파일의 환경변수를 로드한다.

// MySQL 연결 풀은 db.js에서 가져옵니다. (연결 테스트는 db.js에서 이미 수행됩니다)
require('./db'); // 이 파일이 실행되면서 db.js의 연결 풀이 초기화됩니다.

// productRepository를 임포트하여 데이터베이스 로직을 사용합니다.
const productRoutes = require('./routes/productRoutes'); // 상품 라우트 임포트
// const userRoutes = require('./routes/userRoutes');   // 나중에 사용자 라우트 임포트
// const orderRoutes = require('./routes/orderRoutes');   // 나중에 주문 라우트 임포트

// express 애플리케이션을  생성합니다.
const app = express();

// CORS 미들웨어를 사용한다. ( 모든 도메인에서의 요청을 허용)
// 실제 운영 환경에서는 특정 도메인만 허용하도록 설정하는 것이 좋다.
app.use(cors());

// JSON 형식의 요청본문을 파싱하기 위한 미들웨어
app.use(express.json());

// 첫번쨰 API 엔드포인트 정의 : 루트 경로('/')로 GET 요청이 오면 응답한다.
app.get('/', (req, res) => {
    res.send('Hello, from Backend with MySQL Repository!');
});

// 라우트 미들웨어 연결
app.use('/api/products', productRoutes); // '/api/products' 경로로 오는 요청을 productRoutes가 처리
// app.use('/api/users', userRoutes);     // '/api/users' 경로로 오는 요청을 userRoutes가 처리
// app.use('/api/orders', orderRoutes);   // '/api/orders' 경로로 오는 요청을 orderRoutes가 처리

// 서버가 리슨할 포트 번호를 설정한다.
const PORT = process.env.PORT || 5000;

// 서버를 시작한다.
app.listen(PORT, () => {
    console.log(`Backend Server is running on http://localhost:${PORT}`);
});