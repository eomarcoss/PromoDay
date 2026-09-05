// front/src/middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { getRoleFromToken } from "@/utils/getRoleFromToken";

const rotasExclusivasCustomer = [
  "/promotions",
  "/redeems",
  "/stores",
  "/profile",
];

const rotasExclusivasSeller = [
  "/seller",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("@PromoDay:token")?.value;
  const userRole = getRoleFromToken(token);
  const { pathname } = request.nextUrl;

  const isCustomerRoute = rotasExclusivasCustomer.some((r) => pathname.startsWith(r));
  const isSellerRoute = rotasExclusivasSeller.some((r) => pathname.startsWith(r));
  const isProtectedRoute = isCustomerRoute || isSellerRoute;

  // Corrigido: /auth/login
  const isAuthRoute = pathname === "/auth/login" || pathname.startsWith("/register");

  // REGRA 1: Não autenticado tentando acessar rota protegida
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/auth/login", request.url); // Corrigido
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // REGRA 2: Logado tentando acessar páginas de login/registro
  if (isAuthRoute && token) {
    if (userRole === "SELLER") {
      return NextResponse.redirect(new URL("/seller/promotions", request.url));
    }
    return NextResponse.redirect(new URL("/promotions", request.url));
  }

  // REGRA 3: Bloqueio de acesso cruzado
  if (token && userRole) {
    if (isCustomerRoute && userRole === "SELLER") {
      return NextResponse.redirect(new URL("/seller/promotions", request.url));
    }
    if (isSellerRoute && userRole !== "SELLER") {
      return NextResponse.redirect(new URL("/promotions", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/promotions/:path*",
    "/seller/:path*",
    "/stores/:path*",
    "/redeems/:path*",
    "/profile/:path*",
    "/auth/login", // Corrigido
    "/register/:path*",
  ],
};
