"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import { AxiosError } from "axios";

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
    const role = getRoleFromToken(token);

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
    let errorDetail = error?.message;
    if (error instanceof AxiosError) {
      errorDetail = error.response?.data || error.message;
    }

    console.error(
      "Erro na Server Action getUserClaims:",
      errorDetail,
    );

    // Retorna array vazio em caso de falha de conexão/timeout do Render para não quebrar a página
    return [];
  }
}