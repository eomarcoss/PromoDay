import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PromoCardProps {
  product: {
    productName?: string;
    storeName?: string;
    originalPrice?: number;
    discountPrice?: number;
    discountPercentage?: number;
    timeLeft?: string;
    imageUrl?: string;
  };
}

// 1. Mudança aqui: Trocamos 'const' por 'export function' e ajustamos a sintaxe das Props
export function PromoCard({ product }: PromoCardProps) {
  // <-- A tipagem das props vem aqui no final do parêntese

  const formatPrice = (price?: number) => {
    return price?.toFixed(2).replace(".", ",") || "Preço não disponível";
  };

  return (
    <div className="p-0 flex justify-center items-center font-sans">
      <Card className="w-md bg-[#c5c5c5] rounded-[32px] p-4 border-none shadow-md flex flex-col items-center h-full">
        <CardHeader className="w-full p-0  relative aspect-[4/3] bg-[#1e1e1e] rounded-[24px] overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="lg:w-xs lg:-xs" />
          )}

          <div className="absolute top-4 right-4 w-14 h-14 bg-[#c7c7c7] rounded-full flex flex-col items-center justify-center shadow-inner border border-[#C6B0B0]">
            <span className="text-[#3B2A2A] text-lg font-extrabold leading-none">
              {product.discountPercentage}%
            </span>
            <span className="text-[#3B2A2A] text-xs font-bold leading-none">
              off
            </span>
          </div>
        </CardHeader>

        <CardContent className="w-full p-0 text-center my-0 space-y-3">
          <h3 className="text-[#000000] text-lg font-extrabold tracking-tight">
            {product.productName}
          </h3>

          <div className="flex items-center  space-x-2">
            <div className="w-10 h-10 rounded-full bg-[#3B2A2A]" />
            <span className="text-[#3B2A2A] text-lg font-medium">
              {product.storeName}
            </span>
          </div>

          <div className="flex  space-x-8 items-baseline">
            <div className="flex items-start">
              <span className="text-[#3B2A2A] text-base font-bold">De:</span>
              <span className="text-[#3B2A2A] text-base font-semibold line-through decoration-2">
                {formatPrice(product.originalPrice)}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-[#3B2A2A] text-base font-bold">Por:</span>
              <span className="text-[#3B2A2A] text-base font-black text-black">
                {formatPrice(product.discountPrice)}
              </span>
            </div>
          </div>

          <p className="text-[#3B2A2A] text-start text-base font-bold">
            Duração: {product.timeLeft}
          </p>
        </CardContent>

        <CardFooter className="w-full p-0">
          <Button className="cursor-pointer w-full bg-[#101010] hover:bg-[#2e2e2e] text-white text-base font-bold py-7 rounded-full transition-colors">
            Resgatar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
