"use client";

import useSWR from "swr";
import {
  getSellerMetricsAction,
  SellerMetricsData,
} from "@/app/actions/getSellerMetricsAction";

export function useSellerMetrics() {
  const { data, error, isLoading } = useSWR<SellerMetricsData>(
    "seller-metrics",
    () => getSellerMetricsAction(),
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
