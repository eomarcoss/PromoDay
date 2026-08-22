"use client";

import useSWR from "swr";
import { getTokenAction } from "@/app/actions/auth";

interface SellerMetrics {
  totalPromotions: number;
  totalSales: number;
}

const fetcher = async (url: string) => {
  const token = await getTokenAction();
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar métricas");
  }

  return res.json();
};

export function useSellerMetrics() {
  const { data, error, isLoading } = useSWR<SellerMetrics>(
    "http://localhost:3001/sellers/metrics", // Ajuste para a URL/porta da sua API NestJS
    fetcher,
    {
      refreshInterval: 10000, // Revalida a cada 10 segundos
      revalidateOnFocus: true,
    },
  );

  return {
    metrics: data ?? { totalPromotions: 0, totalSales: 0 },
    isLoading,
    isError: error,
  };
}
