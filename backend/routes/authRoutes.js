// routes/authRoutes.js (backend)

const express = require('express');
const router = express.Router();
const axios = require('axios'); // 외부 API 호출을 위한 axios 임포트
require('dotenv').config(); // .env 파일의 환경변수를 로드합니다.
const jwt = require('jsonwebtoken'); // JWT 생성을 위한 jsonwebtoken 임포트

// JWT 비밀 키 (실제 운영 환경에서는 더욱 강력하고 안전하게 관리해야 합니다.)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // .env에서 JWT_SECRET을 가져오거나 기본값 사용

// 네이버 OAuth 설정
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const NAVER_CALLBACK_URL = process.env.NAVER_CALLBACK_URL || 'http://localhost:5000/api/auth/naver/callback';

// 카카오 OAuth 설정
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
// const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET; // 카카오는 보통 Client Secret을 사용하지 않습니다.
const KAKAO_CALLBACK_URL = process.env.KAKAO_CALLBACK_URL || 'http://localhost:5000/api/auth/kakao/callback';

// --- 네이버 로그인 시작 ---
router.get('/naver', (req, res) => {
    const state = 'RANDOM_STATE_STRING'; // CSRF 공격 방지를 위한 임의의 문자열
    const naverAuthURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_CALLBACK_URL}&state=${state}`;
    // 실제 앱에서는 state를 세션이나 쿠키에 저장하여 콜백 시 검증해야 합니다.
    res.redirect(naverAuthURL);
});

// --- 네이버 로그인 콜백 ---
router.get('/naver/callback', async (req, res) => {
    const { code, state, error, error_description } = req.query;

    if (error) {
        console.error('Naver OAuth Error:', error_description);
        return res.redirect(`http://localhost:3000/login?error=${encodeURIComponent(error_description)}`);
    }

    // 실제 앱에서는 state 검증 로직이 필요합니다. (예: 세션에 저장된 state와 비교)
    // if (state !== storedState) { return res.status(400).send('CSRF attack detected'); }

    try {
        // 1. 네이버로부터 Access Token 요청
        const tokenResponse = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: NAVER_CLIENT_ID,
                client_secret: NAVER_CLIENT_SECRET,
                redirect_uri: NAVER_CALLBACK_URL,
                code: code,
                state: state,
            },
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
            },
        });

        const accessToken = tokenResponse.data.access_token;

        // 2. Access Token으로 사용자 정보 요청
        const userProfileResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const naverUser = userProfileResponse.data.response;
        console.log('Naver User Profile:', naverUser);

        // 3. 사용자 정보를 바탕으로 JWT 생성 (임시 사용자 ID 사용)
        // 실제 앱에서는 DB에서 사용자를 찾거나 새로 생성한 후, 해당 사용자의 ID를 사용해야 합니다.
        const payload = {
            id: naverUser.id,
            email: naverUser.email,
            provider: 'naver',
            name: naverUser.name,
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // 1시간 유효한 토큰

        // 프론트엔드로 JWT 토큰과 함께 리다이렉트
        res.redirect(`http://localhost:3000/login/success?token=${token}`);

    } catch (err) {
        console.error('Naver OAuth Callback Error:', err.response ? err.response.data : err.message);
        res.redirect(`http://localhost:3000/login?error=${encodeURIComponent('네이버 로그인 처리 중 오류가 발생했습니다.')}`);
    }
});


// --- 카카오 로그인 시작 ---
router.get('/kakao', (req, res) => {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_CALLBACK_URL}&response_type=code`;
    res.redirect(kakaoAuthURL);
});

// --- 카카오 로그인 콜백 ---
router.get('/kakao/callback', async (req, res) => {
    const { code, error, error_description } = req.query;

    if (error) {
        console.error('Kakao OAuth Error:', error_description);
        return res.redirect(`http://localhost:3000/login?error=${encodeURIComponent(error_description)}`);
    }

    try {
        // 1. 카카오로부터 Access Token 요청
        const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            params: {
                grant_type: 'authorization_code',
                client_id: KAKAO_CLIENT_ID,
                redirect_uri: KAKAO_CALLBACK_URL,
                code: code,
                // client_secret: KAKAO_CLIENT_SECRET, // 카카오는 보통 Client Secret을 사용하지 않습니다.
            },
        });

        const accessToken = tokenResponse.data.access_token;

        // 2. Access Token으로 사용자 정보 요청
        const userProfileResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
        });

        const kakaoUser = userProfileResponse.data;
        console.log('Kakao User Profile:', kakaoUser);

        // 3. 사용자 정보를 바탕으로 JWT 생성 (임시 사용자 ID 사용)
        // 실제 앱에서는 DB에서 사용자를 찾거나 새로 생성한 후, 해당 사용자의 ID를 사용해야 합니다.
        const payload = {
            id: kakaoUser.id,
            email: kakaoUser.kakao_account?.email, // 이메일은 동의 항목에 따라 없을 수 있습니다.
            provider: 'kakao',
            name: kakaoUser.kakao_account?.profile?.nickname,
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // 1시간 유효한 토큰

        // 프론트엔드로 JWT 토큰과 함께 리다이렉트
        res.redirect(`http://localhost:3000/login/success?token=${token}`);

    } catch (err) {
        console.error('Kakao OAuth Callback Error:', err.response ? err.response.data : err.message);
        res.redirect(`http://localhost:3000/login?error=${encodeURIComponent('카카오 로그인 처리 중 오류가 발생했습니다.')}`);
    }
});

module.exports = router;
