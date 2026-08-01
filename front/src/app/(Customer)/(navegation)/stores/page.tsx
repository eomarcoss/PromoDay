import React from "react";
import { StoreList, Store } from "@/components/shared/StoreList"; // Ajuste o caminho do seu import
import { api } from "@/services/api";

async function getStores(): Promise<Store[]> {
  try {
    const response = await api.get("/sellers");

    // 💡 Se o backend retornar { data: [...] } em vez de direto [...], acessa response.data.data
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

      {/* 🚀 O StoreList lida com a renderização da lista */}
      <StoreList stores={stores} />
    </div>
  );
}
