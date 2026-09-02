"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";
import { getRoleFromToken } from "@/utils/getRoleFromToken"; // 👈 Importa o utilitário que criamos para decodificar a role do token

export interface SellerProfileData {
  id: string;
  name: string;
  email: string;
  role: "SELLER";
  avatarUrl?: string;
  phone?: string;
  address?: string;
  businessHours?: string;
  category?: string;
  totalPromotions?: number;
  totalSales?: number;
}

/**
 * Busca os dados do perfil do Vendedor
 */
export async function getProfileSellerAction(): Promise<SellerProfileData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("@PromoDay:token")?.value;
    const role = getRoleFromToken(token);

    if (!token || role !== "SELLER") {
      return null;
    }

    const response = await api.get<SellerProfileData>("/sellers/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        // Cookie: `@PromoDay:token=${token}`,
      },
    });

    return {
      ...response.data,
      role: "SELLER",
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const errorMessage =
      error?.response?.data?.message || error?.message || "Erro desconhecido";

    console.error(
      `[getProfileSellerAction Error ${status || ""}]:`,
      errorMessage,
    );
    return null;
  }
}

/**
 * Atualiza os dados do perfil do Vendedor
 */
export async function updateProfileSellerAction(
  formData: FormData, // 👈 Ajustado para receber o FormData
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("@PromoDay:token")?.value;

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  try {
    const response = await api.patch(
      "/sellers/profile", // 👈 Verifique se a rota no NestJS é /sellers/profile ou /seller/profile
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // 👈 Crucial para envio de arquivos
        },
      },
    );

    return {
      success: true,
      data: {
        ...response.data,
        role: "SELLER",
      },
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Erro ao atualizar perfil.";

    console.error(
      `[updateProfileSellerAction Error ${status || ""}]:`,
      errorMessage,
    );

    return {
      success: false,
      error: errorMessage,
    };
  }
}
