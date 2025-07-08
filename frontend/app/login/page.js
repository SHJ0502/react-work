// frontend/app/login/page.js
'use client'; // 클라이언트 컴포넌트임을 명시

import { useState } from 'react';

export default function LoginPage() {
  // 사용자 입력 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 로딩 상태 (로그인 요청 중)
  const [loading, setLoading] = useState(false);
  // 에러 메시지
  const [error, setError] = useState(null);
  // 성공 메시지
  const [successMessage, setSuccessMessage] = useState(null);

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // 현재는 UI만 구현하므로, 실제 로그인 로직은 추후 추가됩니다.
    // 여기서는 간단한 유효성 검사와 메시지 표시만 합니다.
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      setLoading(false);
      return;
    }

    console.log('로그인 시도:', { email, password });

    // 실제 API 호출 대신 2초 지연 시뮬레이션
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccessMessage('로그인 성공! (실제 로직은 추후 연동)');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('로그인 실패: 알 수 없는 오류가 발생했습니다.');
      console.error('Login simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            계정에 로그인하여 서비스를 이용하세요.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">이메일 주소</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-px"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* 에러 및 성공 메시지 */}
          {error && <p className="text-red-600 text-center text-sm">{error}</p>}
          {successMessage && <p className="text-green-600 text-center text-sm">{successMessage}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              disabled={loading} // 로딩 중에는 버튼 비활성화
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>

        {/* 추가 링크 (회원가입, 비밀번호 찾기 등) */}
        <div className="text-sm text-center">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            비밀번호를 잊으셨나요?
          </a>
        </div>
        <div className="text-sm text-center mt-2">
          계정이 없으신가요?{' '}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
}
