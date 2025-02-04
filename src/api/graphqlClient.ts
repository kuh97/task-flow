import { GraphQLClient } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "@/config/graphql";
import CryptoJS from "crypto-js";
import { useAuthStore } from "@/store/authStore";

const SECRET_KEY = import.meta.env.VITE_JWT_SECRET;
const SESSION_KEY = "encryptedAuth";

const client = new GraphQLClient(GRAPHQL_ENDPOINT);

// 암호화된 토큰 저장 (세션 스토리지에 저장)
export const setAuthToken = (token: string) => {
  // 새로 받은 토큰인 경우에만 암호화 저장
  if (!sessionStorage.getItem(SESSION_KEY)) {
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(token, SECRET_KEY, {
      iv,
      mode: CryptoJS.mode.CBC,
    });
    const data = iv.toString() + encrypted.toString();
    sessionStorage.setItem(SESSION_KEY, data);
  }

  client.setHeader("Authorization", `Bearer ${token}`);
  useAuthStore.getState().initializeAuth();
};

// 복호화 함수
export const getAuthToken = () => {
  const data = sessionStorage.getItem(SESSION_KEY);
  if (!data || data.length < 32) return null;

  try {
    const iv = CryptoJS.enc.Hex.parse(data.substring(0, 32));
    const ciphertext = data.substring(32);

    const decrypted = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY, {
      iv,
      mode: CryptoJS.mode.CBC,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("복호화 실패:", error);
    removeAuthToken();
    return null;
  }
};

// 토큰 삭제
export const removeAuthToken = () => {
  sessionStorage.removeItem(SESSION_KEY);
  client.setHeader("Authorization", "");
};

export default client;
