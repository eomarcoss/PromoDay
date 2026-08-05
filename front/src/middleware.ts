import { NextResponse, NextRequest } from "next/server";

// 1. Rotas comuns que exigem apenas autenticação (acessíveis por CUSTOMER e SELLER)
// Adicionamos /promotions aqui para que Sellers também vejam os detalhes das promoções
const rotasProtegidasComuns = [
  "/profile",
  "/redeems",
  "/promotions",
  "/promotions/:path*",
];

// 2. Rotas exclusivas por perfil
const rotasExclusivasSeller = ["/seller", "/stores"];

// 3. Deixe aqui apenas páginas estritamente exclusivas do Cliente (se houver)
const rotasExclusivasCustomer: string[] = [
  // Exemplo: "/checkout", "/my-orders" (se existirem no seu app)
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("@PromoDay:token")?.value;
  const userRole = request.cookies.get("@PromoDay:role")?.value;

  const { pathname } = request.nextUrl;

  const isComunRoute = rotasProtegidasComuns.some((r) =>
    pathname.startsWith(r),
  );
  const isSellerRoute = rotasExclusivasSeller.some((r) =>
    pathname.startsWith(r),
  );
  const isCustomerRoute = rotasExclusivasCustomer.some((r) =>
    pathname.startsWith(r),
  );

  const isProtectedRoute = isComunRoute || isSellerRoute || isCustomerRoute;
  const isAuthRoute = pathname === "/login" || pathname.startsWith("/register");

  // REGRA 1: Não autenticado tentando acessar qualquer rota protegida
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // REGRA 2: Logado tentando acessar Login/Registro
  if (isAuthRoute && token) {
    if (userRole === "SELLER") {
      return NextResponse.redirect(new URL("/seller/promotions", request.url));
    }
    return NextResponse.redirect(new URL("/promotions", request.url));
  }

  // REGRA 3: Bloqueio de acesso cruzado
  if (token && userRole) {
    // CUSTOMER tentando acessar área do Vendedor
    if (isSellerRoute && userRole !== "SELLER") {
      return NextResponse.redirect(new URL("/promotions", request.url));
    }

    // SELLER tentando acessar rotas EXCLUSIVAS de Cliente
    if (isCustomerRoute && userRole === "SELLER") {
      return NextResponse.redirect(new URL("/seller/promotions", request.url));
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
    "/login",
    "/register/:path*",
  ],
};
