"use server";

import { api } from "@/services/api";
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

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
    const role = getRoleFromToken(token);

    if (!token || role !== "SELLER") {
      return {
        success: false,
        message:
          "Acesso não autorizado. Apenas vendedores podem validar códigos.",
      };
    }

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

    let errorMessage =
      "Erro ao validar código. Verifique se o código está correto ou se já foi utilizado.";

    if (error instanceof AxiosError) {
      const responseMessage = error.response?.data?.message;
      if (responseMessage) {
        errorMessage = Array.isArray(responseMessage)
          ? responseMessage[0]
          : responseMessage;
      } else {
        errorMessage =
          "O servidor demorou a responder ou falhou ao validar o cupom.";
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}