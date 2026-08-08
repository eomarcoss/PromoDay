"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Eye } from "lucide-react";

export interface PromoCardProps {
  name: string;
  storeName: string;
  originalPrice: number;
  promoPrice: number;
  discountPercentage: number;
  timeLeft: string;
  imageUrl: string;
  avatarUrl?: string;
}

export function PromoCard({ product }: { product: PromoCardProps }) {
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(product.timeLeft).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const totalMinutes = Math.floor(difference / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        setTimeRemaining({ hours, minutes });
      } else {
        setTimeRemaining({ hours: 0, minutes: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, [product.timeLeft]);

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return "R$ --";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="p-0 flex justify-center items-center font-sans h-full">
      <Card className="w-full max-w-sm bg-card text-card-foreground rounded-2xl p-4 border border-border/50 shadow-sm flex flex-col h-full gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/40">
        {/* Imagem */}
        <CardHeader className="w-full p-0 relative aspect-[4/3] bg-muted/30 rounded-xl overflow-hidden flex items-center justify-center border border-border/20">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">
              Sem imagem
            </div>
          )}

          {/* Selo de desconto */}
          <div
            className="absolute top-3 right-3 w-14 h-14 bg-primary text-primary-foreground flex flex-col items-center justify-center leading-none shadow-sm"
            style={{
              clipPath:
                "polygon(100% 50%, 93.3% 62.94%, 97.55% 76.6%, 84.55% 82.14%, 82.14% 94.55%, 68.6% 92.45%, 59.48% 100%, 46.22% 94.55%, 33.68% 97.55%, 25% 86.6%, 12.5% 82.14%, 10.45% 68.6%, 0% 59.48%, 5.45% 46.22%, 2.45% 33.68%, 13.4% 25%, 17.86% 12.5%, 31.4% 10.45%, 40.52% 0%, 53.78% 5.45%, 66.32% 2.45%, 75% 13.4%, 87.5% 17.86%, 89.55% 31.4%)",
            }}
          >
            <span className="text-sm font-black">
              {product.discountPercentage}%
            </span>
            <span className="text-[9px] font-bold uppercase mt-0.5">off</span>
          </div>
        </CardHeader>

        {/* Conteúdo */}
        <CardContent className="w-full p-0 flex-1 flex flex-col justify-between gap-4">
          {/* Título + loja */}
          <div className="space-y-2">
            <h3 className="text-foreground text-base font-semibold leading-snug tracking-tight text-left line-clamp-2">
              {product.name}
            </h3>

            <div className="flex items-center gap-2">
              {product.avatarUrl ? (
                <img
                  src={product.avatarUrl}
                  alt={product.storeName}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[9px] font-extrabold text-primary flex-shrink-0">
                  {product.storeName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-muted-foreground text-sm font-medium truncate">
                {product.storeName}
              </span>
            </div>
          </div>

          {/* Preço + cronômetro */}
          <div className="space-y-2.5">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-foreground text-2xl font-bold tracking-tight">
                {formatPrice(product.promoPrice)}
              </span>
              <span className="text-muted-foreground text-sm font-medium line-through decoration-muted-foreground/50">
                {formatPrice(product.originalPrice)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 w-fit px-2.5 py-1 rounded-md border border-border/30">
              <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>
                Expira em{" "}
                <strong className="text-foreground font-semibold">
                  {timeRemaining.hours}h {timeRemaining.minutes}m
                </strong>
              </span>
            </div>
          </div>
        </CardContent>

        {/* Ações */}
        <CardFooter className="w-full p-0 grid grid-cols-2 gap-2.5">
          <Button
            variant="outline"
            className="w-full font-medium text-sm gap-1.5 h-10 rounded-lg border-border/80 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Eye className="w-4 h-4" />
            Detalhes
          </Button>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm h-10 rounded-lg shadow-sm transition-all">
            Resgatar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
