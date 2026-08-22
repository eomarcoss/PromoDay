"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";

export interface ValidateClaimResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    code: string;
    quantity: number;
    user?: {
      name: string;
      email?: string;
    };
    promotion?: {
      name: string;
    };
  };
}

export async function validateClaimAction(
  code: string,
): Promise<ValidateClaimResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("@PromoDay:token")?.value;
    const role = cookieStore.get("@PromoDay:role")?.value;

    // Se não for SELLER ou não possuir token, bloqueia a execução
    if (!token || role !== "SELLER") {
      return {
        success: false,
        message:
          "Acesso não autorizado. Apenas vendedores podem validar códigos.",
      };
    }

    // Requisição PATCH para a rota do NestJS
    const response = await api.patch(
      "/seller/claims/validate",
      { code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      success: true,
      message: "Cupom validado com sucesso!",
      data: response.data,
    };
  } catch (error: any) {
    console.error(
      "Erro ao validar código no NestJS:",
      error?.response?.data || error.message,
    );

    // Trata mensagens de erro retornadas pelo NestJS (ex: 400 Bad Request, 404 Not Found)
    const errorMessage =
      error?.response?.data?.message ||
      "Erro ao validar código. Verifique se o código está correto ou se já foi utilizado.";

    return {
      success: false,
      message: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
    };
  }
}
