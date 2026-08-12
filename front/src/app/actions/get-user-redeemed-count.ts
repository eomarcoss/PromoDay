"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";

interface RedeemCountResponse {
  count: number;
}

/**
 * Consulta a rota do NestJS que busca de forma otimizada (via findUnique/aggregate)
 * a quantidade de cupons que o usuário logado resgatou para a promoção informada.
 */
export async function getUserRedeemedCount(
  promotionId: string,
): Promise<number> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("@PromoDay:token")?.value;

    // Se não houver token, o usuário está anônimo e o total resgatado é 0
    if (!token) {
      return 0;
    }

    // Chamada direta para a rota específica do backend NestJS
    const response = await api.get<RedeemCountResponse>(
      `promotion/${promotionId}/total-quantity`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.total;
  } catch (error: any) {
    console.error(
      "Erro na Server Action getUserRedeemedCount:",
      error?.response?.data || error.message,
    );
    return 0;
  }
}
