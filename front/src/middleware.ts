import { NextResponse, NextRequest } from "next/server";

// 1. Liste aqui todas as rotas que precisam de login obrigatório
const rotasProtegidas = ["/promotions", "/stores", "/redeems", "/profile"];

export function middleware(request: NextRequest) {
  // 2. Tenta recuperar o cookie de autenticação que salvamos no login
  const token = request.cookies.get("@PromoDay:token")?.value;

  const { pathname } = request.nextUrl;

  // 3. Se o usuário tentar acessar uma rota protegida E não tiver o token...
  const urlPrecisaDeLogin = rotasProtegidas.some((rota) =>
    pathname.startsWith(rota),
  );

  if (urlPrecisaDeLogin && !token) {
    // 🔀 Redireciona ele na marra para a tela de login
    return NextResponse.redirect(new URL("auth/login", request.url));
  }

  // 4. Se o usuário já estiver logado e tentar ir para o /login ou /register, manda pro /feed
  if ((pathname === "/login" || pathname.startsWith("/register")) && token) {
    return NextResponse.redirect(new URL("/promotions", request.url));
  }

  // Se estiver tudo OK, deixa a requisição continuar normalmente
  return NextResponse.next();
}

// 5. Configura o Next.js para rodar o middleware apenas nas nossas rotas, ignorando arquivos estáticos (imagens, etc)
export const config = {
  matcher: [
    "/promotions/:path*",
    "/stores/:path*",
    "/redeems/:path*",
    "/login",
    // "/register/:path*",
    "/profile/:path*",
  ],
};
