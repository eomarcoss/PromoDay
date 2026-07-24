import { PromoCard } from "@/components/shared/PromoCard";
import Link from "next/link";
import { api } from "@/services/api";

interface Product {
  name: string;
  storeName: string;
  originalPrice: number;
  promoPrice: number;
  discountPercentage: number;
  timeLeft: string;
  imageUrl: string;
}

// 🚀 Buscamos os dados direto do NestJS na camada do Servidor
async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get("/promotions", {
      // Opcional: Garante que o Next revalide os dados a cada 30 segundos (Incremental Static Regeneration)
      next: { revalidate: 30 },
    });
    return data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return []; // Retorna array vazio para o app não quebrar em tela
  }
}

export default async function PromoGrid() {
  const products = await getProducts();

  return (
    <div className="w-full max-w-9xl px-4 sm:px-6 lg:px-8 space-y-6  min-h-screen">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 w-full max-w-7xl mx-auto px-4">
        {products.map((product) => (
          <Link
            key={product.name}
            href={`/promotions/${encodeURIComponent(product.name)}`}
          >
            <PromoCard key={product.name} product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
}
