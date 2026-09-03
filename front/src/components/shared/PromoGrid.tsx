"use client";

import { useMemo } from "react";
import Fuse from "fuse.js";
import { PromoCard } from "@/components/shared/PromoCard";
import Link from "next/link";
import { SellerPromoActions } from "@/components/shared/SellerPromoActions";

export interface PromotionFromBackend {
  id: string;
  name: string;
  description?: string;
  images: string[];
  originalPrice: number;
  promoPrice: number;
  stock?: number;
  limitPerUser?: number;
  endTime: string;
  isActive: boolean;
  seller?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

interface PromoGridProps {
  products: PromotionFromBackend[];
  role?: "CUSTOMER" | "SELLER";
  searchTerm?: string; // 👈 Novo parâmetro opcional para filtrar pelo Fuse.js
  sellerId?: string;
}

function calcDiscount(original: number, promo: number): number {
  if (!original || original <= 0) return 0;
  return Math.round(((original - promo) / original) * 100);
}

export default function PromoGrid({
  products,
  role = "CUSTOMER",
  searchTerm,
}: PromoGridProps) {
  // Lógica do Fuse.js para tolerância a erros e acentos no front-end
  const filteredProducts = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      return products;
    }

    const fuse = new Fuse(products, {
      keys: ["name", "description", "seller.name"],
      threshold: 0.4, // Tolerância a erros de digitação
      ignoreLocation: true,
    });

    return fuse.search(searchTerm).map((result) => result.item);
  }, [products, searchTerm]);

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 font-bold">
          {searchTerm
            ? `Nenhuma promoção encontrada para "${searchTerm}".`
            : "Nenhuma promoção ativa no momento."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-9xl px-4 sm:px-6 lg:px-8 space-y-6 min-h-screen py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
        {filteredProducts.map((promo) => {
          const mainImage =
            promo.images && promo.images.length > 0
              ? promo.images[0]
              : "/placeholder.png";

          const discount = calcDiscount(
            Number(promo.originalPrice),
            Number(promo.promoPrice)
          );

          // Define as ações com base na role do usuário (igual ao seu original)
          let customActions: React.ReactNode = undefined;

          if (role === "SELLER") {
            customActions = (
              <SellerPromoActions
                productId={promo.id}
                isActive={promo.isActive}
                promotion={{
                  id: promo.id,
                  name: promo.name,
                  sellerId: promo.seller?.id || "",
                  description: promo.description,
                  stock: promo.stock || 0,
                  limitPerUser: promo.limitPerUser || 1,
                  endTime: promo.endTime,
                  images: promo.images,
                }}
              />
            );
          }

          return (
            <PromoCard
              key={promo.id}
              product={{
                id: promo.id,
                name: promo.name,
                storeName: promo.seller?.name || "Loja Parceira",
                originalPrice: Number(promo.originalPrice),
                promoPrice: Number(promo.promoPrice),
                discountPercentage: discount,
                timeLeft: promo.endTime,
                imageUrl: mainImage,
                avatarUrl: promo.seller?.avatarUrl,
              }}
              actions={customActions}
              onDetails={() => {
                window.location.href = `/promotions/${promo.id}`;
              }}
            />
          );
        })}
      </div>
    </div>
  );
}