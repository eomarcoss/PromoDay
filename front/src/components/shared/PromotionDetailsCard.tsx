"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, MapPin, Clock } from "lucide-react";

interface PromotionDetailCardProps {
  imageUrl?: string;
  badgeDiscount?: string;
  title: string;
  description: string;
  requirements: string;
  stock: number;
  userLimit: number; // Se for 0, significa "Sem limite"
  duration: string;
  storeName: string;
  storeHours?: string;
  storeLocation?: string;
  originalPrice: string;
  discountPrice: string;
  onRedeem?: (quantity: number) => void;
}

export function PromotionDetailCard({
  imageUrl,
  badgeDiscount = "20% off",
  title,
  description,
  requirements,
  stock,
  userLimit,
  duration,
  storeName,
  storeHours = "Horário funcionamento",
  storeLocation = "Localização",
  originalPrice,
  discountPrice,
  onRedeem,
}: PromotionDetailCardProps) {
  // Lógica Matemática: Define o teto máximo que o usuário pode escolher
  // Se userLimit for 0 (Sem Limite), o teto é o próprio estoque total.
  const maxAvailable = userLimit > 0 ? Math.min(stock, userLimit) : stock;

  // Estado da quantidade selecionada (começa em 1)
  const [quantity, setQuantity] = useState(1);

  // Funções de incremento e decremento
  const increment = () => {
    if (quantity < maxAvailable) setQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <Card className="w-full max-w-4xl bg-neutral-100 border border-neutral-200 rounded-[32px] p-6 shadow-sm text-black">
      <CardContent className="p-0 flex flex-col md:flex-row gap-6">
        {/* COLUNA DA ESQUERDA: Imagem, Loja e Infos de Rodapé */}
        <div className="flex flex-col flex-1 space-y-4">
          {/* Box da Imagem Principal */}
          <div className="relative aspect-[4/3] w-full bg-neutral-900 rounded-[24px] overflow-hidden border border-neutral-800">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-neutral-900" />
            )}

            {/* Badge Flutuante de Desconto */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-black text-xs font-bold w-12 h-12 rounded-full flex items-center justify-center border border-neutral-200 shadow-sm text-center p-1 leading-tight uppercase">
              {badgeDiscount}
            </div>
          </div>

          {/* Dados do Vendedor / Loja */}
          <div className="flex flex-col space-y-2 pl-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neutral-900 rounded-full shrink-0 border border-neutral-800" />
              <span className="font-bold text-base">{storeName}</span>
            </div>

            <div className="flex flex-col space-y-1 text-xs font-medium text-neutral-500 pl-1">
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>{storeHours}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{storeLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA: Informações e Ações de Resgate */}
        <div className="flex flex-col flex-1 justify-between space-y-6 pt-1">
          {/* Bloco de Texto Principal */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight">{title}</h1>
              <p className="text-sm font-medium text-neutral-600 mt-1 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Regras e Metadados do Produto */}
            <div className="space-y-1.5 pt-1 border-t border-neutral-200/60">
              <p className="text-sm">
                <span className="font-bold">Requisitos:</span>{" "}
                <span className="text-neutral-600 font-medium">
                  {requirements}
                </span>
              </p>

              <div className="flex items-center space-x-6 text-sm">
                <p>
                  <span className="font-bold">Disponível:</span>{" "}
                  <span className="text-neutral-600 font-medium">
                    {stock} und
                  </span>
                </p>
                <p>
                  <span className="font-bold">Limite por usuário:</span>{" "}
                  <span className="text-neutral-600 font-medium">
                    {userLimit > 0 ? `${userLimit} unidades` : "Sem limite"}
                  </span>
                </p>
              </div>

              <p className="text-sm">
                <span className="font-bold">Duração:</span>{" "}
                <span className="text-neutral-600 font-medium">{duration}</span>
              </p>
            </div>
          </div>

          {/* Bloco de Preço */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Promoção
            </span>
            <div className="flex items-baseline space-x-4">
              <span className="text-sm font-bold text-neutral-400 line-through">
                De: {originalPrice}
              </span>
              <span className="text-2xl font-black text-black">
                Por: {discountPrice}
              </span>
            </div>
          </div>

          {/* BOTTOM CONTROLS: Quantidade e Botão Resgatar */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-neutral-200/60">
            {/* Novo Stepper de Quantidade Customizado (Formato Pílula) */}
            <div className="flex items-center h-12 bg-neutral-900 text-white rounded-full overflow-hidden shrink-0 shadow-sm border border-neutral-800">
              <span className="text-xs font-bold uppercase tracking-wider px-4 text-neutral-400 select-none border-r border-neutral-800">
                Qtd
              </span>

              {/* Botão Menos */}
              <button
                type="button"
                onClick={decrement}
                disabled={quantity <= 1}
                className="w-10 h-full flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              {/* Número centralizado */}
              <span className="w-8 text-center font-mono font-bold text-sm select-none">
                {quantity}
              </span>

              {/* Botão Mais */}
              <button
                type="button"
                onClick={increment}
                disabled={quantity >= maxAvailable || maxAvailable === 0}
                className="w-10 h-full flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Botão de Resgate Principal */}
            <button
              type="button"
              disabled={stock === 0}
              onClick={() => onRedeem?.(quantity)}
              className="flex-1 h-12 bg-neutral-800 hover:bg-black text-white font-bold text-base rounded-full transition-colors shadow-sm disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed"
            >
              {stock === 0 ? "Esgotado" : "Resgatar"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
