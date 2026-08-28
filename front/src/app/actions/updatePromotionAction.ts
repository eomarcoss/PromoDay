"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/services/api";

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
    // No Axios: api.patch(URL, DATA, CONFIG)
    const response = await api.patch(
      `/seller/promotions/${promotionId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // 👈 Crucial para envio de arquivos
        },
      },
    );

    revalidatePath("/seller/promotions");
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
