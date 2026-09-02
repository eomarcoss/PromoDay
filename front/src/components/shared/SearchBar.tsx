"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Link from "next/link";

interface Category {
  value: string;
  label: string;
}

interface SearchBarProps {
  placeholder?: string;
  categories?: Category[];
  onSearchSubmit?: (termo: string, categoria: string) => void;
  userRole?: "CUSTOMER" | "SELLER" | string; // 👈 Opcional: podemos receber a role ou mapear dinamicamente pela rota atual
}

const defaultCategories: Category[] = [
  { value: "todas", label: "Todas" },
  { value: "supermercado", label: "Supermercados & Mercados" },
  { value: "farmacia", label: "Farmácias & Drogaria" },
  { value: "padaria", label: "Padarias & Confeitarias" },
  { value: "hortifruti", label: "Hortifrúti & Feira" },
  { value: "restaurante", label: "Restaurantes & Lanchonetes" },
  { value: "petshop", label: "Pet Shops" },
  { value: "vestuario", label: "Roupas & Acessórios" },
  { value: "eletronicos", label: "Eletrônicos & Informática" },
  { value: "servicos", label: "Serviços" },
  { value: "outros", label: "Outros" },
];

export function SearchBar({
  placeholder = "Buscar produtos, lojas ou cupons...",
  categories = defaultCategories,
  onSearchSubmit,
  userRole,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [termo, setTermo] = useState(searchParams.get("search") || "");
  const [categoria, setCategoria] = useState(searchParams.get("category") || "todas");

  // Define dinamicamente o alvo da pesquisa com base na rota atual ou na role
  const isSellerArea = pathname.startsWith("/seller") || userRole === "SELLER";
  const targetRoute = isSellerArea ? "/seller/promotions" : "/promotions";

  useEffect(() => {
    // 🛡️ Trava de segurança adaptada: só atualiza via debounce se o usuário estiver na rota correspondente à sua listagem
    if (pathname !== targetRoute) {
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams();

      if (termo.trim()) {
        params.set("search", termo.trim());
      }

      if (categoria && categoria !== "todas") {
        params.set("category", categoria);
      }

      const currentQuery = searchParams.toString();
      const newQuery = params.toString();

      if (currentQuery !== newQuery) {
        router.push(`${targetRoute}?${newQuery}`);
      }

      if (onSearchSubmit) {
        onSearchSubmit(termo, categoria);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [termo, categoria, router, searchParams, pathname, targetRoute, onSearchSubmit]);

  const handleCategoryChange = (novaCategoria: string) => {
    setCategoria(novaCategoria);
    // Se mudar a categoria fora da página alvo, redireciona para a rota correta (Seller ou Customer)
    if (pathname !== targetRoute) {
      const params = new URLSearchParams();
      if (termo.trim()) params.set("search", termo.trim());
      if (novaCategoria && novaCategoria !== "todas") params.set("category", novaCategoria);
      router.push(`${targetRoute}?${params.toString()}`);
    }
  };

  return (
    <div className="bg-primary p-4 flex justify-center items-center sticky top-0 left-0 w-full z-50 flex-row gap-5">
      <Link href={targetRoute}>
        <h1 className="text-2xl font-bold text-card">Promoday</h1>
      </Link>
      <div className="flex w-full max-w-4xl h-full items-center bg-white rounded-full border border-neutral-300 shadow-sm focus-within:ring-2 focus-within:ring-black transition-all overflow-hidden">
        <div className="relative flex-1 h-full flex items-center">
          <Input
            type="text"
            value={termo}
            placeholder={placeholder}
            onChange={(e) => {
              setTermo(e.target.value);
              // Se digitar estando em outra tela, redireciona instantaneamente para a rota correta com o termo
              if (pathname !== targetRoute) {
                router.push(`${targetRoute}?search=${encodeURIComponent(e.target.value)}`);
              }
            }}
            className="w-full h-full bg-transparent border-none text-black placeholder:text-neutral-400 pl-6 pr-12 text-base rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button
            type="button"
            className="absolute right-4 text-neutral-400 pointer-events-none"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="h-6 w-[1px] bg-neutral-300" />

        <Select value={categoria} onValueChange={handleCategoryChange}>
          <SelectTrigger className="h-full w-[140px] bg-white hover:bg-primary text-primary hover:text-white font-semibold text-base rounded-none border-none transition-colors focus:ring-0 focus:ring-offset-0 gap-2 cursor-pointer [&>svg]:text-primary/70">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>

          <SelectContent className="bg-white border border-neutral-200 text-black rounded-xl shadow-lg">
            {categories.map((cat) => (
              <SelectItem
                key={cat.value}
                value={cat.value}
                className="cursor-pointer font-medium focus:bg-neutral-100 focus:text-black transition-colors"
              >
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}