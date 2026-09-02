"use server";

import { getRoleFromToken } from "@/utils/getRoleFromToken";
import { cookies } from "next/headers";

export async function createPromotionAction(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("@PromoDay:token")?.value;
    const role = getRoleFromToken(token);

    if (!token || role !== "SELLER") {
      return {
        success: false,
        error: "Sessão expirada ou usuário não autorizado para criar promoções.",
      };
    }

    const payload = new FormData();

    // 1. Copia todos os campos de texto ignorando 'files'
    formData.forEach((value, key) => {
      if (key !== "files") {
        payload.append(key, value);
      }
    });

    // 2. Obtém todos os arquivos enviados sob a chave 'files'
    const files = formData.getAll("files");

    // 3. Re-anexa no payload apenas arquivos válidos e com conteúdo
    files.forEach((file) => {
      if (file instanceof File && file.size > 0) {
        payload.append("files", file);
      }
    });

    // 4. Envia o payload para o NestJS
    const response = await fetch("http://localhost:3001/seller/promotions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    });

    const result = await response.json();

    if (!response.ok) {
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
