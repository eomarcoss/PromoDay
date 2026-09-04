export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PromoGrid, { PromotionFromBackend } from "@/components/shared/PromoGrid";
import { api } from "@/services/api";

// 1. Atualiza a função para aceitar search e category opcionais
async function getSellerPromotions(search?: string, category?: string): Promise<PromotionFromBackend[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("@PromoDay:token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    // 2. Monta os parâmetros de query string dinamicamente
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "todas") params.set("category", category);

    const queryString = params.toString() ? `?${params.toString()}` : "";

    // 3. Envia os parâmetros para a rota do NestJS (/seller/promotions?search=...&category=...)
    const { data } = await api.get(`/seller/promotions${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    });

    return data || [];
  } catch (error) {
    console.error("Erro ao buscar promoções do vendedor no servidor:", error);
    return [];
  }
}

// 4. Recebe os searchParams do Next.js (No App Router atual, searchParams pode vir como Promise)
interface SellerPromotionsPageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function SellerPromotionsPage({ searchParams }: SellerPromotionsPageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search;
  const category = resolvedParams?.category;

  // 5. Repassa os parâmetros capturados da URL para a função de busca
  const promotions = await getSellerPromotions(search, category);

  return (
    <div className="w-full max-w-9xl px-4 sm:px-6 lg:px-8 space-y-6 min-h-screen py-6">
      <PromoGrid products={promotions} role="SELLER" />
    </div>
  );
}