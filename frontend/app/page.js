 'use client'; // 클라이언트 컴포넌트임을 명시 (useState, useEffect 사용)

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
//import Image from 'next/image';  //dns ?네트워크? 문제 암튼 보안문제로 인해서 사용불가

// modal 컴포넌트 추가
import ConfirmationModal from '../components/ConfirmationModal';
import { useRouter, useSearchParams } from 'next/navigation';  //useRouter, useSearchParams 임포트



 export default function Home() {

  //useRouter 훅사용
  const router = useRouter();

  // 상품목록을 저장할 변수
  const [products, setProducts] = useState([]);
  // 새 상품 추가 폼의 입력 값을 저장할 상태 변수
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    category: ''
  });

  //현재 수정 중인 상품의 ID를 저장할 상태 (null이면 새 상품 추가 모드, ID가 있으면 수정 모드)
  const [editingProductId, setEditingProductId] = useState(null);

  // 로딩 상태를 관리  (데잍어 fetching 중)
  const [loading, setLoading] = useState(true);
  // 에러 메시지를 저장할 변수
  const [error, setError] = useState(null);
  // 상품 추가 성공 메시지를 저장할 상태 변수 
  const [successMessage, setSuccessMessage] = useState(null);    

  //모달관련 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 열림/닫힘
  const [productToDelId,setProductToDelId] = useState(null);  // 상품 삭제id

  
  // 백엔드 api의 기본 url
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  
  //로그인 상태 확인 및 리다이렉트 로직
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      router.replace('/login');
    }

    // 토큰이 있으면 상품 데이터를 가져오도록 fetchProducts 호출
    // 이 useEffect는 로그인 상태 확인 후 fetchProducts를 호출해야 하므로,
    // fetchProducts의 의존성 배열에 router가 추가될 필요는 없습니다.
    // fetchProducts는 별도의 useEffect에서 호출되거나, 여기서 직접 호출될 수 있d,a.
    // 여기서는 별도의 useEffect에서 fetchProducts를 호출하도록 유지합니다.

  },[router]);

  // 상품 목록을 백엔드에서 가져오는 비동기 함수 (axios 사용) 
  // --- 중요: fetchProducts 정의가 useEffect보다 먼저 와야 합니다. ---
  const fetchProducts = useCallback(async() => {
    setLoading(true);
    setError(null);
    
    try {
      //axios get 요청
      const response = await axios.get(API_BASE_URL + '/api/products');
      //const response = await axios.get(`${API_BASE_URL}/api/products`); // 백틱 사용. 2015년부터 사용했다는데..흠..
      
      console.log("Fetched products : ", response.data.products);
      setProducts(response.data.products);
      
    } catch (err) {
      
      console.error('Error fetching products:', err);
      // axios 에러 처리 개선: 응답, 요청, 일반 에러 분리
      if (err.response) {
        // 서버가 응답했지만 2xx 범위가 아닌 상태 코드
        setError(err.response.data.error || `상품 목록을 가져오는 데 실패했습니다: ${err.response.status}`);
      } else if (err.request) {
        // 요청이 전송되었지만 응답을 받지 못함 (네트워크 문제)
        setError('네트워크 오류: 백엔드 서버에 연결할 수 없습니다.');
      } else {
        // 요청 설정 중 발생한 에러
        setError('요청 설정 중 오류 발생: ' + err.message);
      }
    } finally {
      setLoading(false); // 종료
    };
  }, [API_BASE_URL]);   //fetchProducts는 API_BASE_URL에 의존하므로 포함 추가 usecallback 에서는 선언된 변수는 반드시 의존하기 때문에 배열에 넣어야한다.
  
  // 컴포넌트가 마운트될 때 상품목록을 가져오는 함수 > // 상품 목록을 백엔드에서 가져오는 비동기 함수 (useCallback으로 메모이제이션) (2025-06-30 추가)
  useEffect(() => {

    //토큰이 있을 때만 상품 목록을 가져오도록 조건 추가 (로그인 리다이렉트 로직과 연계)
    const token = localStorage.getItem('jwt_token');
    if (token) {
      fetchProducts();
    }

  }, [fetchProducts]); //useCallback으로 감싼 fetchProducts를 의존성 배열에 포함


  // 폼 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    const {name , value} = e.target;
    setNewProduct(prevProduct => ({
      ...prevProduct,
      //price와 stock_quantity는 숫자로 피싱 (빈 문자열은 그대로 유지)
      [name]: name === 'price' || name === 'stock_quantity' ? (value === '' ? '' : parseFloat(value)) :value
    }));
  };

  // 새 상품 제출 핸들러 (PUT/POST 분기 처리)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // 필수 필드 유효성 검사
    if (!newProduct.name || newProduct.price === '' || newProduct.stock_quantity === '') {
      setError('상품 이름, 가격, 재고 수량은 필수 입력 항목입니다.');
      setLoading(false);
      return;
    }
    
    // 가격과 재고 수량이 숫자인지 최종 확인 (parseInt, parseFloat 실패 시 NaN 반환)  
    const priceNum = parseFloat(newProduct.price);
    const stockNum = parseInt(newProduct.stock_quantity, 10);

    if (isNaN(priceNum) || isNaN(stockNum)) {
        setError('가격과 재고 수량은 유효한 숫자여야 합니다.');
        setLoading(false);
        return;
    }

    // 전송할 데이터는 숫자로 변환된 값 포함
    const productToSend = {
        ...newProduct,
        price: priceNum,
        stock_quantity: stockNum
    };
    
    try {

      // axios.post 요청으로 변경 : API_BASE_URL과 엔드포인트를 올바르게 조합.
      // const response = await axios.post(API_BASE_URL + '/api/products', productToSend);
      let response;
    
      if (editingProductId) { //수정 모드 (PUT 요청)
        response = await axios.put(`${API_BASE_URL}/api/products/${editingProductId}`,productToSend);
        setSuccessMessage('상품이 성공적으로 수정되었습니다!');
        setEditingProductId(null); // 수정 모드 종료
      } else {                // 새 상품 추가 모드 (POST 요청)
        response = await axios.post(`${API_BASE_URL}/api/products`,productToSend);
        setSuccessMessage('상품이 성공적으로 추가되었습니다!');
      }

      console.log("API Response : ",response.data);
      
      // 상품 초기화
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        image_url: '',
        category: ''
      });

      //상품 목록 새로고침.
      fetchProducts();

    } catch (error) {
      console.error('Error adding product:', err);
      if (err.response) {
        setError(err.response.data.error || `상품 추가에 실패했습니다: ${err.response.status}`);
      } else if (err.request) {
        setError('네트워크 오류: 백엔드 서버에 연결할 수 없습니다.');
      } else {
        setError('요청 설정 중 오류 발생: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  }; 
  
  // 상품 수정 버튼 핸들러
  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock_quantity: product.stock_quantity,
      image_url: product.image_url || '',
      category: product.category || ''
    });

    setSuccessMessage(null); //메시지 초기화
    setError(null)          // 에러 초기화
    window.scrollTo({top:0, behavior: 'smooth'});
  };

  // // 상품 삭제 버튼 핸들러 > 모달 콤포넌트 추가
  // const handleDelete = async (id) => {

  //   const confirmDelMsg  = window.confirm('정말로 상품을 삭제할겁니까? ㅠㅠ');
  //   if (!confirmDelMsg) {
  //     return;
  //   }
    
  //   // 진행 and 초기화 (init)
  //   setLoading(true);
  //   setError(null);
  //   setSuccessMessage(null);

  //   try {
  //     response = await axios.delete(`${API_BASE_URL}/api/products/${id}`);
  //     console.log('Product deleted:', response.data.message);
  //     setSuccessMessage('상품이 성공적으로 삭제되었습니다!');
  //     fetchProducts(); // 상품 목록 새로고침
  //   } catch (error) {
  //     console.error('Error deleting product:', err);
  //     if (err.response) {
  //       setError(err.response.data.error || `삭제 실패: ${err.response.status}`);
  //     } else if (err.request) {
  //       setError('네트워크 오류: 백엔드 서버에 연결할 수 없습니다.');
  //     } else {
  //       setError('요청 설정 중 오류 발생: ' + err.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  // 상품삭제 버튼 클릭 핸들러 (모달 콤포넌트 표시)
  const handleDelClick = (id) => {
    setProductToDelId(id);
    setIsModalOpen(true);
  };

  // 모달의 '확인' 버튼 클릭시 실제 삭제 로직 실행
  const handleConfirmDel = async () => {
    setIsModalOpen(false); //모달 닫기
    if (!productToDelId) return; //삭제할 id가 존재하지 않으면 중단

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
     try {
      response = await axios.delete(`${API_BASE_URL}/api/products/${productToDelId}`);
      console.log('Product deleted:', response.data.message);
      setSuccessMessage('상품이 성공적으로 삭제되었습니다!');
      fetchProducts(); // 상품 목록 새로고침
    } catch (error) {
      console.error('Error deleting product:', err);
      if (err.response) {
        setError(err.response.data.error || `삭제 실패: ${err.response.status}`);
      } else if (err.request) {
        setError('네트워크 오류: 백엔드 서버에 연결할 수 없습니다.');
      } else {
        setError('요청 설정 중 오류 발생: ' + err.message);
      }
    } finally {
      setLoading(false);
      setProductToDelId(null);  //삭제할 상품 id 초기화
    }
  }

  // 모달의 취소 버튼 클릭시 모달 닫기
  const handleCancelDel = () => {
    setIsModalOpen(false);
    setProductToDelId(null);
    setSuccessMessage('상품 삭제가 취소되었습니다.');
  }

  // 수정 취소 버튼 핸들러
  const handleCancelEdit = () => {
    setEditingProductId(null);
    setNewProduct({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        image_url: '',
        category: ''
      });
      setSuccessMessage(null);
      setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* 타이틀 섹션 */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
            상품 등록 TEST
          </span>
        </h1>
        <p className="text-xl text-gray-700 text-center">
          아무거나 등록해보세요.
        </p>
      </div>

      {/* 새 상품 추가 폼 섹션 / 수정 폼 섹션 */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
          {/*수정 모드에 따라 폼 제목 변경*/}
          {editingProductId ? '상품 정보 수정' : '새 상품 추가'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">상품 이름 <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">가격 <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="price"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">재고 수량 <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="stock_quantity"
              name="stock_quantity"
              value={newProduct.stock_quantity}
              onChange={handleInputChange}
              required
              min="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">카테고리</label>
            <input
              type="text"
              id="category"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">설명</label>
            <textarea
              id="description"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">이미지 URL</label>
            <input
              type="text"
              id="image_url"
              name="image_url"
              value={newProduct.image_url}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {/* Image 컴포넌트 대신 일반 img 태그 사용 */}
            {newProduct.image_url && (
              <img
                src={newProduct.image_url}
                alt="상품 이미지 미리보기"
                width={80} // img 태그에서는 width, height를 직접 지정
                height={80}
                className="mt-2 h-20 w-20 object-cover rounded-md shadow"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/CCCCCC/000000?text=No+Image'; }}
              />
            )}
          </div>
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading} // 로딩 중에는 버튼 비활성화
            >
              {/* 수정 모드에 따라 버튼 텍스트 변경*/}
              {loading ? (editingProductId ? '수정 중...' : '추가 중...') : (editingProductId? '상품 수정' : '상품 추가')}
            </button>
            {/*수정 취소 버튼 추가*/}
            {editingProductId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md transition-all duration-200 ease-in-out"
                disabled={loading}
              >
                수정 취소
              </button>
            )}
          </div>
        </form>

        {/* 메시지 표시 */}
        {error && <p className="mt-4 text-red-600 text-center font-medium">{error}</p>}
        {successMessage && <p className="mt-4 text-green-600 text-center font-medium">{successMessage}</p>}
      </div>

      {/* 상품 목록 섹션 */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">상품 목록</h2>
        {loading && <p className="text-center text-gray-600">상품을 불러오는 중...</p>}
        {error && !loading && <p className="text-red-600 text-center">{error}</p>}
        {!loading && products.length === 0 && !error && (
          <p className="text-center text-gray-600">등록된 상품이 없습니다. 위에 폼을 이용해 추가해보세요!</p>
        )}
        <div div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col items-center text-center">
             {/* Image 컴포넌트 대신 일반 img 태그 사용 */}
              <img
                src={product.image_url || `https://placehold.co/150x100/CCCCCC/000000?text=No+Image`}
                alt={product.name}
                width={150} // img 태그에서는 width, height를 직접 지정
                height={100}
                className="w-full h-32 object-cover rounded-md mb-3"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x100/CCCCCC/000000?text=No+Image'; }}
              />
              <h3 className="text-lg font-semibold text-gray-800 truncate w-full mb-1">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description || '설명 없음'}</p>
              <p className="text-xl font-bold text-blue-700 mb-1">₩{product.price.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">재고: {product.stock_quantity}</p>
              {product.category && <p className="text-gray-500 text-xs mt-1 px-2 py-1 bg-gray-200 rounded-full">{product.category}</p>}
              {/*수정 및 삭제 버튼 추가*/}
              <div className="mt-4 flex space-x-2">
                <button onClick={() => {handleEdit(product)}} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 shadow-sm">
                  수정
                </button>
                <button onClick={() => {handleDelClick(product.id)}} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 shadow-sm">
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 커스텀 확인 모달 랜더링 */}
      <ConfirmationModal
        isOpen={isModalOpen}
        message="진짜 이 상품 삭제할거임?..ㅠㅠ"
        onConfirm={handleConfirmDel}
        onCancel={handleCancelDel}
        confirmText='삭제'
        cancelText='취소'
      />
    </div>
  );
 };