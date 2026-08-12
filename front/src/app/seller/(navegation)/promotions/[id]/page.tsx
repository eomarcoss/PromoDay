import { PromotionDetailCard } from "@/components/shared/PromotionDetailsCard";
import { api } from "@/services/api";
import { notFound } from "next/navigation";

// 1. Tipagem das props que o Next passa para rotas dinâmicas [id]
interface PageProps {
  params: Promise<{ id: string }>;
}

// 2. Tipagem dos dados retornados pelo endpoint GET /promotions/:id do NestJS
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
    address?: string;
    businessHours?: any;
  };
}

// Helper para calcular a % de desconto
function calcDiscount(original: number, promo: number): string {
  if (!original || original <= 0) return "0% off";
  const pct = Math.round(((original - promo) / original) * 100);
  return `${pct}% off`;
}

// Helper para formatar o preço
function formatCurrency(val: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
}

// 🚀 Server Component Async
export default async function PromotionDetails({ params }: PageProps) {
  // Acessa o id vindo da URL /promotions/[id]
  const { id } = await params;

  let promotion: PromotionDetailResponse | null = null;

  try {
    // Faz a chamada para o endpoint do NestJS (GET /promotions/:id)
    const { data } = await api.get<PromotionDetailResponse>(
      `/promotions/${id}`,
    );
    promotion = data;
  } catch (error) {
    console.error("Erro ao buscar detalhes da promoção:", error);
    // Se não encontrar ou der erro 404, exibe a página de 404 do Next.js
    return notFound();
  }

  if (!promotion) {
    return notFound();
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-black mb-4">Detalhes da promoção</h1>

      <PromotionDetailCard
        id={id}
        imageUrl={promotion.images?.[0] || "/placeholder.png"}
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
        duration={new Date(promotion.endTime).toLocaleDateString("pt-BR")}
        storeName={promotion.seller?.name || "Loja Parceira"}
        storeHours="Segunda a Sexta: 09h às 18h" // Pode mapear o objeto businessHours se quiser
        storeLocation={promotion.seller?.address || "Endereço não informado"}
        originalPrice={formatCurrency(promotion.originalPrice)}
        discountPrice={formatCurrency(promotion.promoPrice)}
      />
    </div>
  );
}
