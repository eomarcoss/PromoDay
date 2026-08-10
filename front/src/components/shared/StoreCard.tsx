import Link from "next/link";
import React from "react";

interface StoreCardProps {
  id: string;
  name: string;
  category?: string;
  avatarUrl?: string;
  offersCount: number;
  isOpen: boolean;
}

export function StoreCard({
  id,
  name,
  category,
  avatarUrl,
  offersCount,
  isOpen,
}: StoreCardProps) {
  return (
    <Link href={`/stores/${id}`} className="w-full max-w-xl block">
      <div className="flex items-center justify-between gap-4 p-4 bg-card border border-border/50 rounded-2xl hover:border-border hover:shadow-sm transition-all group cursor-pointer w-full">
        {/* Lado esquerdo: imagem + nome */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-muted border border-border/50 flex-shrink-0 overflow-hidden flex items-center justify-center group-hover:border-border transition-colors">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground font-semibold text-sm uppercase">
                {name.charAt(0)}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground tracking-tight truncate">
              {name}
            </h3>
            {category && (
              <p className="text-xs text-muted-foreground truncate mt-0.5 capitalize">
                {category}
              </p>
            )}
          </div>
        </div>

        {/* Lado direito: ofertas + status */}
        <div className="flex items-center gap-5 text-sm flex-shrink-0">
          <span className="text-muted-foreground font-medium hidden sm:inline">
            {offersCount} {offersCount === 1 ? "oferta" : "ofertas"}
          </span>

          <span className="inline-flex items-center gap-1.5 font-medium text-xs text-muted-foreground">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOpen ? "bg-emerald-500" : "bg-muted-foreground/40"
              }`}
            />
            {isOpen ? "Aberto" : "Fechado"}
          </span>
        </div>
      </div>
    </Link>
  );
}
