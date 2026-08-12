"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

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

    if (!token) {
      return {
        success: false,
        error: "Sessão expirada. Faça login novamente.",
      };
    }

    const response = await fetch(
      `http://localhost:3001/promotions/${promotionId}/redeem`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Não foi possível realizar o resgate.",
      };
    }

    revalidatePath("/promotions");
    revalidatePath("/redeems");

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Falha na comunicação com o servidor." };
  }
}
