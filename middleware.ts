import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/forgot-password"];

const isPublicPath = (pathname: string): boolean => {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get("erp_auth")?.value === "1";
  const role = request.cookies.get("erp_role")?.value;
  const isFirstLogin = request.cookies.get("erp_first_login")?.value === "1";

  if (!isAuthenticated && !isPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && pathname === "/login") {
    const redirectPath =
      role === "admin"
        ? "/admin/dashboard"
        : isFirstLogin
          ? "/staff/reset-password"
          : "/staff/dashboard";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (isAuthenticated && role === "staff" && isFirstLogin && pathname !== "/staff/reset-password") {
    return NextResponse.redirect(new URL("/staff/reset-password", request.url));
  }

  if (isAuthenticated && role !== "admin" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/staff/dashboard", request.url));
  }

  if (isAuthenticated && role === "admin" && pathname.startsWith("/staff")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (
    isAuthenticated &&
    role !== "admin" &&
    (pathname.startsWith("/clients") ||
      pathname === "/staff" ||
      (pathname.startsWith("/staff/") &&
        pathname !== "/staff/dashboard" &&
        pathname !== "/staff/reset-password"))
  ) {
    return NextResponse.redirect(new URL("/staff/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
