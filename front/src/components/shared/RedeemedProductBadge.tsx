import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PackageCheck } from "lucide-react";

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
    <Card className="relative w-full max-w-xl bg-gradient-to-r from-[#2D62EA] to-[#1E4DC2] text-white border-none rounded-[24px] shadow-md hover:shadow-lg transition-all overflow-hidden p-0">
      {/* Recorte Semicircular de Ticket na lateral direita */}
      <span className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-[#F7F9F6] rounded-full pointer-events-none" />

      <CardContent className="flex items-stretch p-0 relative min-h-[108px]">
        {/* SEÇÃO DA ESQUERDA: Imagem do Produto */}
        <div className="flex items-center justify-center p-3.5 w-1/3 min-w-[100px] max-w-[120px] relative">
          <div className="w-full h-20 flex items-center justify-center overflow-hidden relative rounded-2xl bg-white/10 p-1.5 backdrop-blur-xs">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={productName}
                className="w-full h-full object-contain drop-shadow-sm transition-transform hover:scale-105"
              />
            ) : (
              <PackageCheck className="w-8 h-8 text-white/50" />
            )}
          </div>
        </div>

        {/* PERFURAÇÃO / LINHA VERTICAL PONTILHADA */}
        <div className="w-0 shrink-0 border-l border-dashed border-white/30 my-3 z-10" />

        {/* SEÇÃO DA DIREITA: Informações e Quantidade no Pill Branco */}
        <div className="flex flex-col justify-between flex-1 min-w-0 p-4 pl-4 pr-7 relative">
          {/* Top: Nome e Subtítulo */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <h3
              className="text-base sm:text-lg font-bold text-white leading-snug truncate"
              title={productName}
            >
              {productName}
            </h3>
            <span className="text-xs text-white/75 font-medium tracking-wide">
              Item Resgatado
            </span>
          </div>

          {/* Bottom: Quantidade no Pill Branco no estilo do design de referência */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className="text-xs font-semibold text-white/90">
              Entrega confirmada
            </span>

            <div className="bg-white text-slate-950 font-bold text-xs px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1 shrink-0">
              <span>
                {quantity} {quantity === 1 ? "un." : "unid."}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
