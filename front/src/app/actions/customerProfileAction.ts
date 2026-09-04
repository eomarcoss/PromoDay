"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

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
export async function updateProfileCustomerAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("@PromoDay:token")?.value;

  if (!token) {
    return { success: false, error: "Usuário não autenticado." };
  }

  try {
    const response = await api.patch("/costomers/profile", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data: {
        ...response.data,
        role: "CUSTOMER",
      },
    };
  } catch (error: any) {
    const status = error?.response?.status;

    // Tratamento robusto verificando se é AxiosError para evitar falhas em timeouts de Cold Start
    let errorMessage = "Erro ao atualizar perfil.";
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || "O servidor demorou a responder ou falhou ao atualizar.";
    } else if (error?.message) {
      errorMessage = error.message;
    }

    console.error(
      `[updateProfileCustomerAction Error ${status || ""}]:`,
      errorMessage,
    );

    return {
      success: false,
      error: errorMessage,
    };
  }
}