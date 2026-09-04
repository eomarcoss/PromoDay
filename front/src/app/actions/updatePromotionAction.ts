"use server";

import { api } from "@/services/api";
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { AxiosError } from "axios";

export async function updatePromotionAction(
  promotionId: string,
  formData: FormData,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("@PromoDay:token")?.value;
  const role = getRoleFromToken(token);

  if (!token || role !== "SELLER") {
    return { success: false, error: "Sessão expirada ou usuário não autorizado." };
  }

  try {
    const response = await api.patch(
      `/seller/promotions/${promotionId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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
    let errorMessage = "Erro ao atualizar a promoção.";

    if (error instanceof AxiosError) {
      errorMessage =
        error.response?.data?.message ||
        "O servidor demorou a responder ou falhou ao atualizar a promoção.";
    } else if (error?.message) {
      errorMessage = error.message;
    }

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