import React from "react";

// Interface simples para receber os dados do seu backend futuramente
interface StoreDetailsCardProps {
  name: string;
  imageUrl?: string;
  businessHours: string; // Ex: "08:00 às 22:00" ou "Aberto agora"
  location: string; // Ex: "Centro, Balneário Camboriú" ou "A 1.2 km"
  category: string; // Ex: "Supermercado" ou "Alimentos"
}

export function StoreDetailsCard({
  name,
  imageUrl,
  businessHours,
  location,
  category,
}: StoreDetailsCardProps) {
  return (
    <div className="w-3/5 h-auto p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center gap-5">
      {/* Imagem de Perfil da Loja (Círculo) */}
      <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-zinc-400 font-semibold text-lg">
            {name.charAt(0)}
          </span>
        )}
      </div>

      {/* Bloco de Textos e Informações */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {/* Nome da Loja */}
        <h2 className="text-base font-bold text-zinc-100 tracking-tight truncate">
          {name}
        </h2>

        {/* Linha das Informações da Loja */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 font-medium">
          {/* Horário de Funcionamento */}
          <span className="truncate">{businessHours}</span>

          {/* Divisor Visual Sutil entre os elementos */}
          <span
            className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:inline"
            aria-hidden="true"
          />

          {/* Localização */}
          <span className="truncate">{location}</span>

          {/* Divisor Visual Sutil */}
          <span
            className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:inline"
            aria-hidden="true"
          />

          {/* Categoria */}
          <span className="text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800 tracking-wide">
            {category}
          </span>
        </div>
      </div>
    </div>
  );
}
