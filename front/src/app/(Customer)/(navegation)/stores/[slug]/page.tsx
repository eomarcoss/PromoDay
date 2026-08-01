import { StoreDetailsCard } from "@/components/shared/StoreDetailsCard";
import PromoGrid from "@/components/shared/PromoGrid";
import { api } from "@/services/api";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Tipagem baseada no retorno do GET /sellers/:id do NestJS
interface SellerDetailResponse {
  id: string;
  name: string;
  address?: string;
  category?: string;
  businessHours?: string | any;
  avatarUrl?: string;
  promotions?: any[];
}

// Helper para tratar a exibição dos horários
function formatBusinessHours(hours: any): string {
  if (!hours) return "Horário não informado";
  if (typeof hours === "string") return hours;
  // Se for objeto salvo em JSON no banco, ajusta a formatação simples
  return "08:00 às 22:00";
}

export default async function StoreProfilePage({ params }: PageProps) {
  // 1. Pega o ID da URL dinamicamente
  const { slug } = await params;

  let store: SellerDetailResponse | null = null;

  try {
    // 2. Busca a loja no backend NestJS
    const { data } = await api.get<SellerDetailResponse>(`/sellers/${slug}`);
    store = data;
  } catch (error) {
    console.error("Erro ao buscar detalhes da loja:", error);
    return notFound();
  }

  if (!store) {
    return notFound();
  }

  return (
    <div className="min-h-screen text-white p-4 w-full mx-auto flex flex-col items-center gap-6">
      {/* 3. Preenche os dados da loja de forma dinâmica */}
      <StoreDetailsCard
        name={store.name}
        imageUrl={store.avatarUrl}
        businessHours={formatBusinessHours(store.businessHours)}
        location={store.address || "Endereço não informado"}
        category={store.category || "Geral"}
      />

      {/* 4. Repassa as promoções pertencentes a essa loja para o grid */}
      <PromoGrid products={store.promotions || []} sellerId={store.id} />
    </div>
  );
}
