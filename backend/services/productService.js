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
 * 특정 ID의 상품 정보를 가져오는 비즈니스 로직을 처리합니다.
 * @param {number} id - 조회할 상품의 ID
 * @returns {Object|null} 상품 객체 또는 찾지 못하면 null
 */
async function getProductById(id) {
    try {
        const product = await productRepository.getProductById(id);
        //유효성 체크 
        if (!product) {
            throw new Error ("해당 상품을 찾을 수 없습니다..");
        }
        return product;
    } catch (error) {
        console.error('Error in getProductById service:', error.stack);
        throw error;
    }
};

/**
 * 새로운 상품을 생성하는 비즈니스 로직을 처리합니다.
 * @param {Object} productData - 상품 정보 객체 (name, description, price, stock_quantity, image_url, category)
 * @returns {Object} 새로 생성된 상품 객체
 */
async function createNewProduct(productData) {
    const { name, price, stock_quantity } = productData;

    // 서비스 계층에서의 추가적인 비즈니스 유효성 검사 (예: 가격이 음수인지 등)
    if (price < 0 || stock_quantity  < 0) {
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

/**
 * 특정 상품의 정보를 업데이트하는 비즈니스 로직을 처리합니다.
 * @param {number} id - 업데이트할 상품의 ID
 * @param {Object} productData - 업데이트할 상품 정보 객체
 * @returns {Object} 업데이트된 상품 객체
 */
async function updateProduct(id, productData) {

     // 업데이트할 상품이 실제로 존재하는지 확인하는 비즈니스 로직 
     const existingProduct = await productRepository.getProductById(id);
     if (!existingProduct) {
        throw new Error("수정하려는 상품을 찾을 수 없습니다..");
     }

    // 비즈니스 규칙 유효성 검사 (예: 가격이나 재고가 유효한지 등)
    if (productData.price !== undefined && productData.price < 0) {
        throw new Error("가격은 0보다 큰 정수를 입력해야 합니다.");
    };
    if (productData.stock_quantity !== undefined && productData.stock_quantity < 0) {
        throw new Error("재고수량은 0보다 큰 정수를 입력해야 합니다.");
    };

    try {
        const updateProduct = await productRepository.updateProduct(id,productData);
        if (!updateProduct){
            throw new Error("상품 수정을 실패했습니다. 상품을 찾을 수 없거나 변경 사항이 없습니다..");
        }
        return updateProduct;
    } catch (error) {
        console.error('Error in updateProduct service:', error.stack);
        throw new Error('상품정보를 수정하는 데 문제가 발생했습니다.'); // 사용자 친화적인 메시지
    }
};

/**
 * 특정 상품을 삭제하는 비즈니스 로직을 처리합니다.
 * @param {number} id - 삭제할 상품의 ID
 * @returns {boolean} 삭제 성공 여부
 */
async function deleteProduct(id) {
    try {

        //유효성 체크 - 삭제할 상품이 실제로 존재하는지 Check
        const existingProduct = await productRepository.getProductById(id);
        if (!existingProduct) {
            throw new Error("삭제할 상품 정보가 존재하지 않습니다.");
        };

        const deleteProduct = await productRepository.deleteProduct(id);
        if (!deleteProduct) {
            throw new Error("상품을 삭제하는데 실패했습니다.");
        };
        return deleteProduct;

    } catch (error) {
        console.error('Error in deleteProduct service:', error.stack);
        throw new Error('상품정보를 삭제하는 데 문제가 발생했습니다.'); // 사용자 친화적인 메시지
    }
};


// 이 함수들을 외부에서 사용할 수 있도록 내보냅니다.
module.exports = {
    getProducts,
    getProductById,
    createNewProduct,
    updateProduct,
    deleteProduct
};
