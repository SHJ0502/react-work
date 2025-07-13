// frontend/app/account/page.js

// 'use client'; // 필요하다면 클라이언트 컴포넌트로 지정

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 text-center border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">내 정보 페이지</h1>
        <p className="text-gray-700 text-lg mb-8">
          환영합니다! 이 페이지는 사용자의 계정 정보를 보여주거나, 프로필을 수정하고, 주문 내역 등을 확인할 수 있는 공간입니다.
        </p>
        <p className="text-gray-500 text-sm">
          현재는 임시 페이지이며, 나중에 더 많은 기능을 추가할 예정입니다.
        </p>
        {/* 여기에 추가적인 계정 관련 UI 요소 (예: 프로필 수정 폼, 주문 내역 리스트)를 구현할 수 있습니다. */}
      </div>
    </div>
  );
}
