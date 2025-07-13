'use client';  // 클라이언트 콤포넌트 명시

import {useEffect} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';  //useRouter, useSearchParams 임포트

export default function LoginSuccessPage() {
    const router =  useRouter(); //next.js 라우터 훅
    const searchParams = useSearchParams(); // url 쿼리 파라미터를 가져오는 훅

    useEffect(() => {
        // url 에서 'token' 쿼리 파라미터 값을 가져옴
        const token = searchParams.get('token');
        
        if (token) {
            // 토큰이 존재하면 로컬 스토리지에 저장
            // 실제 애플리케이션에서는 HttpOnly 쿠키 등 더 안전한 방법을 고려

            localStorage.setItem('jwt_token', token);
            console.log('JWT Token received and stored:', token);

            router.replace('/'); //  home으로 이동
        } else {
            console.error('OAuth 로그인 성공 후 토큰을 받지 못했습니다.');
            router.replace('/login?error=no_token');
        }
    }, [searchParams, router]); //searchParams와 router가 변경될 때마다 useEffect 실행

    return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">로그인 처리 중...</h1>
        <p className="text-gray-600">잠시만 기다려 주세요.</p>
        {/* 로딩 스피너 등 시각적 피드백 추가 가능 */}
        <div className="mt-6 animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );

};