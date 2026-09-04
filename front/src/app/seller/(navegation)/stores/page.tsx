export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import { StoreList, Store } from "@/components/shared/StoreList";
import { api } from "@/services/api";

async function getStores(): Promise<Store[]> {
  try {
    const response = await api.get("/sellers");
    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (data && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error("Erro ao buscar lojas:", error);
    return [];
  }
}

export default async function StoreListPage() {
  const stores = await getStores();

  return (
    <div className="h-auto text-white p-3 flex flex-col gap-4 items-center max-w-2xl mx-auto w-full">
      <h1 className="text-xl font-black self-start mb-2">Lojas Parceiras</h1>

      <Suspense fallback={<div>Carregando lojas...</div>}>
        <StoreList stores={stores} />
      </Suspense>
    </div>
  );
}