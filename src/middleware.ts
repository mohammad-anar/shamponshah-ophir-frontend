import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JwtPayload {
  sub?: string;
  email?: string;
  role?: "ADMIN" | "VENDOR" | "CLIENT" | string;
  exp?: number;
  iat?: number;
}

/**
 * Safely parse JWT payload in Next.js Edge runtime without external dependencies.
 */
function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Helper to determine default redirect dashboard for each role
 */
function getRoleDashboard(role?: string): string {
  switch (role?.toUpperCase()) {
    case "ADMIN":
      return "/admin";
    case "VENDOR":
      return "/vendor";
    case "CLIENT":
      return "/user";
    default:
      return "/login";
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve token and role from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const cookieRole = request.cookies.get("role")?.value || request.cookies.get("roll")?.value;

  // Validate token
  let userRole: string | undefined = undefined;
  let isAuthenticated = false;

  if (accessToken) {
    const decoded = parseJwtPayload(accessToken);
    if (decoded) {
      // Check if token has expired
      const isExpired = decoded.exp ? Date.now() >= decoded.exp * 1000 : false;
      if (!isExpired) {
        isAuthenticated = true;
        userRole = decoded.role || cookieRole;
      }
    }
  }

  // Normalize role to uppercase
  const normalizedRole = userRole?.toUpperCase();

  // 1. Guest-only Auth routes: /login, /register, /register/select-role
  const isAuthRoute =
    pathname === "/login" ||
    pathname.startsWith("/register");

  if (isAuthRoute) {
    if (isAuthenticated && normalizedRole) {
      // Already authenticated -> redirect to their role dashboard
      const targetDashboard = getRoleDashboard(normalizedRole);
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }
    return NextResponse.next();
  }

  // 2. Generic Dashboard redirector: /dashboard, /dashboard/*
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!isAuthenticated || !normalizedRole) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const targetDashboard = getRoleDashboard(normalizedRole);
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  // 3. Admin Protected Routes: /admin, /admin/*
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (normalizedRole !== "ADMIN") {
      // Unauthorized role -> redirect to their own role dashboard
      const targetDashboard = getRoleDashboard(normalizedRole);
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }

    return NextResponse.next();
  }

  // 4. Vendor Protected Routes: /vendor, /vendor/*
  if (pathname === "/vendor" || pathname.startsWith("/vendor/")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (normalizedRole !== "VENDOR") {
      // Unauthorized role -> redirect to their own role dashboard
      const targetDashboard = getRoleDashboard(normalizedRole);
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }

    return NextResponse.next();
  }

  // 5. Client (User) Protected Routes: /user, /user/*
  if (pathname === "/user" || pathname.startsWith("/user/")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (normalizedRole !== "CLIENT") {
      // Unauthorized role -> redirect to their own role dashboard
      const targetDashboard = getRoleDashboard(normalizedRole);
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/vendor/:path*",
    "/vendor",
    "/user/:path*",
    "/user",
    "/dashboard/:path*",
    "/dashboard",
    "/login",
    "/register",
    "/register/:path*",
  ],
};
