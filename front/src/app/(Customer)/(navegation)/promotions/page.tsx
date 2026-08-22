import PromoGrid, { PromotionFromBackend } from "@/components/shared/PromoGrid";
import { api } from "@/services/api";

async function getAllPromotions(): Promise<PromotionFromBackend[]> {
  try {
    // Busca na rota pública sem enviar token de autorização
    const { data } = await api.get("/promotions", {
      timeout: 5000,
      next: { revalidate: 30 }, // Atualiza o cache a cada 30s
    });
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar promoções públicas:", error);
    return [];
  }
}

export default async function AllPromotionsPage() {
  const promotions = await getAllPromotions();

  return (
    <main className="w-full min-h-screen py-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Todas as Promoções
      </h1>
      <PromoGrid products={promotions} role="CUSTOMER" />
    </main>
  );
}
