// routes/productRoutes.js (backend)

const express = require('express');
// Express의 Router 객체를 생성합니다. 이 객체는 미들웨어와 라우트들을 캡슐화합니다.
const router = express.Router();

// productService를 임포트하여 비즈니스 로직을 사용합니다.
const productService = require('../services/productService'); // '../services'는 backend/services를 참조합니다.

// GET /api/products: 데이터베이스에서 상품 목록을 가져옵니다.
router.get('/', async (req, res) => {
    try {
        // productService에서 모든 상품을 가져오는 함수 호출
        const products = await productService.getProducts();
        
        res.json({
            message: 'Products fetched successfully from MySQL via API Route!',
            products: products
        });
    } catch (err) {
        // Service 계층에서 던진 에러를 여기서 처리합니다.
        console.error('Error fetching products from API Route:', err.message);
        res.status(500).json({ error: err.message || 'Failed to fetch products.' });
    }
});

// POST /api/products: 새 상품을 데이터베이스에 추가합니다.
router.post('/', async (req, res) => {
    // 요청 본문에서 상품 상세 정보를 추출합니다.
    const { name, description, price, stock_quantity, image_url, category } = req.body;

    // API 계층에서의 기본적인 입력 유효성 검사
    // 필수 필드가 누락되었을 경우 400 Bad Request 응답
    if (!name || price === undefined || stock_quantity === undefined) {
        return res.status(400).json({ error: 'Product name, price, and stock quantity are required.' });
    }

    try {
        // productService에서 새 상품을 생성하는 함수 호출
        const newProduct = await productService.createNewProduct({
            name, description, price, stock_quantity, image_url, category
        });

        // 상품 추가 성공 시 201 Created 응답
        res.status(201).json({
            message: 'Product added successfully via API Route!',
            product: newProduct
        });
    } catch (err) {
        // Service 계층에서 던진 에러를 여기서 처리합니다.
        console.error('Error adding product from API Route:', err.message);
        // 클라이언트에게는 자세한 내부 오류 대신 일반적인 메시지를 전달합니다.
        res.status(500).json({ error: err.message || 'Failed to add product.' });
    }
});

// 이 라우터 객체를 외부로 내보내어 index.js에서 사용할 수 있게 합니다.
module.exports = router;
