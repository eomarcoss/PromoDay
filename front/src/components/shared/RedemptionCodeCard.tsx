"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Ticket,
  CheckCircle2,
  Clock,
  XCircle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface RedemptionCodeCardProps {
  imageUrl?: string;
  productName: string;
  quantity: number;
  code: string;
  status?: "ACTIVE" | "USED" | "EXPIRED" | string;
  className?: string;
  seller?: {
    name?: string;
    avatarUrl?: string;
  };
}

export function RedemptionCodeCard({
  imageUrl,
  productName,
  quantity,
  code,
  status = "ACTIVE",
  className,
  seller,
}: RedemptionCodeCardProps) {
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  const baseColor = "bg-[#4264E2]";
  const textOnColor = "text-white";

  // Gerador de iniciais a partir do nome do vendedor
  const getInitials = (sellerName?: string) => {
    if (!sellerName) return "";
    const parts = sellerName.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  console.log("Seller", seller?.avatarUrl, seller?.name);

  const renderStatusBadge = () => {
    switch (status?.toUpperCase()) {
      case "USED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
            <CheckCircle2 className="w-3 h-3" /> Resgatado
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30">
            <XCircle className="w-3 h-3" /> Expirado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm">
            <Clock className="w-3 h-3" /> Disponível
          </span>
        );
    }
  };

  return (
    <Card
      className={cn(
        "relative w-full max-w-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.01]",
        baseColor,
        "border-none rounded-[20px] p-0",
        className,
      )}
    >
      {/* Recortes Semicirculares de Cupom nas Laterais */}
      <span className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-background rounded-full" />
      <span className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-background rounded-full" />

      <CardContent className="flex items-stretch p-0 relative">
        {/* SEÇÃO DA ESQUERDA: Imagem do Produto */}
        <div className="flex items-center justify-center p-4 w-1/3 min-w-[110px] relative">
          <div className="w-full h-24 flex items-center justify-center overflow-hidden relative rounded-lg bg-white/10 p-2">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={productName}
                className="w-full h-full object-contain p-1"
                sizes="(max-width: 768px) 100px, 150px"
              />
            ) : (
              <Ticket className={cn("w-10 h-10 opacity-40", textOnColor)} />
            )}
          </div>
        </div>

        {/* PERFURAÇÃO — Linha Pontilhada Vertical */}
        <div className="w-0 shrink-0 border-l-2 border-dashed border-white/30 my-3 z-10" />

        {/* SEÇÃO DA DIREITA: Informações e Código */}
        <div className="flex flex-col flex-1 min-w-0 p-5 pl-4 relative">
          {/* Header e Status */}
          <div className="flex flex-col gap-1 mb-auto">
            <div className="flex items-center justify-between gap-2 ">
              <span
                className={cn("text-xs font-medium opacity-80", textOnColor)}
              >
                {/* Cupom de Desconto */}
              </span>
              {renderStatusBadge()}
            </div>

            <h2
              className={cn(
                "text-lg font-bold leading-tight truncate pr-2",
                textOnColor,
              )}
              title={productName}
            >
              {productName}
            </h2>

            {/* SELLER PROFILE: Renderiza usando o objeto seller */}
            {seller && (seller.name || seller.avatarUrl) && (
              <div className="flex items-center gap-1.5 mt-1 opacity-90">
                <Link href={`/stores/${seller.id}`}>
                  <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 bg-white/20 border border-white/30 flex items-center justify-center">
                    {seller.avatarUrl ? (
                      <img
                        src={seller.avatarUrl}
                        alt={seller.name || "Vendedor"}
                        className="w-full h-full object-cover"
                      />
                    ) : seller.name ? (
                      <span className="text-[9px] font-bold text-white leading-none">
                        {getInitials(seller.name)}
                      </span>
                    ) : (
                      <User className="w-3 h-3 text-white/80" />
                    )}
                  </div>
                  {seller?.name && (
                    <span
                      className={cn(
                        "text-xs font-medium truncate opacity-90",
                        textOnColor,
                      )}
                      title={seller.name}
                    >
                      {seller.name}
                    </span>
                  )}
                </Link>
              </div>
            )}
          </div>

          {/* Área do Código e Ação */}
          <div className="flex items-end justify-between gap-3 mt-4">
            {/* O Código */}
            <div className="flex flex-col gap-0.5">
              <span
                className={cn(
                  "text-[10px] uppercase tracking-wider font-extrabold opacity-70",
                  textOnColor,
                )}
              >
                Código
              </span>
              <span
                className={cn(
                  "text-xl font-mono font-black tracking-wider",
                  textOnColor,
                )}
              >
                {isCodeVisible ? code : "••••••••"}
              </span>
            </div>

            {/* Quantidade e Botão Toggle */}
            <div className="flex items-center gap-3 shrink-0">
              <span className={cn("text-xs font-bold opacity-90", textOnColor)}>
                {quantity} {quantity === 1 ? "un." : "unid."}
              </span>

              <button
                type="button"
                onClick={() => setIsCodeVisible(!isCodeVisible)}
                className={cn(
                  "flex items-center justify-center gap-1.5 px-3.5 py-1.5",
                  "bg-white text-slate-900 shadow-sm",
                  "rounded-full hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all group cursor-pointer",
                )}
              >
                {isCodeVisible ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-slate-700 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold">Ocultar</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-slate-700 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold">Ver</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
