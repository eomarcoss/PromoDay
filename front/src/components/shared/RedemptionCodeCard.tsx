"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Ticket } from "lucide-react";
import { cn } from "@/lib/utils"; // Certifique-se de ter essa função utilitária do shadcn

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
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  // Define a cor base inspirada na imagem, mas que pode ser controlada por prop/tema futuramente
  const baseColor = "bg-[#4264E2]"; // Um azul vibrante próximo ao da imagem
  const textOnColor = "text-white";

  return (
    <Card
      className={cn(
        "relative w-full max-w-xl",
        baseColor,
        "border-none rounded-[20px]  p-0 ",
      )}
    >
      {/* Recorte Semicircular Lateral Direito */}
      <span className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white rounded-full " />

      <CardContent className="flex items-stretch p-0 relative">
        {/* SEÇÃO DA ESQUERDA: Imagem */}
        <div className="flex items-center justify-center p-4 min-w-0 w-1/3 relative">
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={productName}
                className="max-w-[70%] max-h-[70%] object-contain"
              />
            ) : (
              <Ticket className={cn("w-10 h-10 opacity-30", textOnColor)} />
            )}
          </div>
        </div>

        {/* PERFURAÇÃO — linha pontilhada de destaque vertical */}
        <div className="w-0 shrink-0 border-l-2 border-dashed border-white/40 z-10" />

        {/* SEÇÃO DA DIREITA: Textos e Código */}
        <div className="flex flex-col flex-1 min-w-0 p-5 relative">
          {/* Header do Texto */}
          <div className="flex flex-col gap-0.5 mb-auto">
            <h2
              className={cn(
                "text-lg font-bold leading-tight truncate",
                textOnColor,
              )}
            >
              {productName}
            </h2>
            <p className={cn("text-xs font-medium opacity-80", textOnColor)}>
              Resgate de cupom
            </p>
          </div>

          {/* Área do Código e Detalhes */}
          <div className="flex items-end justify-between gap-3 mt-4">
            {/* O Código */}
            <div className="flex flex-col gap-1">
              <span
                className={cn(
                  "text-[10px] uppercase tracking-wider font-bold opacity-70",
                  textOnColor,
                )}
              >
                Código
              </span>
              <span
                className={cn(
                  "text-2xl font-mono font-bold tracking-tight",
                  textOnColor,
                )}
              >
                {isCodeVisible ? code : "••••••••"}
              </span>
            </div>

            {/* Pílula de Detalhe e Toggle */}
            <div className="flex items-end gap-2 shrink-0">
              <span
                className={cn("text-xs font-medium opacity-90", textOnColor)}
              >
                {quantity} {quantity === 1 ? "unidade" : "unidades"}
              </span>

              <button
                type="button"
                onClick={() => setIsCodeVisible(!isCodeVisible)}
                className={cn(
                  "flex items-center justify-center gap-1.5 px-3.5 py-1.5",
                  "bg-white text-foreground", // Cor invertida para a pílula
                  "rounded-full  hover:scale-105 transition-all group",
                )}
              >
                {isCodeVisible ? (
                  <EyeOff className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                ) : (
                  <Eye className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                )}
                <span className="text-xs font-bold">Ver</span>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
