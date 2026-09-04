"use server";

import { getRoleFromToken } from "@/utils/getRoleFromToken";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { api } from "@/services/api";
import { AxiosError } from "axios";

interface RedeemParams {
  promotionId: string;
  quantity: number;
}

export async function redeemPromotionAction({
  promotionId,
  quantity,
}: RedeemParams) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("@PromoDay:token")?.value;
    const role = getRoleFromToken(token);

    if (!token || role !== "CUSTOMER") {
      return {
        success: false,
        error: "Sessão expirada ou usuário não autorizado.",
      };
    }

    // Utiliza a instância global do Axios substituindo a URL hardcoded do localhost
    const response = await api.post(
      `/promotions/${promotionId}/redeem`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    revalidatePath("/promotions");
    revalidatePath("/redeems");

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Erro na Server Action redeemPromotionAction:", error);

    let errorMsg = "Falha na comunicação com o servidor.";
    if (error instanceof AxiosError) {
      errorMsg =
        error.response?.data?.message ||
        "O servidor demorou a responder ou falhou ao realizar o resgate.";
    } else if (error?.message) {
      errorMsg = error.message;
    }

    return { success: false, error: errorMsg };
  }
}