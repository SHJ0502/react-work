// wind-app/app/layout.js

'use client'; // 이 줄을 추가하여 이 컴포넌트를 클라이언트 컴포넌트로 지정합니다.

import { Inter } from 'next/font/google'; // Google Font - Inter 임포트
import Link from 'next/link'; // Next.js Link 컴포넌트 임포트
import './globals.css'; // 전역 CSS (Tailwind CSS 포함) 임포트

// lucide-react 아이콘 임포트: 검색, 사용자, 쇼핑 카트 아이콘
import { Search, User, ShoppingCart } from 'lucide-react';

// Inter 폰트 설정
const inter = Inter({ subsets: ['latin'] });

// RootLayout 컴포넌트: 모든 페이지에 공통적으로 적용되는 레이아웃을 정의합니다.
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {/* 헤더 섹션 시작 */}
        <header className="bg-white shadow-md py-4">
          <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* 로고 영역 */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-4xl font-extrabold text-indigo-700 hover:text-indigo-900 transition-colors duration-300">
                {/* 로고 플레이스홀더 이미지 (실제 로고 이미지 URL로 교체 가능) */}
                <img
                  src="https://placehold.co/150x50/5B21B6/FFFFFF?text=SHOP%20CENTER"
                  alt="SHOP CENTER"
                  className="h-12 w-auto rounded-lg"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x50/CCCCCC/333333?text=Logo+Error'; }} // 이미지 로드 실패 시 대체
                />
              </Link>
            </div>

            {/* 검색창 (중앙) */}
            <div className="flex-grow max-w-lg mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="상품을 검색해보세요..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* 사용자 아이콘, 장바구니 아이콘 (우측) */}
            <div className="flex items-center space-x-6">
              <Link href="/account" className="text-gray-600 hover:text-indigo-700 transition-colors duration-300 flex items-center space-x-1">
                <User size={24} />
                <span className="hidden sm:inline">내 계정</span>
              </Link>
              <Link href="/cart" className="text-gray-600 hover:text-indigo-700 transition-colors duration-300 flex items-center space-x-1 relative">
                <ShoppingCart size={24} />
                <span className="hidden sm:inline">장바구니</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  3 {/* 예시: 장바구니 아이템 수 */}
                </span>
              </Link>
            </div>
          </div>
        </header>
        {/* 헤더 섹션 끝 */}

        {/* 메인 내비게이션 바 섹션 시작 */}
        <nav className="bg-indigo-700 text-white py-3 shadow-inner">
          <div className="container mx-auto flex justify-center space-x-8 px-4 sm:px-6 lg:px-8">
            <Link href="/products/new-arrivals" className="text-lg font-medium hover:text-indigo-200 transition-colors duration-300 py-1">
              신상품
            </Link>
            <Link href="/products/best-sellers" className="text-lg font-medium hover:text-indigo-200 transition-colors duration-300 py-1">
              베스트
            </Link>
            <Link href="/products/category/clothing" className="text-lg font-medium hover:text-indigo-200 transition-colors duration-300 py-1">
              의류
            </Link>
            <Link href="/products/category/electronics" className="text-lg font-medium hover:text-indigo-200 transition-colors duration-300 py-1">
              전자제품
            </Link>
            <Link href="/products/category/home-decor" className="text-lg font-medium hover:text-indigo-200 transition-colors duration-300 py-1">
              홈데코
            </Link>
            <Link href="/customer-service" className="text-lg font-medium hover:text-indigo-200 transition-colors duration-300 py-1">
              고객센터
            </Link>
          </div>
        </nav>
        {/* 메인 내비게이션 바 섹션 끝 */}

        {/* 각 페이지의 실제 콘텐츠가 렌더링될 위치 */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* 푸터 섹션 시작 */}
        <footer className="bg-gray-800 text-gray-300 py-8 mt-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} My Awesome Shopping Mall. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link href="/privacy-policy" className="hover:text-white transition-colors duration-300">개인정보처리방침</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors duration-300">이용약관</Link>
              <Link href="/contact" className="hover:text-white transition-colors duration-300">문의하기</Link>
            </div>
            <p className="mt-4 text-xs">
              주소: 서울특별시 강남구 테헤란로 123 | 대표: 홍길동 | 사업자등록번호: 123-45-67890<br/>
              통신판매업신고번호: 2023-서울강남-00000
            </p>
          </div>
        </footer>
        {/* 푸터 섹션 끝 */}
      </body>
    </html>
  );
}
