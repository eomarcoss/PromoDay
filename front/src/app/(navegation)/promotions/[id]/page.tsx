"use client";

import { PromotionDetailCard } from "@/components/shared/PromotionDetailsCard";

export default function PromotionDetails() {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 ">
      <h1>Detalhes da promoção</h1>
      <PromotionDetailCard
        imageUrl="https://images.unsplash.com/photo-1622445262465-2481c4574875?w=800&q=80" // Imagem mock do Unsplash (Carregador)
        badgeDiscount="20% off"
        title="Carregador tipo C"
        description="Compatível com uma ampla gama de modelos de smartphones, incluindo Xiaomi, Samsung e outras marcas de ponta com suporte a carregamento rápido Turbo Power."
        requirements="Comprar 50 reais em compras no estabelecimento."
        stock={4} // Quantidade em estoque
        userLimit={2} // Limite máximo por utilizador (o stepper vai travar aqui!)
        duration="1d:12h"
        storeName="Super Cell"
        storeHours="Segunda a Sexta: 09h às 18h"
        storeLocation="Rua Principal, 123 - Centro"
        originalPrice="R$ 49,90"
        discountPrice="R$ 39,90"
      />
    </div>
  );
}
