// services/productService.js (backend)

// productRepository를 임포트하여 데이터베이스 접근 로직을 사용합니다.
const productRepository = require('../repositories/productRepository');

/**
 * 모든 상품 목록을 가져오는 비즈니스 로직을 처리합니다.
 * 필요에 따라 추가적인 유효성 검사나 데이터 가공 로직을 여기에 추가할 수 있습니다.
 * @returns {Array} 상품 객체 배열
 */
async function getProducts() {
    try {
        // Repository 계층의 함수를 호출하여 상품 데이터를 가져옵니다.
        const products = await productRepository.getAllProducts();
        // 필요하다면 여기서 추가적인 비즈니스 로직을 적용할 수 있습니다.
        return products;
    } catch (error) {
        console.error('Error in getProducts service:', error.stack);
        throw new Error('상품 목록을 가져오는 데 문제가 발생했습니다.'); // 사용자 친화적인 메시지
    }
}

/**
 * 새로운 상품을 생성하는 비즈니스 로직을 처리합니다.
 * @param {Object} productData - 상품 정보 객체 (name, description, price, stock_quantity, image_url, category)
 * @returns {Object} 새로 생성된 상품 객체
 */
async function createNewProduct(productData) {
    const { name, price, stock_quantity } = productData;

    // 서비스 계층에서의 추가적인 비즈니스 유효성 검사 (예: 가격이 음수인지 등)
    if (price < 0 || stock_quantity < 0) {
        throw new Error('가격과 재고 수량은 음수일 수 없습니다.');
    }

    try {
        // Repository 계층의 함수를 호출하여 상품을 생성합니다.
        const newProduct = await productRepository.createProduct(productData);
        return newProduct;
    } catch (error) {
        console.error('Error in createNewProduct service:', error.stack);
        throw new Error('새 상품을 생성하는 데 문제가 발생했습니다.'); // 사용자 친화적인 메시지
    }
}

// 이 함수들을 외부에서 사용할 수 있도록 내보냅니다.
module.exports = {
    getProducts,
    createNewProduct
};
