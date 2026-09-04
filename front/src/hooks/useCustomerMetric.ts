"use client";

import useSWR from "swr";
import { api } from "@/services/api";

interface CustomerMetrics {
  totalRedemptions: number;
  totalSavedAmount: number;
}

const fetcher = async (url: string) => {
  const res = await api.get<CustomerMetrics>(url);
  return res.data;
};

export function useCustomerMetrics() {
  const { data, error, isLoading } = useSWR<CustomerMetrics>(
    "/costomers/metrics",
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
    },
  );

  return {
    metrics: data ?? { totalRedemptions: 0, totalSavedAmount: 0 },
    isLoading,
    isError: error,
  };
}