"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { redeemPromotionAction } from "@/app/actions/redeem-promotion";

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
import { formatBusinessHours } from "@/utils/formatHours";

interface PromotionDetailCardProps {
  id: string;
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
  userRedeemedCount?: number;
  onRedeem?: (
    quantity: number,
  ) => Promise<{ success: boolean; error?: string } | void> | void;
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
  userRedeemedCount = 0,
}: PromotionDetailCardProps) {
  const router = useRouter();

  // Normaliza entrada de imagens
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

  // Unidades restantes permitidas para o limite do usuário
  const remainingUserLimit =
    userLimit > 0 ? Math.max(0, userLimit - userRedeemedCount) : stock;

  // O máximo selecionável no botão "+" é o menor valor entre estoque geral e saldo do usuário
  const maxAvailable =
    userLimit > 0 ? Math.min(stock, remainingUserLimit) : stock;

  // Inicializa a quantidade com 1 caso haja estoque/limite disponível, caso contrário 0
  const [quantity, setQuantity] = useState(() => (maxAvailable > 0 ? 1 : 0));

  // Sincroniza a quantidade se maxAvailable mudar dinamicamente
  useEffect(() => {
    if (maxAvailable <= 0) {
      setQuantity(0);
    } else if (quantity === 0 || quantity > maxAvailable) {
      setQuantity(1);
    }
  }, [maxAvailable]);

  const increment = () => {
    if (maxAvailable > 0 && quantity < maxAvailable) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleRedeemClick = async () => {
    if (stock === 0 || maxAvailable === 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const result = await redeemPromotionAction({
        promotionId: id,
        quantity,
      });

      if (!result.success) {
        toast.error(result.error || "Não foi possível resgatar a promoção.");
        return;
      }

      toast.success("Cupom resgatado com sucesso!");
      router.push("/redeems");
    } catch (error) {
      console.error("Erro ao resgatar promoção:", error);
      toast.error("Ocorreu um erro inesperado. Tente novamente.");
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

  // Extrai o número do desconto
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

  return (
    <Card className="w-full min-h-screen border-none rounded-none shadow-none flex flex-col justify-center py-6 sm:py-10 sm:px-6 md:px-12 overflow-x-hidden">
      {/* Container Principal */}
      <CardContent className="p-0 flex flex-col lg:flex-row items-center lg:items-stretch justify-between w-full mx-auto gap-6 sm:gap-8 lg:gap-16 my-auto">

        {/* COLUNA ESQUERDA: Imagens e Loja */}
        <div className="flex flex-col w-full lg:w-[45%] gap-4 sm:gap-6 lg:gap-8">
          <div className="relative w-full aspect-[4/3] bg-muted rounded-[24px] sm:rounded-[32px] overflow-hidden">
            {imageList.length > 0 ? (
              <img
                src={imageList[currentImageIndex]}
                alt={`${title} - imagem ${currentImageIndex + 1}`}
                className="w-full h-full object-cover select-none"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
                Sem imagem
              </div>
            )}

            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all active:scale-95 backdrop-blur-md cursor-pointer"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all active:scale-95 backdrop-blur-md cursor-pointer"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-md rounded-full">
                  {imageList.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${index === currentImageIndex
                        ? "w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        : "w-2 bg-white/50 hover:bg-white/90"
                        }`}
                      aria-label={`Ir para imagem ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Selo de desconto */}
            <div
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-16 h-16 sm:w-20 sm:h-20 bg-primary text-primary-foreground flex flex-col items-center justify-center leading-none shadow-xl drop-shadow-md"
              style={{
                clipPath:
                  "polygon(100% 50%, 93.3% 62.94%, 97.55% 76.6%, 84.55% 82.14%, 82.14% 94.55%, 68.6% 92.45%, 59.48% 100%, 46.22% 94.55%, 33.68% 97.55%, 25% 86.6%, 12.5% 82.14%, 10.45% 68.6%, 0% 59.48%, 5.45% 46.22%, 2.45% 33.68%, 13.4% 25%, 17.86% 12.5%, 31.4% 10.45%, 40.52% 0%, 53.78% 5.45%, 66.32% 2.45%, 75% 13.4%, 87.5% 17.86%, 89.55% 31.4%)",
              }}
            >
              {resolvedDiscount !== null ? (
                <>
                  <span className="text-base sm:text-xl font-black text-[#111827]">
                    {resolvedDiscount}%
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase mt-0.5 text-[#111827]">
                    off
                  </span>
                </>
              ) : (
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-center px-1 text-[#111827]">
                  {badgeDiscount}
                </span>
              )}
            </div>
          </div>

          {/* Dados da Loja */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0 overflow-hidden shadow-sm">
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
              <span className="font-bold text-base sm:text-lg text-foreground">
                {storeName}
              </span>
            </div>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground pl-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{formatBusinessHours(storeHours)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{storeLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Informações e Ações (título, stats e barra de ação todos aqui dentro) */}
        <div className="flex flex-col w-full lg:w-[50%] flex-1 gap-6 sm:gap-8 lg:gap-12 lg:py-6 pb-40 lg:pb-6 lg:justify-between">

          {/* Bloco Superior: Título, Descrição e Requisitos */}
          <div className="flex flex-col gap-5 lg:gap-8">
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
                {title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            <div className="space-y-2 pt-4 lg:pt-6 border-t border-border/50">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Requisitos da Oferta
              </p>
              <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">
                {requirements}
              </p>
            </div>
          </div>

          {/* Bloco Central: Cards de Estatística — 3 colunas em qualquer breakpoint */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="flex flex-col gap-1.5 sm:gap-2 bg-muted/40 border border-border/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 transition-colors hover:bg-muted/60">
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                <PackageCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wide sm:tracking-wider leading-tight">
                  Disponível
                </span>
              </div>
              <span className="text-sm sm:text-xl font-black text-foreground leading-none">
                {stock} und
              </span>
            </div>

            <div
              className={`flex flex-col gap-1.5 sm:gap-2 border rounded-xl sm:rounded-2xl p-3 sm:p-5 transition-all duration-300 ${userLimit > 0 && remainingUserLimit === 0
                ? "bg-destructive/10 border-destructive/30"
                : "bg-muted/40 border-border/50 hover:bg-muted/60"
                }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                <UserCheck
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${userLimit > 0 && remainingUserLimit === 0 ? "text-destructive" : ""
                    }`}
                />
                <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wide sm:tracking-wider leading-tight">
                  Seu Limite
                </span>
              </div>
              <span
                className={`text-sm sm:text-xl font-black leading-none ${userLimit > 0 && remainingUserLimit === 0
                  ? "text-destructive"
                  : "text-foreground"
                  }`}
              >
                {userLimit > 0 ? `${userRedeemedCount}/${userLimit} un.` : "Sem limite"}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 sm:gap-2 bg-muted/40 border border-border/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 transition-colors hover:bg-muted/60">
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wide sm:tracking-wider leading-tight">
                  Duração
                </span>
              </div>
              <span className="text-sm sm:text-xl font-black text-foreground leading-none">
                {duration}
              </span>
            </div>
          </div>

          {/* BARRA DE AÇÃO — fixa no rodapé no mobile/tablet, em fluxo normal no desktop */}
          {/* Ajuste "bottom-16" para a altura real da tab bar do seu app */}
          <div className="fixed lg:static bottom-16 left-0 right-0 z-30 lg:z-auto bg-background/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border-t lg:border-t-0 border-border/60 px-4 sm:px-6 py-3 sm:py-4 lg:p-0 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] lg:shadow-none">
            <div className="flex flex-col gap-3 lg:gap-8 max-w-3xl mx-auto lg:mx-0 lg:max-w-none">

              {/* Cronômetro e Preço */}
              <div className="flex flex-col gap-2 sm:gap-4">
                {timeLeft && (
                  <div className="hidden sm:flex items-center gap-2 text-sm text-foreground bg-primary/10 w-fit px-4 py-2.5 rounded-lg border border-primary/20">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>
                      A oferta expira em{" "}
                      <strong className="font-black text-primary">
                        {timeRemaining.hours}h {timeRemaining.minutes}m
                      </strong>
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between sm:block sm:space-y-1">
                  <div>
                    <span className="hidden sm:block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Valor Exclusivo
                    </span>
                    <div className="flex items-baseline gap-2 sm:gap-4 flex-wrap">
                      <span className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-foreground drop-shadow-sm">
                        {discountPrice}
                      </span>
                      <span className="text-base sm:text-xl lg:text-2xl font-semibold text-muted-foreground line-through decoration-muted-foreground/40">
                        {originalPrice}
                      </span>
                    </div>
                  </div>

                  {/* No mobile, cronômetro compacto ao lado do preço */}
                  {timeLeft && (
                    <div className="flex sm:hidden items-center gap-1.5 text-xs text-primary bg-primary/10 px-2.5 py-1.5 rounded-lg border border-primary/20 flex-shrink-0">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <strong className="font-black whitespace-nowrap">
                        {timeRemaining.hours}h {timeRemaining.minutes}m
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Controles e Botão — sempre lado a lado */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {/* Stepper de Quantidade */}
                  <div className="flex items-center h-14 sm:h-16 bg-muted/50 border border-border/60 rounded-xl sm:rounded-2xl overflow-hidden shrink-0">
                    <button
                      type="button"
                      onClick={decrement}
                      disabled={quantity <= 1 || isSubmitting || maxAvailable === 0}
                      className="w-11 sm:w-16 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <span className="w-8 sm:w-12 text-center font-black text-base sm:text-xl text-foreground select-none">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increment}
                      disabled={quantity >= maxAvailable || maxAvailable === 0 || isSubmitting}
                      className="w-11 sm:w-16 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {/* BOTÃO ESTILO CUPOM TICKET */}
                  <Button
                    type="button"
                    disabled={stock === 0 || maxAvailable === 0 || isSubmitting}
                    onClick={handleRedeemClick}
                    className="flex-1 relative h-14 sm:h-16 bg-primary hover:bg-primary text-primary-foreground rounded-xl sm:rounded-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer overflow-hidden group"
                  >
                    <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full border-r border-primary/20 shadow-inner z-20" />
                    <span className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full border-l border-primary/20 shadow-inner z-20" />

                    <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 bg-primary font-black text-base sm:text-lg uppercase tracking-widest group-hover:bg-primary transition-colors text-[#111827]">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processando...</span>
                        </>
                      ) : stock === 0 ? (
                        "Estoque Esgotado"
                      ) : maxAvailable === 0 ? (
                        "Limite Atingido"
                      ) : (
                        "Resgatar"
                      )}
                    </span>
                  </Button>
                </div>

                {userLimit > 0 && remainingUserLimit === 0 && stock > 0 && (
                  <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-bold text-center sm:text-left">
                    Você já atingiu o limite máximo de {userLimit} {userLimit === 1 ? "resgate" : "resgates"} para esta oferta.
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
