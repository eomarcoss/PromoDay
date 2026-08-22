"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface DeletePromotionResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function deletePromotionAction(
  productId: string,
): Promise<DeletePromotionResponse> {
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

    const response = await api.delete(`/promotions/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    revalidatePath("/promotions");
    revalidatePath("/seller/promotions");

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error(
      "Erro na Server Action deletePromotionAction:",
      error?.response?.data || error.message,
    );

    const errorMessage =
      error?.response?.data?.message || "Falha ao excluir promoção.";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
