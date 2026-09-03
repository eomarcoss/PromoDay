import PromoGrid from "@/components/shared/PromoGrid";
import { api } from "@/services/api";

interface PageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

async function getAllPromotions(category?: string) {
  try {
    const { data } = await api.get("/promotions", {
      params: { category }, // Filtra por categoria no banco de dados
      timeout: 5000,
    });
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar promoções públicas:", error);
    return [];
  }
}

export default async function AllPromotionsPage({ searchParams }: PageProps) {
  const { search, category } = await searchParams;
  const promotions = await getAllPromotions(category);

  return (
    <main className="w-full min-h-screen py-6">
      {/* O PromoGrid agora recebe os produtos e faz a busca inteligente via Fuse.js */}
      <PromoGrid products={promotions} role="CUSTOMER" searchTerm={search} />
    </main>
  );
}