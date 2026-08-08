"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Store, Ticket, User, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Verifica se o usuário é vendedor (seja pela role do context ou pela URL atual)
  const isSeller = user?.role === "SELLER" || pathname.startsWith("/seller");

  // Define o prefixo '/seller' para as URLs caso seja vendedor
  const basePath = isSeller ? "/seller" : "";

  // Estrutura de rotas base
  const baseItems = [
    {
      label: isSeller ? "Minhas Ofertas" : "Promoções",
      path: "/promotions",
      icon: ShoppingBag,
    },
    {
      label: "Lojas",
      path: "/stores",
      icon: Store,
    },
    {
      label: isSeller ? "Validar Cupom" : "Resgates",
      path: "/redeems",
      icon: Ticket,
    },
    {
      label: "Conta",
      path: "/profile",
      icon: User,
    },
  ];

  // 2. Filtra a aba "Lojas" se for Seller
  let navItems = isSeller
    ? baseItems.filter((item) => item.path !== "/stores")
    : baseItems;

  if (isSeller) {
    navItems.splice(0, 0, {
      label: "Anunciar",
      path: "/announce", // Exemplo de rota de criação
      icon: PlusCircle,
    });
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 bg-primary border-t px-4 pb-safe">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto bg-primary">
        {navItems.map((item) => {
          const Icon = item.icon;

          // Monta a URL completa baseada na role (ex: /seller/promotions ou /promotions)
          const href = `${basePath}${item.path}`;

          // Verifica se a rota atual é exatamente a URL montada
          const isActive = pathname === href;

          return (
            <Link
              key={item.path}
              href={href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all gap-1 cursor-pointer
                ${isActive ? "text-white scale-105" : "text-white/50 hover:text-neutral-300"}`}
            >
              <Icon
                className="w-6 h-6 transition-transform"
                strokeWidth={isActive ? 2.5 : 2}
              />

              <span
                className={`text-xs font-semibold tracking-wide transition-all whitespace-nowrap text-center
                ${isActive ? "font-bold text-white" : "text-white/50"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
