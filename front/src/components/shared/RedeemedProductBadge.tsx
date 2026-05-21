import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface RedeemedProductBadgeProps {
  imageUrl?: string;
  productName: string;
  quantity: number;
}

export function RedeemedProductBadge({
  imageUrl,
  productName,
  quantity,
}: RedeemedProductBadgeProps) {
  return (
    <Card className="w-full max-w-2xl bg-neutral-100 border py-3 border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
      <CardContent className=" flex items-center justify-between">
        {/* BLOCO DA ESQUERDA: Imagem + Nome do Produto */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Container da Imagem (Squircle Minimalista) */}
          <div className="w-20 h-20 bg-neutral-900 rounded-[18px] flex items-center justify-center overflow-hidden shrink-0 border border-neutral-800 ml-1">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={productName}
                className="w-full h-full object-cover"
              />
            ) : (
              // Placeholder caso o produto esteja sem foto
              <div className="w-3 h-3 bg-white rounded-full opacity-40 animate-pulse" />
            )}
          </div>

          {/* Divisória Vertical 1 */}
          <div className="h-10 w-[1px] bg-neutral-200 mx-4 shrink-0" />

          {/* Nome do Produto (Truncado se for muito longo para não quebrar o layout) */}
          <span className="text-base font-bold text-black truncate pr-4">
            {productName}
          </span>
        </div>

        {/* BLOCO DA DIREITA: Quantidade Resgatada */}
        <div className="flex items-center shrink-0 pr-6">
          {/* Divisória Vertical 2 */}
          <div className="h-10 w-[1px] bg-neutral-200 mr-6" />

          {/* Texto da Quantidade */}
          <span className="text-base font-bold text-black whitespace-nowrap">
            {quantity} {quantity === 1 ? "Unid" : "Unid"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
