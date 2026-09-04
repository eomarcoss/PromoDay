"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import { AxiosError } from "axios";

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
      },
    });

    return {
      ...response.data,
      role: "SELLER",
    };
  } catch (error: any) {
    const status = error?.response?.status;
    let errorMessage = "Erro desconhecido";

    if (error instanceof AxiosError) {
      errorMessage =
        error.response?.data?.message ||
        "O servidor demorou a responder ou falhou ao buscar o perfil.";
    } else if (error?.message) {
      errorMessage = error.message;
    }

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
  formData: FormData,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("@PromoDay:token")?.value;

  if (!token) {
    return { success: false, error: "Usuário não autenticado." };
  }

  try {
    const response = await api.patch(
      "/sellers/profile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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
    let errorMessage = "Erro ao atualizar perfil.";

    if (error instanceof AxiosError) {
      errorMessage =
        error.response?.data?.message ||
        "O servidor demorou a responder ou falhou ao atualizar o perfil.";
    } else if (error?.message) {
      errorMessage = error.message;
    }

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