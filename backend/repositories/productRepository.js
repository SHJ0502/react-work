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
     * 특정 ID의 상품을 데이터베이스에서 조회합니다.
     * @param {number} id - 조회할 상품의 ID
     * @returns {Object|null} 상품 객체 또는 찾지 못하면 null
     */
    async function getProductById(id) {
        let connection;
        try {
            connection = await pool.getConnection();
            const [results] = await connection.execute(
                'SELECT id, name, description, price, stock_quantity, image_url, category, created_at, updated_at FROM products WHERE id = ?',
                [id]
            );
            return results.length > 0 ? results[0] : null; // 결과가 있다면 첫 번째 행을 반환, 없으면 null
        } catch (err) {
            console.error('Error in productRepository.getProductById:', err.stack);
            throw new Error('데이터베이스에서 특정 상품을 조회하는 데 실패했습니다.');
        } finally {
            if (connection) connection.release();
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
        // 배열로 전달된 값들이 순서대로 매핑됩니다.
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


/**
     * 특정 상품의 정보를 데이터베이스에서 업데이트합니다.
     * @param {number} id - 업데이트할 상품의 ID
     * @param {Object} productData - 업데이트할 상품 정보 객체
     * @returns {Object|null} 업데이트된 상품 객체 또는 찾지 못하면 null
     */
async function updateProduct(id,productData) {

    const { name, description, price, stock_quantity, image_url, category } = productData;
    let connection; // connection 변수를 try 블록 밖에서 선언
    try {
       connection = await pool.getConnection(); // 연결 풀에서 연결을 가져옵니다.

        // products 테이블에 새 상품을 삽입하는 SQL 쿼리
        // 배열로 전달된 값들이 순서대로 매핑됩니다.
        const [result] = await connection.execute(
                `UPDATE products SET 
                    name = ?, 
                    description = ?, 
                    price = ?, 
                    stock_quantity = ?, 
                    image_url = ?, 
                    category = ? 
                    WHERE id = ?`,
                [name, description, price, stock_quantity, image_url, category, id]
            );

        // 업데이트된 행이 없다면 (ID를 찾지 못했다면) null 반환
        if (result.affectedRows === 0) {
            console.log("이거 들어옴 엿됨....");
            return null;

        }

        // 업데이트된 상품의 최신 정보를 다시 조회하여 반환
       const [updateProductRows] = await connection.execute(
            'SELECT id, name, description, price, stock_quantity, image_url, category, created_at, updated_at FROM products WHERE id = ?',
            [id]
        );

        return updateProductRows; // 조회된 상품 배열 반환

    } catch (err) {
        console.error('Error in updateProduct:', err.stack);
        throw new Error('상품 정보를 수정하는데 실패했습니다.'); // 에러를 상위로 던져서 처리
    } finally{
        if (connection) connection.release();
    }
};


/**
     * 특정 상품을 데이터베이스에서 삭제합니다.
     * @param {number} id - 삭제할 상품의 ID
     * @returns {boolean} 삭제 성공 여부 (true/false)
     */

async function deleteProduct(id) {
    let connection;
    try {
        connection = await pool.getConnection(); // 연결 풀에서 연결을 가져옵니다.
        const[result] = await connection.execute(
             `DELETE FROM products WHERE  id = ?`,
             [id]
        );

        // affectedRows가 1 이상이면 성공적으로 삭제된 것
        return result.affectedRows > 0;
    } catch (error) {
       console.error('Error in productRepository.deleteProduct:', err.stack);
       throw new Error(); 
    } finally {
        if (connection) connection.release(); // db lock 방지
    }
};

// 이 함수들을 외부에서 사용할 수 있도록 내보냅니다.
module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,  
    deleteProduct   
};
