"use client"; // Obrigatório aqui em cima, pois o componente agora gerencia estado próprio

import React, { useState } from "react";
import { Search } from "lucide-react";
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
  // Caso a página ainda queira saber o valor final para fazer a busca no NestJS:
  onSearchSubmit?: (termo: string, categoria: string) => void;
}

const defaultCategories: Category[] = [
  { value: "todas", label: "Todos" },
  { value: "eletronicos", label: "Eletrônicos" },
  { value: "acessorios", label: "Acessórios" },
  { value: "servicos", label: "Serviços" },
];

export function SearchBar({
  placeholder = "Buscar produtos, lojas ou cupons...",
  categories = defaultCategories,
  onSearchSubmit,
}: SearchBarProps) {
  // 1. Criamos os estados internos do componente
  const [termo, setTermo] = useState("");
  const [categoria, setCategoria] = useState("todas");

  // 2. A FUNÇÃO INTERNA: Ela gerencia a mudança e, se necessário, avisa a página externa
  const handleCategoryChange = (novaCategoria: string) => {
    setCategoria(novaCategoria);
    console.log("Estado interno atualizado no componente:", novaCategoria);

    // Opcional: Se a página passou a prop de submit, avisa ela com os dados atualizados
    if (onSearchSubmit) {
      onSearchSubmit(termo, novaCategoria);
    }
  };

  return (
    <div className="bg-white p-4 flex justify-center items-center sticky top-0 left-0 w-full z-50 flex-row gap-5">
      <Link href="/promotions">
        <h1 className="text-2xl font-bold text-black">Promoday</h1>
      </Link>
      <div className="flex w-full max-w-4xl h-full items-center bg-white rounded-full border border-neutral-300 shadow-sm focus-within:ring-2 focus-within:ring-black transition-all overflow-hidden">
        {/* Área do Input */}
        <div className="relative flex-1 h-full flex items-center">
          <Input
            type="text"
            placeholder={placeholder}
            onChange={(e) => setTermo(e.target.value)} // Atualiza o termo internamente
            className="w-full h-full bg-transparent border-none text-black placeholder:text-neutral-400 pl-6 pr-12 text-base rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button className="absolute right-4 text-neutral-400 cursor-pointer hover:text-neutral-600 transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="h-6 w-[1px] bg-neutral-300" />

        {/* 3. Conectamos a nossa função interna no Select do Shadcn */}
        <Select defaultValue="todas" onValueChange={handleCategoryChange}>
          <SelectTrigger className="h-full w-[140px]  bg-neutral-800 hover:bg-black text-white font-semibold text-base rounded-none border-none transition-colors focus:ring-0 focus:ring-offset-0 gap-2 cursor-pointer [&>svg]:text-white/70">
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
