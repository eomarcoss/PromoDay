"use server";

import { getRoleFromToken } from "@/utils/getRoleFromToken";
import { cookies } from "next/headers";
import { api } from "@/services/api";
import { AxiosError } from "axios";

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

    // 4. Utiliza a instância global do Axios (com baseURL correta e timeout configurado)
    const response = await api.post("/seller/promotions", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Erro na Server Action:", error);

    let errorMsg = "Ocorreu um erro ao conectar com o servidor.";
    if (error instanceof AxiosError) {
      const responseMessage = error.response?.data?.message;
      if (Array.isArray(responseMessage)) {
        errorMsg = responseMessage.join(", ");
      } else if (typeof responseMessage === "string") {
        errorMsg = responseMessage;
      } else {
        errorMsg = "O servidor demorou a responder ou falhou ao criar a promoção.";
      }
    } else if (error?.message) {
      errorMsg = error.message;
    }

    return {
      success: false,
      error: errorMsg,
    };
  }
}