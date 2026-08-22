import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PromoGrid, { PromotionFromBackend } from "@/components/shared/PromoGrid";
import { api } from "@/services/api";

async function getSellerPromotions(): Promise<PromotionFromBackend[]> {
  const cookieStore = await cookies();
  // Altere 'token' caso o nome do seu cookie seja outro (ex: '@PromoDay:token')
  const token = cookieStore.get("@PromoDay:token")?.value;

  // Se não houver cookie de autenticação, redireciona o usuário antes de montar a página
  if (!token) {
    redirect("/login");
  }

  try {
    const { data } = await api.get("/seller/promotions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000, // Previne que a chamada fique pendente
    });

    return data || [];
  } catch (error) {
    console.error("Erro ao buscar promoções do vendedor no servidor:", error);
    return [];
  }
}

export default async function SellerPromotionsPage() {
  const promotions = await getSellerPromotions();

  return (
    <div className="w-full max-w-9xl px-4 sm:px-6 lg:px-8 space-y-6 min-h-screen py-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Minhas Ofertas</h1>
      <PromoGrid products={promotions} role="SELLER" />
    </div>
  );
}
