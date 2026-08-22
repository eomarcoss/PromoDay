"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface PausePromotionResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function pausePromotionAction(
  productId: string,
): Promise<PausePromotionResponse> {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("@PromoDay:token")?.value;
    const role = cookieStore.get("@PromoDay:role")?.value;

    if (!token || role !== "SELLER") {
      return {
        success: false,
        error: "Sessão expirada ou usuário não autorizado.",
      };
    }

    const response = await api.patch(
      `/promotions/${productId}/pause`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    revalidatePath("/promotions");
    revalidatePath("/seller/dashboard");

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error(
      "Erro na Server Action pausePromotionAction:",
      error?.response?.data || error.message,
    );

    const errorMessage =
      error?.response?.data?.message || "Falha ao pausar promoção.";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
