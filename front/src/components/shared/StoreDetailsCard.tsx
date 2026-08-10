"use client";

import React, { useState } from "react";
import { ChevronDown, Clock, MapPin } from "lucide-react";

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

const DAY_KEYS = [
  "domingo",
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
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

  const todayKey = DAY_KEYS[new Date().getDay()];

  // Resumo para exibir quando o menu está fechado
  const summaryText = React.useMemo(() => {
    if (!parsedHours) return "Horário não informado";

    const todayData = parsedHours[todayKey];

    if (todayData?.aberto) {
      return `Hoje: ${todayData.inicio} às ${todayData.fim}`;
    }

    return "Ver horários da semana";
  }, [parsedHours, todayKey]);

  return (
    <div className="w-full max-w-2xl bg-card border border-border/50 rounded-2xl p-5 flex flex-col gap-4">
      {/* Linha principal do card */}
      <div className="flex items-center gap-4">
        {/* Imagem de perfil / iniciais */}
        <div className="w-16 h-16 rounded-full bg-muted border border-border/50 flex-shrink-0 overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground font-bold text-lg uppercase">
              {name ? name.substring(0, 2) : "SL"}
            </span>
          )}
        </div>

        {/* Informações principais */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <h2 className="text-lg font-bold text-foreground tracking-tight truncate">
            {name}
          </h2>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
            {/* Botão interativo de horários — único toque de azul, bem suave */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 text-primary font-semibold bg-primary/10 hover:bg-primary/15 px-2.5 py-1 rounded-md border border-primary/20 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{summaryText}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Localização */}
            <span className="flex items-center gap-1 text-muted-foreground font-medium min-w-0">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </span>

            {/* Categoria */}
            <span className="text-foreground/80 bg-muted px-2 py-0.5 rounded-md border border-border/60 font-medium tracking-wide capitalize">
              {category}
            </span>
          </div>
        </div>
      </div>

      {/* Lista sanfona (dropdown) da semana toda */}
      {isOpen && parsedHours && (
        <div className="pt-3 border-t border-border/60 flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Horário de funcionamento
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5 text-xs">
            {DIAS_ORDEM.map(({ key, label }) => {
              const dayData = parsedHours[key];
              const isAberto = dayData?.aberto;
              const isToday = key === todayKey;

              return (
                <div
                  key={key}
                  className={`flex items-center justify-between px-2 -mx-2 py-1.5 rounded-md border-b border-border/40 last:border-none ${
                    isToday ? "bg-primary/5" : ""
                  }`}
                >
                  <span
                    className={`font-medium ${
                      isToday ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                  {isAberto ? (
                    <span className="text-foreground font-semibold">
                      {dayData.inicio} às {dayData.fim}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/70 italic">
                      Fechado
                    </span>
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
