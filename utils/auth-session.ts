import type { UserRole } from "@/types/auth";

const AUTH_COOKIE = "erp_auth";
const ROLE_COOKIE = "erp_role";
const FIRST_LOGIN_COOKIE = "erp_first_login";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;

export const setAuthSessionCookies = (
  role: UserRole,
  options?: { isFirstLogin?: boolean }
): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
  document.cookie = `${ROLE_COOKIE}=${encodeURIComponent(
    role
  )}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
  document.cookie = `${FIRST_LOGIN_COOKIE}=${options?.isFirstLogin ? "1" : "0"}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
};

export const setFirstLoginCookie = (isFirstLogin: boolean): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${FIRST_LOGIN_COOKIE}=${isFirstLogin ? "1" : "0"}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
};

export const clearAuthSessionCookies = (): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; samesite=lax`;
  document.cookie = `${FIRST_LOGIN_COOKIE}=; path=/; max-age=0; samesite=lax`;
};
