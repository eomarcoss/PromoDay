"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";

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

    if (!token) {
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
  updateData: Partial<SellerProfileData>,
): Promise<SellerProfileData> {
  const cookieStore = await cookies();
  const token = cookieStore.get("@PromoDay:token")?.value;

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  try {
    const response = await api.patch<SellerProfileData>(
      "/sellers/profile",
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Cookie: `@PromoDay:token=${token}`,
        },
      },
    );

    return {
      ...response.data,
      role: "SELLER",
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
    throw new Error(errorMessage);
  }
}
