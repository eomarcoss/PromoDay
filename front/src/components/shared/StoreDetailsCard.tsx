"use client";

import React, { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";

interface StoreDetailsCardProps {
  name: string;
  imageUrl?: string;
  businessHours: any;
  location: string;
  category: string;
}

const DIAS_ORDEM = [
  { key: "segunda", label: "Segunda-feira" },
  { key: "terca", label: "Terça-feira" },
  { key: "quarta", label: "Quarta-feira" },
  { key: "quinta", label: "Quinta-feira" },
  { key: "sexta", label: "Sexta-feira" },
  { key: "sabado", label: "Sábado" },
  { key: "domingo", label: "Domingo" },
];

export function StoreDetailsCard({
  name,
  imageUrl,
  businessHours,
  location,
  category,
}: StoreDetailsCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Faz o parse do JSON caso venha como string
  const parsedHours = React.useMemo(() => {
    if (!businessHours) return null;
    if (typeof businessHours === "string") {
      try {
        return JSON.parse(businessHours);
      } catch {
        return null;
      }
    }
    return businessHours;
  }, [businessHours]);

  // Resumo para exibir quando o menu está fechado
  const summaryText = React.useMemo(() => {
    if (!parsedHours) return "Horário não informado";

    const todayIndex = new Date().getDay(); // 0 = Domingo, 1 = Segunda...
    const dayKeys = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ];
    const todayKey = dayKeys[todayIndex];
    const todayData = parsedHours[todayKey];

    if (todayData?.aberto) {
      return `Hoje: ${todayData.inicio} às ${todayData.fim}`;
    }

    return "Ver horários da semana";
  }, [parsedHours]);

  return (
    <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">
      {/* Linha Principal do Card */}
      <div className="flex items-center gap-5">
        {/* Imagem de Perfil / Iniciais */}
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-zinc-300 font-bold text-xl uppercase">
              {name ? name.substring(0, 2) : "SL"}
            </span>
          )}
        </div>

        {/* Informações Principais */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <h2 className="text-base font-bold text-zinc-100 tracking-tight truncate">
            {name}
          </h2>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400 font-medium">
            {/* Botão Interativo de Horários */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-800/50"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{summaryText}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <span
              className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:inline"
              aria-hidden="true"
            />

            {/* Localização */}
            <span className="truncate">{location}</span>

            <span
              className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:inline"
              aria-hidden="true"
            />

            {/* Categoria */}
            <span className="text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800 tracking-wide capitalize">
              {category}
            </span>
          </div>
        </div>
      </div>

      {/* Lista Sanfona (Dropdown) da Semana Toda */}
      {isOpen && parsedHours && (
        <div className="mt-2 pt-3 border-t border-zinc-800/80 flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="text-xs font-semibold text-zinc-400 mb-1">
            Horário de Funcionamento
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
            {DIAS_ORDEM.map(({ key, label }) => {
              const dayData = parsedHours[key];
              const isAberto = dayData?.aberto;

              return (
                <div
                  key={key}
                  className="flex items-center justify-between py-1 border-b border-zinc-900/60 last:border-none"
                >
                  <span className="text-zinc-400 font-medium">{label}</span>
                  {isAberto ? (
                    <span className="text-zinc-200 font-semibold">
                      {dayData.inicio} às {dayData.fim}
                    </span>
                  ) : (
                    <span className="text-zinc-500 italic">Fechado</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}