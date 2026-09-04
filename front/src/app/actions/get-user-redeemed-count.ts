"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

interface RedeemCountResponse {
  total: number | PromiseLike<number>;
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

    if (!token) {
      return 0;
    }

    const response = await api.get<RedeemCountResponse>(
      `promotion/${promotionId}/total-quantity`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Garante que o valor retornado seja resolvido de forma numérica segura
    const total = await response.data.total;
    return typeof total === "number" ? total : 0;
  } catch (error: any) {
    let errorDetail = error?.message;
    if (error instanceof AxiosError) {
      errorDetail = error.response?.data || error.message;
    }

    console.error(
      "Erro na Server Action getUserRedeemedCount:",
      errorDetail,
    );

    // Retorna 0 em caso de falha de conexão/timeout do Render para manter a interface intacta
    return 0;
  }
}