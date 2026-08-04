"use server";

import { cookies } from "next/headers";

export async function createPromotionAction(payload: any) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("@PromoDay:token")?.value;

    if (!token) {
      return {
        success: false,
        error: "Sessão expirada. Por favor, faça login novamente.",
      };
    }

    const response = await fetch("http://localhost:3001/promotions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      // Pega a mensagem tratada do NestJS (ou array de validações)
      const errorMsg = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Erro ao cadastrar a promoção.";

      return { success: false, error: errorMsg };
    }

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Erro na Server Action:", error);
    return {
      success: false,
      error: "Ocorreu um erro ao conectar com o servidor.",
    };
  }
}
