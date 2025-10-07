// utils/clientCookies.js - Client-side cookie utilities

// Client-side cookie options
const COOKIE_OPTIONS = {
  httpOnly: false, // Client-side cookies can't be httpOnly
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 30 * 24 * 60 * 60, // 30 days
};

// ✅ Set Access Token (client-side)
export const setAccessTokenCookie = (token) => {
  if (typeof document !== 'undefined') {
    document.cookie = `accessToken=${token}; max-age=${COOKIE_OPTIONS.maxAge}; path=${COOKIE_OPTIONS.path}; samesite=${COOKIE_OPTIONS.sameSite}${COOKIE_OPTIONS.secure ? '; secure' : ''}`;
  }
};

// ✅ Set Refresh Token (client-side)
export const setRefreshTokenCookie = (token) => {
  if (typeof document !== 'undefined') {
    document.cookie = `refreshToken=${token}; max-age=${REFRESH_COOKIE_OPTIONS.maxAge}; path=${REFRESH_COOKIE_OPTIONS.path}; samesite=${REFRESH_COOKIE_OPTIONS.sameSite}${REFRESH_COOKIE_OPTIONS.secure ? '; secure' : ''}`;
  }
};

// ✅ Set both (client-side)
export const setTokenCookies = (accessToken, refreshToken) => {
  setAccessTokenCookie(accessToken);
  setRefreshTokenCookie(refreshToken);
};

// ✅ Clear Access Token (client-side)
export const clearAccessTokenCookie = () => {
  if (typeof document !== 'undefined') {
    document.cookie = `accessToken=; max-age=0; path=${COOKIE_OPTIONS.path}; samesite=${COOKIE_OPTIONS.sameSite}${COOKIE_OPTIONS.secure ? '; secure' : ''}`;
  }
};

// ✅ Clear Refresh Token (client-side)
export const clearRefreshTokenCookie = () => {
  if (typeof document !== 'undefined') {
    document.cookie = `refreshToken=; max-age=0; path=${REFRESH_COOKIE_OPTIONS.path}; samesite=${REFRESH_COOKIE_OPTIONS.sameSite}${REFRESH_COOKIE_OPTIONS.secure ? '; secure' : ''}`;
  }
};

// ✅ Clear both (client-side)
export const clearTokenCookies = () => {
  clearAccessTokenCookie();
  clearRefreshTokenCookie();
};

// ✅ Read Access Token (client-side)
export const getAccessTokenFromCookie = () => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const accessTokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith('accessToken=')
  );
  
  return accessTokenCookie ? accessTokenCookie.split('=')[1] : null;
};

// ✅ Read Refresh Token (client-side)
export const getRefreshTokenFromCookie = () => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const refreshTokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith('refreshToken=')
  );
  
  return refreshTokenCookie ? refreshTokenCookie.split('=')[1] : null;
};

// ✅ Get token from Authorization header or cookies (client-side)
export const getTokenFromRequest = (req) => {
  // For client-side, we can't access request headers directly
  // This function is mainly for server-side use
  return getAccessTokenFromCookie();
};

