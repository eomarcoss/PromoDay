"use client";

import useSWR from "swr";
import { getCustomerMetricsAction, CustomerMetricsData } from "@/app/actions/getCustomerMetricsAction";

export function useCustomerMetrics() {
  const { data, error, isLoading } = useSWR<CustomerMetricsData>(
    "customer-metrics",
    () => getCustomerMetricsAction(),
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
    }
  );

  return {
    metrics: data ?? { totalRedemptions: 0, totalSavedAmount: 0 },
    isLoading,
    isError: error,
  };
}
