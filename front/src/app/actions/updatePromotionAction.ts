"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/api";

export async function updatePromotionAction(
  promotionId: string,
  formData: FormData,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("@PromoDay:token")?.value;

  if (!token) {
    return { success: false, error: "Usuário não autenticado." };
  }

  try {
    const response = await api.patch(`/promotions/${promotionId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Erro ao atualizar a promoção.";

    console.error(
      `[updatePromotionAction Error ${status || ""}]:`,
      errorMessage,
    );

    return {
      success: false,
      error: errorMessage,
    };
  }
}
