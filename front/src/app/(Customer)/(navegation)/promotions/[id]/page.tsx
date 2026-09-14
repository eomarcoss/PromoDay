export const dynamic = "force-dynamic";

import { getUserRedeemedCount } from "../../../../actions/get-user-redeemed-count";
import { PromotionDetailCard } from "@/components/shared/PromotionDetailsCard";
import { api } from "@/services/api";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface PromotionDetailResponse {
  id: string;
  name: string;
  description?: string;
  requirements?: string;
  images: string[];
  originalPrice: number;
  promoPrice: number;
  stock: number;
  limitPerUser: number;
  endTime: string;
  seller: {
    id: string;
    name: string;
    avatarUrl?: string;
    address?: string;
    businessHours?: any;
  };
}

function calcDiscount(original: number, promo: number): string {
  if (!original || original <= 0) return "0% off";
  const pct = Math.round(((original - promo) / original) * 100);
  return `${pct}% off`;
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
}

export default async function PromotionDetails({ params }: PageProps) {
  const { id } = await params;

  let promotion: PromotionDetailResponse | null = null;
  let userRedeemedCount = 0;

  try {
    // Busca em paralelo:
    // 1. Dados públicos da promoção (`GET /promotions/:id`)
    // 2. Soma otimizada vinda da nova Server Action (`GET /redeems/promotion/:id/total-quantity`)
    const [promotionRes, totalRedeemed] = await Promise.all([
      api.get<PromotionDetailResponse>(`/promotions/${id}`),
      getUserRedeemedCount(id),
    ]);

    promotion = promotionRes.data;
    userRedeemedCount = totalRedeemed;
  } catch (error) {
    console.error("Erro ao carregar detalhes da promoção:", error);
    return notFound();
  }

  if (!promotion) {
    return notFound();
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 ">

      <PromotionDetailCard
        id={promotion.id}
        images={
          promotion.images && promotion.images.length > 0
            ? promotion.images
            : ["/placeholder.png"]
        }
        badgeDiscount={calcDiscount(
          promotion.originalPrice,
          promotion.promoPrice,
        )}
        title={promotion.name}
        description={
          promotion.description || "Sem descrição informada para esta promoção."
        }
        requirements={
          promotion.requirements ||
          "Apresente o cupom de resgate no estabelecimento."
        }
        stock={promotion.stock}
        userLimit={promotion.limitPerUser}
        userRedeemedCount={userRedeemedCount}
        duration={new Date(promotion.endTime).toLocaleDateString("pt-BR")}
        timeLeft={promotion.endTime}
        storeName={promotion.seller?.name || "Loja Parceira"}
        avatarUrl={promotion.seller?.avatarUrl || undefined}
        storeHours={promotion.seller?.businessHours || undefined}
        storeLocation={promotion.seller?.address || "Endereço não informado"}
        originalPrice={formatCurrency(promotion.originalPrice)}
        discountPrice={formatCurrency(promotion.promoPrice)}
      />
    </div>
  );
}
