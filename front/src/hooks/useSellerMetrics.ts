"use client";

import useSWR from "swr";
import { api } from "@/services/api";

interface SellerMetrics {
  totalPromotions: number;
  totalSales: number;
}

const fetcher = async (url: string) => {
  const res = await api.get<SellerMetrics>(url);
  return res.data;
};

export function useSellerMetrics() {
  const { data, error, isLoading } = useSWR<SellerMetrics>(
    "/sellers/metrics",
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