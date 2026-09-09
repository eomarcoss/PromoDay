"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";

export interface SellerMetricsData {
  totalPromotions: number;
  totalSales: number;
}

export async function getSellerMetricsAction(): Promise<SellerMetricsData> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("@PromoDay:token")?.value;

    if (!token) {
      return { totalPromotions: 0, totalSales: 0 };
    }

    const response = await api.get<SellerMetricsData>("/sellers/metrics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar métricas do vendedor:", error);
    return { totalPromotions: 0, totalSales: 0 };
  }
}
