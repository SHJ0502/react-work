// mysql2 모듈에서 createPool 함수를 임포트합니다.
const mysql = require('mysql2/promise'); // 'promise' 버전을 사용하여 async/await 지원

// MySQL 연결 설정
// !!! 중요: 이제 .env 파일에서 환경 변수를 읽어옵니다. !!!
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',          // .env 파일의 DB_HOST 사용
    user: process.env.DB_USER || 'root',               // .env 파일의 DB_USER 사용
    password: process.env.DB_PASSWORD,                 // .env 파일의 DB_PASSWORD 사용
    database: process.env.DB_DATABASE || 'shopdb',     // .env 파일의 DB_DATABASE 사용
    port: process.env.DB_PORT || 3306,                 // .env 파일의 DB_PORT 사용
    waitForConnections: true,  // 연결 풀에서 사용 가능한 연결을 기다릴지 여부
    connectionLimit: 10,       // 최대 연결 수
    queueLimit: 0              // 큐에 대기할 요청의 최대 수 (0 = 무제한)
};

// MySQL 연결 풀 생성 및 내보내기
const pool = mysql.createPool(dbConfig);

// 데이터베이스 연결 테스트 (선택 사항이지만 권장)
pool.getConnection()
    .then(connection => {
        console.log('MySQL database connection pool created successfully!');
        connection.release(); // 연결 반환
    })
    .catch(err => {
        console.error('Error creating MySQL connection pool:', err.stack);
        // 심각한 연결 에러 발생 시 서버를 종료하여 명확히 알립니다.
        process.exit(1); 
    });

module.exports = pool; // 다른 파일에서 pool 객체를 사용할 수 있도록 내보냅니다.
