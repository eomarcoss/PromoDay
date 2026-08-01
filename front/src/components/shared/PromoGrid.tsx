import { PromoCard } from "@/components/shared/PromoCard";
import Link from "next/link";
import { api } from "@/services/api";

export interface PromotionFromBackend {
  id: string;
  name: string;
  images: string[];
  originalPrice: number;
  promoPrice: number;
  stock?: number;
  limitPerUser?: number;
  endTime: string;
  seller?: {
    id: string;
    name: string;
  };
}

interface PromoGridProps {
  // 🚀 Opcional: Se receber o array pronto (da página da loja), usa ele.
  // Se não receber nada, ele busca tudo da API (na Home).
  products?: PromotionFromBackend[];
  sellerId?: string;
}

async function getPromotions(
  sellerId?: string,
): Promise<PromotionFromBackend[]> {
  try {
    // Permite filtrar via Query Params se o backend der suporte (?sellerId=123)
    const endpoint = sellerId
      ? `/promotions?sellerId=${sellerId}`
      : "/promotions";
    const { data } = await api.get(endpoint, {
      next: { revalidate: 30 },
    });
    return data;
  } catch (error) {
    console.error("Erro ao buscar promoções:", error);
    return [];
  }
}

function calcDiscount(original: number, promo: number): number {
  if (!original || original <= 0) return 0;
  return Math.round(((original - promo) / original) * 100);
}

export default async function PromoGrid({
  products,
  sellerId,
}: PromoGridProps) {
  // Se 'products' for informado, usa diretamente. Senão, faz o fetch na API.
  const promotions = products ?? (await getPromotions(sellerId));

  return (
    <div className="w-full max-w-9xl px-4 sm:px-6 lg:px-8 space-y-6 min-h-screen py-8">
      {promotions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 font-bold">
            Nenhuma promoção ativa no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          {promotions.map((promo) => (
            <Link
              key={promo.id}
              href={`/promotions/${promo.id}`}
              className="h-full"
            >
              <PromoCard
                product={{
                  name: promo.name,
                  storeName: promo.seller?.name || "Loja Parceira",
                  originalPrice: promo.originalPrice,
                  promoPrice: promo.promoPrice,
                  discountPercentage: calcDiscount(
                    promo.originalPrice,
                    promo.promoPrice,
                  ),
                  timeLeft: promo.endTime,
                  imageUrl: promo.images?.[0] || "",
                }}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
