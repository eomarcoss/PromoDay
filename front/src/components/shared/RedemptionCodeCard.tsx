"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

interface RedemptionCodeCardProps {
  imageUrl?: string;
  productName: string;
  quantity: number;
  code: string;
}

export function RedemptionCodeCard({
  imageUrl,
  productName,
  quantity,
  code,
}: RedemptionCodeCardProps) {
  // Estado para controlar se o código está visível ou oculto
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  return (
    <Card className="w-full max-w-3xl bg-neutral-100 border border-neutral-200 rounded-full shadow-sm overflow-hidden">
      <CardContent className="flex items-center justify-between h-full">
        {/* BLOCO DA ESQUERDA: Imagem, Nome e Quantidade */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Container da Imagem (Squircle) */}
          <div className="w-14 h-14 bg-neutral-900 rounded-[18px] flex items-center justify-center overflow-hidden shrink-0 border border-neutral-800 ml-1">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-3 h-3 bg-white rounded-full opacity-40" />
            )}
          </div>

          {/* Divisória Vertical 1 */}
          <div className="h-10 w-[1px] bg-neutral-200 mx-4 shrink-0" />

          {/* Nome do Produto */}
          <span className="text-base font-bold text-black truncate mr-4">
            {productName}
          </span>

          {/* Quantidade (Agora alinhada dinamicamente após o nome) */}
          <span className="text-base font-bold text-neutral-800 whitespace-nowrap ml-auto pr-4">
            {quantity} {quantity === 1 ? "unid" : "unid"}
          </span>
        </div>

        {/* Divisória Vertical 2 (Antes do bloco do código) */}
        <div className="h-10 w-[1px] bg-neutral-200 mx-2 shrink-0" />

        {/* BLOCO DA DIREITA: Caixa de Código Minimalista Escura */}
        <button
          type="button"
          onClick={() => setIsCodeVisible(!isCodeVisible)}
          className="h-full w-36 bg-neutral-900 hover:bg-black text-white p-2 flex flex-col items-center justify-center space-y-0.5 shrink-0 transition-colors group cursor-pointer border border-neutral-800"
        >
          <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 group-hover:text-neutral-300">
            Código
          </span>

          <div className="flex items-center space-x-1.5">
            <span className="text-sm font-mono font-bold tracking-wide">
              {isCodeVisible ? code : "••••••••"}
            </span>

            {/* Ícone dinâmico do Olho */}
            {isCodeVisible ? (
              <EyeOff className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
            )}
          </div>
        </button>
      </CardContent>
    </Card>
  );
}
