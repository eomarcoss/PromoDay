"use client";

import useSWR from "swr";
import { getTokenAction } from "@/app/actions/auth";

interface CustomerMetrics {
  totalRedemptions: number;
  totalSavedAmount: number;
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
    throw new Error("Erro ao buscar métricas do cliente");
  }

  return res.json();
};

export function useCustomerMetrics() {
  const { data, error, isLoading } = useSWR<CustomerMetrics>(
    "http://localhost:3001/costomers/metrics",
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
