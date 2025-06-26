    // tailwind.config.js
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}', // App Router의 페이지 및 레이아웃 파일
        './pages/**/*.{js,ts,jsx,tsx,mdx}', // Pages Router (선택 사항이지만 안전을 위해 포함)
        './components/**/*.{js,ts,jsx,tsx,mdx}', // 공통 컴포넌트 파일
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    };