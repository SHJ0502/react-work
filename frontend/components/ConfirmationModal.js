// frontend/components/ConfirmationModal.js

import React from 'react';

/**
 * 재사용 가능한 확인 모달 컴포넌트입니다.
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {boolean} props.isOpen - 모달이 열려있는지 여부
 * @param {string} props.message - 모달에 표시될 메시지
 * @param {function} props.onConfirm - '확인' 버튼 클릭 시 호출될 함수
 * @param {function} props.onCancel - '취소' 버튼 클릭 시 호출될 함수
 * @param {string} [props.confirmText='확인'] - '확인' 버튼 텍스트
 * @param {string} [props.cancelText='취소'] - '취소' 버튼 텍스트
 */
const ConfirmationModal = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
}) => {
  // 모달이 열려있지 않으면 아무것도 렌더링하지 않습니다.
  if (!isOpen) return null;

  return (
    // 모달 오버레이: 전체 화면을 덮고 배경을 어둡게 처리합니다.
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      {/* 모달 내용 컨테이너 */}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto transform transition-all sm:my-8 sm:w-full">
        {/* 모달 메시지 */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 mb-4">{message}</p>
        </div>

        {/* 모달 버튼 그룹 */}
        <div className="mt-5 sm:mt-6 flex justify-center space-x-4">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm transition-colors duration-200"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm transition-colors duration-200"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
