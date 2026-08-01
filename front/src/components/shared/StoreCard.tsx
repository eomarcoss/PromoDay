import Link from "next/link";
import React from "react";

// 1. Adicionamos o 'id' para construir a URL dinâmica
interface StoreCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  offersCount: number;
  isOpen: boolean;
}

export function StoreCard({
  id,
  name,
  imageUrl,
  offersCount,
  isOpen,
}: StoreCardProps) {
  return (
    // 🚀 Ajustado: Rota dinâmica baseada no ID da loja
    <Link href={`/stores/${id}`} className="w-full max-w-xl">
      <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all group cursor-pointer w-full">
        {/* Lado Esquerdo: Imagem + Nome */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden flex items-center justify-center group-hover:border-zinc-700 transition-colors">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-zinc-500 font-medium text-sm uppercase">
                {name.charAt(0)}
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
            {name}
          </h3>
        </div>

        {/* Lado Direito: Ofertas + Status */}
        <div className="flex items-center gap-6 text-sm">
          <span className="text-zinc-400 font-medium">
            {offersCount} {offersCount === 1 ? "oferta" : "ofertas"}
          </span>

          <span
            className={`font-semibold ${
              isOpen ? "text-emerald-400" : "text-zinc-500"
            }`}
          >
            {isOpen ? "Aberto" : "Fechado"}
          </span>
        </div>
      </div>
    </Link>
  );
}
