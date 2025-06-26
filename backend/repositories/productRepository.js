// db.js에서 생성한 MySQL 연결 풀을 가져옵니다.
const pool = require('../db'); // '../db'는 backend 폴더의 db.js를 참조합니다.

/**
 * 모든 상품 목록을 데이터베이스에서 조회합니다.
 * @returns {Array} 상품 객체 배열
 */
async function getAllProducts() {
    let connection; // connection 변수를 try 블록 밖에서 선언
    try {
        connection = await pool.getConnection(); // 연결 풀에서 연결을 가져옵니다.
        // products 테이블에서 모든 상품을 선택하는 쿼리 (id 순으로 정렬)
        const [results] = await connection.execute(
            'SELECT id, name, description, price, stock_quantity, image_url, category, created_at, updated_at FROM products ORDER BY id ASC'
        );
        return results; // 조회된 상품 배열 반환
    } catch (err) {
        console.error('Error in getAllProducts:', err.stack);
        throw new Error('상품 목록을 가져오는데 실패했습니다.'); // 에러를 상위로 던져서 처리
    } finally {
        if (connection) connection.release(); // 연결이 있었다면 연결을 반환합니다.
    }
}

/**
 * 새로운 상품을 데이터베이스에 추가합니다.
 * @param {Object} productData - 상품 정보 객체 (name, description, price, stock_quantity, image_url, category)
 * @returns {Object} 새로 생성된 상품 객체 (ID 포함)
 */
async function createProduct(productData) {
    const { name, description, price, stock_quantity, image_url, category } = productData;

    // 필수 필드 유효성 검사는 API 계층에서 처리하지만, Repository도 자체적인 방어를 할 수 있습니다.
    if (!name || price === undefined || stock_quantity === undefined) {
        throw new Error('상품 이름, 가격, 재고 수량은 필수입니다.');
    }

    let connection; // connection 변수를 try 블록 밖에서 선언
    try {
        connection = await pool.getConnection(); // 연결 풀에서 연결을 가져옵니다.
        
        // products 테이블에 새 상품을 삽입하는 SQL 쿼리
        // ?는 플레이스홀더이며, 배열로 전달된 값들이 순서대로 매핑됩니다.
        const [result] = await connection.execute(
            'INSERT INTO products(name, description, price, stock_quantity, image_url, category) VALUES(?, ?, ?, ?, ?, ?)',
            [name, description, price, stock_quantity, image_url, category]
        );
        
        // MySQL의 execute는 insertId를 반환하므로, 이를 사용하여 새로 삽입된 상품을 조회합니다.
        const [newProductRows] = await connection.execute(
            'SELECT id, name, description, price, stock_quantity, image_url, category, created_at, updated_at FROM products WHERE id = ?',
            [result.insertId]
        );
        
        // 새로 삽입된 상품 정보를 반환합니다.
        return newProductRows[0]; 
    } catch (err) {
        console.error('Error in createProduct:', err.stack);
        throw new Error('새 상품을 추가하는데 실패했습니다.'); // 에러를 상위로 던져서 처리
    } finally {
        if (connection) connection.release(); // 연결이 있었다면 연결을 반환합니다.
    }
}

// 이 함수들을 외부에서 사용할 수 있도록 내보냅니다.
module.exports = {
    getAllProducts,
    createProduct
};
