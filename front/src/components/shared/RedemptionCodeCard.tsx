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
  Store,
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
    id?: string;
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

  const renderStatusBadge = () => {
    switch (status?.toUpperCase()) {
      case "USED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
            <CheckCircle2 className="w-3 h-3" /> Resgatado
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-950/30 text-rose-100 border border-rose-300/30 backdrop-blur-xs">
            <XCircle className="w-3 h-3" /> Expirado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
            <Clock className="w-3 h-3" /> Disponível
          </span>
        );
    }
  };

  return (
    <Card
      className={cn(
        "relative w-full max-w-xl text-white overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-none rounded-[26px] p-0",
        "bg-gradient-to-r from-[#0DA059] to-[#0A8749]", // Fundo verde fixo
        className
      )}
    >
      {/* Recorte Semicircular de Cupom/Ticket na Lateral Direita */}
      <span className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-[#F7F9F6] rounded-full pointer-events-none" />

      <CardContent className="flex items-stretch p-0 relative min-h-[118px]">
        {/* SEÇÃO DA ESQUERDA: Imagem do Produto */}
        <div className="flex items-center justify-center p-3.5 w-1/3 min-w-[105px] max-w-[125px] relative">
          <div className="w-full h-22 flex items-center justify-center overflow-hidden relative rounded-2xl bg-white/15 p-1.5 backdrop-blur-xs shadow-inner">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={productName}
                className="w-full h-full object-contain p-0.5 drop-shadow-sm transition-transform hover:scale-105"
              />
            ) : (
              <Ticket className="w-9 h-9 text-white/50" />
            )}
          </div>
        </div>

        {/* PERFURAÇÃO — Linha Pontilhada Vertical */}
        <div className="w-0 shrink-0 border-l border-dashed border-white/30 my-3 z-10" />

        {/* SEÇÃO DA DIREITA: Informações, Código e Ações */}
        <div className="flex flex-col justify-between flex-1 min-w-0 p-4 pl-4 pr-7 relative">
          {/* Top: Header, Nome e Vendedor */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center justify-between gap-2">
              {seller?.name ? (
                <Link
                  href={seller.id ? `/stores/${seller.id}` : "#"}
                  className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white font-medium truncate transition-all duration-300"
                >
                  <Store className="w-3 h-3 shrink-0 opacity-80" />
                  <span className="truncate">{seller.name}</span>
                </Link>
              ) : (
                <span className="text-[11px] text-white/70 font-medium tracking-wide">
                  Cupom Promocional
                </span>
              )}

              {renderStatusBadge()}
            </div>

            <h2
              className="text-base sm:text-lg font-bold text-white leading-tight truncate mt-0.5"
              title={productName}
            >
              {productName}
            </h2>
          </div>

          {/* Bottom: Código e Botão Pill Branco */}
          <div className="flex items-end justify-between gap-3 mt-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider font-bold text-white/75">
                {quantity} {quantity === 1 ? "unidade" : "unidades"}
              </span>
              <span className="text-lg sm:text-xl font-mono font-black tracking-wider text-white">
                {isCodeVisible ? code : "••••••••"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsCodeVisible(!isCodeVisible)}
              className={cn(
                "flex items-center justify-center gap-1.5 px-3.5 py-1.5",
                "bg-white text-slate-950 shadow-xs",
                "rounded-full hover:bg-white/95 hover:scale-105 active:scale-95 transition-all group cursor-pointer shrink-0 font-bold text-xs"
              )}
            >
              {isCodeVisible ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-700 group-hover:text-[#88E713] transition-all duration-300" />
                  <span>Ocultar</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-700 group-hover:text-[#88E713] transition-all duration-300" />
                  <span>Ver Código</span>
                </>
              )}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}