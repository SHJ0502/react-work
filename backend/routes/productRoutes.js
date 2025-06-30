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

// GET /api/products/:id: 특정 ID의 상품 정보를 가져옵니다.
router.get('/:id', async (req,res) => {
    try {
        //URL 파라미터에서 ID 추출 (숫자로 변환) 
        const productId = parseInt(req.params.id,10); // 10은 10진법 이란뜻
        
        //ID 유효한 숫자인지 검사 Check
        if (isNaN(productId)) {
            return res.status(400).json({error : "유효한 상품 ID를 제공해야 합니다."});
        }
        
        const productById = await productService.getProductById(productId);
        res.json({
            message : "Product fetched successfully!",
            product : productById
        });

    } catch (err) {
        console.error("Error feching productById from API Route". err.message);
        // Service 계층에서 던진 "찾을 수 없음" 에러를 404로 처리
        if (err.message.includes("찾을 수 없습니다."))
        {
            return res.status(404).json({error : err.message});
        } else {
            return res.status(500).json({error : err.message || "상품 정보를 가져오는 데 실패했습니다."});
        }
        
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

// PUT /api/products/:id: 특정 ID의 상품 정보를 업데이트합니다.
router.put('/:id', async(req,res) => {
    // URL 파라미터에서 ID 추출 (숫자로 변환)
    const productId = parseInt(req.params.id,10);
    // 요청 본문에서 업데이트할 상품 데이터 추출
    const productData = req.body;
    
    // ID가 유효한 숫자인지 검사
    if (isNaN(productId)) {
        return res.status(400).json({ error: '유효한 상품 ID를 제공해야 합니다.' });
    }

    // 업데이트할 데이터가 비어있는지 확인
    if (Object.keys(productData).length === 0) {
        return res.status(400).json({ error: '업데이트할 상품 정보를 제공해야 합니다.' });
    }

    // 가격이나 재고 수량이 있다면 유효한 숫자인지 확인
    if (productData.price !== undefined && isNaN(parseFloat(productData.price))) {
        return res.status(400).json({ error: '가격은 유효한 숫자여야 합니다.' });
    }
    if (productData.stock_quantity !== undefined && isNaN(parseInt(productData.stock_quantity, 10))) {
        return res.status(400).json({ error: '재고 수량은 유효한 숫자여야 합니다.' });
    }

    try {
        const updateProduct = await productService.updateProduct(productId,productData);
        res.json({
            message : "Product updated successfully via API Route!",
            product : updateProduct
        });
    } catch (err) {
        console.error('Error updating product via API Route:', err.message);
        // Service 계층에서 던진 "찾을 수 없음" 에러를 404로 처리
        if (err.message.includes('찾을 수 없습니다')) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message || '상품 정보 수정에 실패했습니다.' });
        }
    }
});

// DELETE /api/products/:id: 특정 ID의 상품을 삭제합니다.
router.delete('/:id',async(req,res)=>{
    // URL 파라미터에서 ID 추출 (숫자로 변환)
    const productId = parseInt(req.params.id,10);

    // ID가 유효한 숫자인지 검사
    if (isNaN(productId)) {
        return res.status(400).json({ error: '유효한 상품 ID를 제공해야 합니다.' });
    }

    try {
        const deleteProduct = await productService.deleteProduct(id);
        res.json({
            message : "Product deleted successfully via API Route!",
            product : deleteProduct
        });
    } catch (err) {
        console.error('Error updating product via API Route:', err.message);
        // Service 계층에서 던진 "찾을 수 없음" 에러를 404로 처리
        if (err.message.includes('찾을 수 없습니다')) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message || '상품 정보 삭제에 실패했습니다.' });
        }
    }
});



// 이 라우터 객체를 외부로 내보내어 index.js에서 사용할 수 있게 합니다.
module.exports = router;
