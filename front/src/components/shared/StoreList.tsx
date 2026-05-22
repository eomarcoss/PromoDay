"use-client";
import React from "react";

import { StoreCard } from "../shared/StoreCard";

export default function StoreListPage() {
  return (
    <div className="h-auto text-white p-3 flex flex-col gap-4 items-center max-w-2xl mx-auto">
      {/* Exemplo 1: Loja Aberta */}
      <StoreCard name="Bc Supermercados" offersCount={5} isOpen={true} />

      {/* Exemplo 2: Outra loja para teste */}
      <StoreCard name="PromoDay Modas" offersCount={12} isOpen={false} />
    </div>
  );
}
