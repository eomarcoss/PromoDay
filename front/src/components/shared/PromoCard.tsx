import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 1. Tipagem unificada das propriedades recebidas
export interface PromoCardProps {
  name: string;
  storeName: string;
  originalPrice: number;
  promoPrice: number;
  discountPercentage: number;
  timeLeft: string;
  imageUrl: string;
}

export function PromoCard({ product }: { product: PromoCardProps }) {
  // Formatação de preço no padrão brasileiro (R$ 0,00)
  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return "R$ --";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="p-0 flex justify-center items-center font-sans h-full">
      <Card className="w-full max-w-md bg-[#c5c5c5] rounded-[32px] p-4 border-none shadow-md flex flex-col items-center justify-between h-full">
        {/* Imagem do Produto */}
        <CardHeader className="w-full p-0 relative aspect-[4/3] bg-[#1e1e1e] rounded-[24px] overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-400">
              Sem Imagem
            </div>
          )}

          {/* Badge de % Desconto */}
          <div className="absolute top-4 right-4 w-14 h-14 bg-[#c7c7c7] rounded-full flex flex-col items-center justify-center shadow-inner border border-[#C6B0B0]">
            <span className="text-[#3B2A2A] text-lg font-extrabold leading-none">
              {product.discountPercentage}%
            </span>
            <span className="text-[#3B2A2A] text-xs font-bold leading-none">
              off
            </span>
          </div>
        </CardHeader>

        {/* Informações da Promoção */}
        <CardContent className="w-full p-0 text-center my-4 space-y-3 flex-1 flex flex-col justify-between">
          {/* 🚀 Ajustado: Usando product.name em vez de product.productName */}
          <h3 className="text-[#000000] text-lg font-extrabold tracking-tight text-left line-clamp-1">
            {product.name}
          </h3>

          {/* Loja parceira */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#3B2A2A] flex-shrink-0" />
            <span className="text-[#3B2A2A] text-sm font-bold truncate">
              {product.storeName}
            </span>
          </div>

          {/* Preços */}
          <div className="flex space-x-4 items-baseline justify-start">
            <div className="flex items-center space-x-1">
              <span className="text-[#3B2A2A] text-xs font-bold">De:</span>
              <span className="text-[#3B2A2A] text-xs font-semibold line-through decoration-2">
                {formatPrice(product.originalPrice)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-[#3B2A2A] text-xs font-bold">Por:</span>
              {/* 🚀 Ajustado: Usando product.promoPrice em vez de product.discountPrice */}
              <span className="text-[#3B2A2A] text-base font-black text-black">
                {formatPrice(product.promoPrice)}
              </span>
            </div>
          </div>

          <p className="text-[#3B2A2A] text-start text-xs font-bold">
            Término: {new Date(product.timeLeft).toLocaleDateString("pt-BR")}
          </p>
        </CardContent>

        {/* Botão de Ação */}
        <CardFooter className="w-full p-0 mt-2">
          <Button className="cursor-pointer w-full bg-[#101010] hover:bg-[#2e2e2e] text-white text-base font-bold py-6 rounded-full transition-colors">
            Resgatar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
