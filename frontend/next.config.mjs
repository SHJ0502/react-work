// next.config.mjs (frontend)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // `next/image` 컴포넌트에서 외부 이미지를 사용할 때 허용할 도메인을 설정합니다.
  // 이 설정을 추가하지 않으면 외부 이미지 사용 시 경고 또는 에러가 발생할 수 있습니다.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // placehold.co 도메인 허용 (page.js에서 사용)
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // via.placeholder.com 도메인 허용 (page.js에서 사용)
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nid.naver.com', // 네이버 로그인 이미지 도메인 허용 (layout.js에서 사용)
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'developers.kakao.com', // 카카오 로그인 이미지 도메인 허용 (layout.js에서 사용)
        port: '',
        pathname: '/**',
      },
      // 만약 다른 외부 이미지 도메인을 사용한다면 여기에 추가할 수 있습니다.
    ],
  },
};

export default nextConfig;
