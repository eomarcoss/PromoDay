"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
// import { toast } from "sonner";
import { api } from "@/services/api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Minus,
  Plus,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  UserCheck,
  Timer,
  Loader2,
} from "lucide-react";

interface PromotionDetailCardProps {
  id: string; // ID para realizar o POST direto na API
  images?: string[] | string;
  imageUrl?: string;
  badgeDiscount?: string;
  discountPercentage?: number;
  title: string;
  description: string;
  requirements: string;
  stock: number;
  userLimit: number;
  duration: string;
  timeLeft?: string;
  storeName: string;
  avatarUrl?: string;
  storeHours?: string;
  storeLocation?: string;
  originalPrice: string;
  discountPrice: string;
  onRedeem?: (quantity: number) => void;
}

export function PromotionDetailCard({
  id,
  images,
  imageUrl,
  badgeDiscount = "20% off",
  discountPercentage,
  title,
  description,
  requirements,
  stock,
  userLimit,
  duration,
  timeLeft,
  storeName,
  avatarUrl,
  storeHours = "Horário de funcionamento",
  storeLocation = "Localização",
  originalPrice,
  discountPrice,
  onRedeem,
}: PromotionDetailCardProps) {
  const router = useRouter();

  // Normaliza qualquer tipo de entrada de imagem para um array de strings limpo
  const imageList = useMemo(() => {
    let list: string[] = [];

    if (Array.isArray(images)) {
      list = images;
    } else if (typeof images === "string" && images.trim().length > 0) {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) list = parsed;
        else list = [images];
      } catch {
        list = images.includes(",")
          ? images.split(",").map((s) => s.trim())
          : [images];
      }
    } else if (imageUrl) {
      list = [imageUrl];
    }

    return list.filter((url) => typeof url === "string" && url.trim() !== "");
  }, [images, imageUrl]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lógica de resgate direta com suporte a fallback de callback (onRedeem)
  const handleRedeemClick = async () => {
    if (stock === 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (onRedeem) {
        await onRedeem(quantity);
      } else {
        await api.post(`/promotions/${id}/redeem`, { quantity });
        toast.success("Cupom resgatado com sucesso!");
        router.push("/redeems");
      }
    } catch (error: any) {
      console.error("Erro ao resgatar promoção:", error);
      const message =
        error?.response?.data?.message ||
        "Não foi possível resgatar a promoção.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1,
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === imageList.length - 1 ? 0 : prev + 1,
    );
  };

  // Extrai o número do desconto de badgeDiscount caso discountPercentage não seja informado
  const resolvedDiscount = useMemo(() => {
    if (discountPercentage !== undefined) return discountPercentage;
    const match = badgeDiscount.match(/\d+/);
    return match ? Number(match[0]) : null;
  }, [discountPercentage, badgeDiscount]);

  // Cronômetro de tempo restante
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    if (!timeLeft) return;

    const calculateTimeLeft = () => {
      const targetDate = new Date(timeLeft).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const totalMinutes = Math.floor(difference / (1000 * 60));
        setTimeRemaining({
          hours: Math.floor(totalMinutes / 60),
          minutes: totalMinutes % 60,
        });
      } else {
        setTimeRemaining({ hours: 0, minutes: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Lógica de estoque / limite
  const maxAvailable = userLimit > 0 ? Math.min(stock, userLimit) : stock;
  const [quantity, setQuantity] = useState(1);

  const increment = () => {
    if (quantity < maxAvailable) setQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <Card className="w-full max-w-4xl bg-card text-card-foreground border border-border/50 rounded-[28px] p-6 shadow-sm">
      <CardContent className="p-0 flex flex-col md:flex-row gap-6">
        {/* COLUNA ESQUERDA: imagens e loja */}
        <div className="flex flex-col flex-1 gap-4">
          <div className="relative aspect-[4/3] w-full bg-muted rounded-2xl overflow-hidden border border-border/20">
            {imageList.length > 0 ? (
              <img
                src={imageList[currentImageIndex]}
                alt={`${title} - imagem ${currentImageIndex + 1}`}
                className="w-full h-full object-cover select-none"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium">
                Sem imagem
              </div>
            )}

            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all active:scale-95 backdrop-blur-sm cursor-pointer"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all active:scale-95 backdrop-blur-sm cursor-pointer"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
                  {imageList.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        index === currentImageIndex
                          ? "w-5 bg-white"
                          : "w-1.5 bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Ir para imagem ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Selo de desconto */}
            <div
              className="absolute top-3 right-3 z-10 w-16 h-16 bg-primary text-primary-foreground flex flex-col items-center justify-center leading-none shadow-sm"
              style={{
                clipPath:
                  "polygon(100% 50%, 93.3% 62.94%, 97.55% 76.6%, 84.55% 82.14%, 82.14% 94.55%, 68.6% 92.45%, 59.48% 100%, 46.22% 94.55%, 33.68% 97.55%, 25% 86.6%, 12.5% 82.14%, 10.45% 68.6%, 0% 59.48%, 5.45% 46.22%, 2.45% 33.68%, 13.4% 25%, 17.86% 12.5%, 31.4% 10.45%, 40.52% 0%, 53.78% 5.45%, 66.32% 2.45%, 75% 13.4%, 87.5% 17.86%, 89.55% 31.4%)",
              }}
            >
              {resolvedDiscount !== null ? (
                <>
                  <span className="text-sm font-black">
                    {resolvedDiscount}%
                  </span>
                  <span className="text-[9px] font-bold uppercase mt-0.5">
                    off
                  </span>
                </>
              ) : (
                <span className="text-[9px] font-black uppercase text-center px-1">
                  {badgeDiscount}
                </span>
              )}
            </div>
          </div>

          {/* Dados da loja com fallback de avatar e alt fixado */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 overflow-hidden">
                {avatarUrl && avatarUrl.trim() !== "" ? (
                  <img
                    src={avatarUrl}
                    alt={storeName || "Loja"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  storeName?.charAt(0).toUpperCase()
                )}
              </div>
              <span className="font-semibold text-base text-foreground">
                {storeName}
              </span>
            </div>

            <div className="flex flex-col gap-1 text-xs text-muted-foreground pl-0.5">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{storeHours}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{storeLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: informações e ações */}
        <div className="flex flex-col flex-1 justify-between gap-6">
          <div className="space-y-5">
            <div className="space-y-1.5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-snug">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Requisitos */}
            <div className="space-y-1 pt-4 border-t border-border/60">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Requisitos
              </p>
              <p className="text-sm text-foreground font-medium leading-relaxed">
                {requirements}
              </p>
            </div>

            {/* Cards de estatística */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1 bg-muted/40 border border-border/40 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                    Disponível
                  </span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {stock} und
                </span>
              </div>

              <div className="flex flex-col gap-1 bg-muted/40 border border-border/40 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                    Limite
                  </span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {userLimit > 0 ? `${userLimit} un.` : "Sem limite"}
                </span>
              </div>

              <div className="flex flex-col gap-1 bg-muted/40 border border-border/40 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Timer className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                    Duração
                  </span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {duration}
                </span>
              </div>
            </div>

            {/* Cronômetro de expiração */}
            {timeLeft && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 w-fit px-2.5 py-1 rounded-md border border-border/30">
                <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>
                  Expira em{" "}
                  <strong className="text-foreground font-semibold">
                    {timeRemaining.hours}h {timeRemaining.minutes}m
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* Bloco de preço */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Promoção
            </span>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {discountPrice}
              </span>
              <span className="text-sm font-medium text-muted-foreground line-through decoration-muted-foreground/50">
                {originalPrice}
              </span>
            </div>
          </div>

          {/* Quantidade e ação de resgate */}
          <div className="flex items-center gap-3 pt-4 border-t border-border/60">
            <div className="flex items-center h-11 bg-muted/60 border border-border/60 rounded-xl overflow-hidden shrink-0">
              <button
                type="button"
                onClick={decrement}
                disabled={quantity <= 1 || isSubmitting}
                className="w-9 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Diminuir quantidade"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="w-8 text-center font-semibold text-sm text-foreground select-none">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increment}
                disabled={
                  quantity >= maxAvailable || maxAvailable === 0 || isSubmitting
                }
                className="w-9 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <Button
              type="button"
              disabled={stock === 0 || isSubmitting}
              onClick={handleRedeemClick}
              className="flex-1 relative h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-md transition-all border border-dashed border-primary-foreground/40 group overflow-hidden disabled:opacity-40 cursor-pointer"
            >
              <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-background rounded-full border-r border-dashed border-primary-foreground/40" />

              <span className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Resgatando...</span>
                  </>
                ) : stock === 0 ? (
                  "Esgotado"
                ) : (
                  "Resgatar"
                )}
              </span>

              <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-background rounded-full border-l border-dashed border-primary-foreground/40" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
