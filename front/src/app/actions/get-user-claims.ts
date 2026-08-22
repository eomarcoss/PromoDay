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
    seller:
      | {
          name?: string | undefined;
          avatarUrl?: string | undefined;
          id?: string;
        }
      | undefined;
    id: string;
    name: string;
    images?: string[];
  };
  seller: {
    name: string;
    avatarUrl: string;
    id: string;
  };
}

export async function getUserClaims(): Promise<UserClaim[]> {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("@PromoDay:token")?.value;
    // Pega o valor do cookie de role (ajuste o nome se for diferente)
    const role = cookieStore.get("@PromoDay:role")?.value;

    // Se não houver token ou se o usuário logado NÃO for um 'USER' (ex: for SELLER/ADMIN), aborta
    if (!token || role !== "CUSTOMER") {
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
