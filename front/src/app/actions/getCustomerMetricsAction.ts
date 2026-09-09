"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";

export interface CustomerMetricsData {
    totalRedemptions: number;
    totalSavedAmount: number;
}

export async function getCustomerMetricsAction(): Promise<CustomerMetricsData> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("@PromoDay:token")?.value;

        if (!token) {
            return { totalRedemptions: 0, totalSavedAmount: 0 };
        }

        const response = await api.get<CustomerMetricsData>("/costomers/metrics", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Erro ao buscar métricas do cliente:", error);
        return { totalRedemptions: 0, totalSavedAmount: 0 };
    }
}
