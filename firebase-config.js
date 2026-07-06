/* ═══ Firebase 설정 ═══
 * SETUP-GUIDE.md 5단계에서 복사한 firebaseConfig 값을 아래에 붙여넣으세요.
 * (이 값들은 비밀이 아닙니다 — 보안은 Firestore 규칙과 로그인이 담당합니다)
 */
window.FIREBASE_CONFIG = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

/* 로그인 아이디 뒤에 자동으로 붙는 가상 이메일 도메인 (바꿔도 됨, 실제 메일 수신 불필요)
 * 예: 아이디 'admin' → admin@youth.ancheon.com 계정으로 로그인 */
window.EMAIL_SUFFIX = "@youth.ancheon.com";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDE00Ufk3PBDQ4yfZ08V10_Qt50uPcSMVw",
  authDomain: "youth-ancheon.firebaseapp.com",
  projectId: "youth-ancheon",
  storageBucket: "youth-ancheon.firebasestorage.app",
  messagingSenderId: "124665542142",
  appId: "1:124665542142:web:ab61b2d54cbaf48510bcaf",
  measurementId: "G-1LPT72G2GZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);