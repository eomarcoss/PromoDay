"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";

export interface CustomerProfileData {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER";
  avatarUrl?: string;
  phone?: string;
}

/**
 * Busca os dados do perfil do Cliente
 */
export async function getProfileCustomerAction(): Promise<CustomerProfileData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("@PromoDay:token")?.value;

    if (!token) {
      return null;
    }

    const response = await api.get<CustomerProfileData>("/costomers/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        // Cookie: `@PromoDay:token=${token}`,
      },
    });

    return {
      ...response.data,
      role: "CUSTOMER",
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const errorMessage =
      error?.response?.data?.message || error?.message || "Erro desconhecido";

    console.error(
      `[getProfileCustomerAction Error ${status || ""}]:`,
      errorMessage,
    );
    return null;
  }
}

/**
 * Atualiza os dados do perfil do Cliente
 */
export async function updateProfileCustomerAction(
  updateData: Partial<CustomerProfileData>,
): Promise<CustomerProfileData> {
  const cookieStore = await cookies();
  const token = cookieStore.get("@PromoDay:token")?.value;

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  try {
    const response = await api.patch<CustomerProfileData>(
      "/costomers/profile",
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
      role: "CUSTOMER",
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Erro ao atualizar perfil.";

    console.error(
      `[updateProfileCustomerAction Error ${status || ""}]:`,
      errorMessage,
    );
    throw new Error(errorMessage);
  }
}
