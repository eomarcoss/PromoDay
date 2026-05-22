"use-client";
import React from "react";

// Interface simples para os dados da loja
interface StoreCardProps {
  name: string;
  imageUrl?: string; // Opcional caso queira usar uma string de URL depois
  offersCount: number;
  isOpen: boolean;
}

export function StoreCard({
  name,
  imageUrl,
  offersCount,
  isOpen,
}: StoreCardProps) {
  return (
    <div className="flex items-center justify-between lg:w-xl p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all group cursor-pointer">
      {/* Lado Esquerdo: Imagem + Nome */}
      <div className="flex items-center gap-4">
        {/* Placeholder para a Imagem da Loja */}
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden flex items-center justify-center group-hover:border-zinc-700 transition-colors">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            // Ícone/Letra padrão caso não tenha imagem cadastrada ainda
            <span className="text-zinc-500 font-medium text-sm">
              {name.charAt(0)}
            </span>
          )}
        </div>

        {/* Nome da Loja */}
        <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
          {name}
        </h3>
      </div>

      {/* Lado Direito: Ofertas + Status */}
      <div className="flex items-center gap-6 text-sm">
        {/* Número de Ofertas */}
        <span className="text-zinc-400 font-medium">
          {offersCount} {offersCount === 1 ? "oferta" : "ofertas"}
        </span>

        {/* Status Aberto/Fechado */}
        <span
          className={`font-semibold ${isOpen ? "text-white" : "text-zinc-500"}`}
        >
          {isOpen ? "Aberto" : "Fechado"}
        </span>
      </div>
    </div>
  );
}
