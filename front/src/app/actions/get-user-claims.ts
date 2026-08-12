"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";

export interface UserClaim {
  id: string;
  code: string;
  quantity: number;
  status: string;
  createdAt: string;
  promotion: {
    id: string;
    name: string;
    images?: string[];
  };
}

export async function getUserClaims(): Promise<UserClaim[]> {
  try {
    const cookieStore = await cookies();
    // Substitua 'token' pelo nome exato do seu cookie JWT
    const token = cookieStore.get("@PromoDay:token")?.value;

    if (!token) {
      console.warn("Token de autenticação não encontrado nos cookies.");
      return [];
    }

    const response = await api.get<UserClaim[]>("/redeems", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data || [];
  } catch (error: any) {
    console.error(
      "Erro na Server Action getUserClaims:",
      error?.response?.data || error.message,
    );
    return [];
  }
}
