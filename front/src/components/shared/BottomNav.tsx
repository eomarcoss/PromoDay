"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Store, Ticket, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  // Estrutura de rotas do PromoDay para renderizar o menu dinamicamente
  const navItems = [
    {
      label: "Promoções",
      href: "/promotions",
      icon: ShoppingBag,
    },
    {
      label: "Lojas",
      href: "/stores",
      icon: Store,
    },
    {
      label: "Resgatados",
      href: "/redeems",
      icon: Ticket,
    },
    {
      label: "Conta",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    // Container externo fixado no rodapé, visível apenas em telas menores (mobile-first)
    <div className="sticky bottom-0 left-0 right-0 z-50  bg-black border-t border-neutral-800 px-4 pb-safe">
      {/* Menu de navegação */}
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto bg-black">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Verifica se a rota atual é a que está ativa para mudar o contraste
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all gap-1 cursor-pointer
                ${isActive ? "text-white scale-105" : "text-neutral-500 hover:text-neutral-300"}`}
            >
              {/* Ícone com traço mais espesso se estiver ativo */}
              <Icon
                className="w-6 h-6 transition-transform"
                strokeWidth={isActive ? 2.5 : 2}
              />

              {/* Texto do indicador */}
              <span
                className={`text-xs font-semibold tracking-wide transition-all
                ${isActive ? "font-bold text-white" : "text-neutral-500"}`}
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
