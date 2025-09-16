// utils/cookies.js - SERVER-SIDE ONLY
// This file uses next/headers and should only be imported in server components or API routes
import { cookies } from "next/headers";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 30 * 24 * 60 * 60, // 30 days
};

// ✅ Set Access Token
export const setAccessTokenCookie = async (token) => {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", token, COOKIE_OPTIONS);
};

// ✅ Set Refresh Token
export const setRefreshTokenCookie = async (token) => {
  const cookieStore = await cookies();
  cookieStore.set("refreshToken", token, REFRESH_COOKIE_OPTIONS);
};

// ✅ Set both
export const setTokenCookies = async (accessToken, refreshToken) => {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, COOKIE_OPTIONS);
  cookieStore.set("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
};

// ✅ Clear Access Token
export const clearAccessTokenCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });
};

// ✅ Clear Refresh Token
export const clearRefreshTokenCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.set("refreshToken", "", { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });
};

// ✅ Clear both
export const clearTokenCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });
  cookieStore.set("refreshToken", "", { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });
};

// ✅ Read Access Token
export const getAccessTokenFromCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
};

// ✅ Read Refresh Token
export const getRefreshTokenFromCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken")?.value || null;
};

// ✅ Get token from Authorization header or cookies
export const getTokenFromRequest = async (req) => {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
};