import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PromoCardProps {
  productName?: string;
  storeName?: string;
  originalPrice?: number;
  discountPrice?: number;
  discountPercentage?: number;
  timeLeft?: string;
  imageUrl?: string;
}

// 1. Mudança aqui: Trocamos 'const' por 'export function' e ajustamos a sintaxe das Props
export function PromoCard({
  productName = "Carregador tipo C",
  storeName = "Super Cell",
  originalPrice = 49.9,
  discountPrice = 39.9,
  discountPercentage = 20,
  timeLeft = "1d:12h",
  imageUrl,
}: PromoCardProps) {
  // <-- A tipagem das props vem aqui no final do parêntese

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",");
  };

  return (
    <div className="bg-[#FFE4E6] p-10 flex justify-center items-center font-sans">
      <Card className="w-md bg-[#E2D6D6] rounded-[32px] p-6 border-none shadow-md flex flex-col items-center">
        <CardHeader className="w-full p-0  relative aspect-[4/3] bg-[#3B2A2A] rounded-[24px] overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full" />
          )}

          <div className="absolute top-4 right-4 w-14 h-14 bg-[#E0D0D0] rounded-full flex flex-col items-center justify-center shadow-inner border border-[#C6B0B0]">
            <span className="text-[#3B2A2A] text-lg font-extrabold leading-none">
              {discountPercentage}%
            </span>
            <span className="text-[#3B2A2A] text-xs font-bold leading-none">
              off
            </span>
          </div>
        </CardHeader>

        <CardContent className="w-full p-0 text-center my-0 space-y-3">
          <h3 className="text-[#3B2A2A] text-2xl font-extrabold tracking-tight">
            {productName}
          </h3>

          <div className="flex items-center  space-x-2">
            <div className="w-10 h-10 rounded-full bg-[#3B2A2A]" />
            <span className="text-[#3B2A2A] text-xl font-medium">
              {storeName}
            </span>
          </div>

          <div className="flex  space-x-8 items-baseline">
            <div className="flex items-start">
              <span className="text-[#3B2A2A] text-xl font-bold">De:</span>
              <span className="text-[#3B2A2A] text-xl font-semibold line-through decoration-2">
                {formatPrice(originalPrice)}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-[#3B2A2A] text-xl font-bold">Por:</span>
              <span className="text-[#3B2A2A] text-xl font-black text-black">
                {formatPrice(discountPrice)}
              </span>
            </div>
          </div>

          <p className="text-[#3B2A2A] text-start text-xl font-bold">
            Duração: {timeLeft}
          </p>
        </CardContent>

        <CardFooter className="w-full p-0">
          <Button className="cursor-pointer w-full bg-[#604D4D] hover:bg-[#4A3B3B] text-white text-xl font-bold py-7 rounded-full transition-colors">
            Resgatar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
