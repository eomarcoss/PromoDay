import { PromoCard } from "@/components/shared/PromoCard";
import Link from "next/link";
import { SellerPromoActions } from "@/components/shared/SellerPromoActions";

export interface PromotionFromBackend {
  id: string;
  name: string;
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
}

function calcDiscount(original: number, promo: number): number {
  if (!original || original <= 0) return 0;
  return Math.round(((original - promo) / original) * 100);
}

export default function PromoGrid({
  products,
  role = "CUSTOMER",
}: PromoGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 font-bold">
          Nenhuma promoção ativa no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-9xl px-4 sm:px-6 lg:px-8 space-y-6 min-h-screen py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
        {products.map((promo) => (
          <Link
            key={promo.id}
            href={`/promotions/${promo.id}`}
            className="h-full"
          >
            <div key={promo.id} className="h-full">
              <PromoCard
                product={{
                  id: promo.id,
                  name: promo.name,
                  storeName: promo.seller?.name || "Loja Parceira",
                  avatarUrl: promo.seller?.avatarUrl || "",
                  originalPrice: promo.originalPrice,
                  promoPrice: promo.promoPrice,
                  discountPercentage: calcDiscount(
                    promo.originalPrice,
                    promo.promoPrice,
                  ),
                  timeLeft: promo.endTime,
                  imageUrl: promo.images?.[0] || "",
                }}
                actions={
                  role === "SELLER" ? (
                    <SellerPromoActions
                      productId={promo.id}
                      isActive={promo.isActive}
                    />
                  ) : undefined
                }
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
