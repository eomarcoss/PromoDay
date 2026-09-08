"use type"; // Mantém a estrutura original

"use server"; // 👈 Roda estritamente no servidor do Next.js

import { cookies } from "next/headers";
import { authService } from "@/services/auth";
import { LoginPayload } from "@/types/auth";
import { RegisterSellerPayload } from "@/types/seller";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";

/**
 * Action para realizar o login e salvar os cookies seguros
 */
export async function signInAction(credentials: LoginPayload) {
  try {
    const { data } = await authService.login(credentials);
    const cookieStore = await cookies();

    // ⚠️ Importante: sameSite precisa ser "lax" em deploys cross-domain
    cookieStore.set("@PromoDay:token", data.access_token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
      httpOnly: true,
    });

    return { success: true, user: data.user };
  } catch (error) {
    console.error("ERRO COMPLETO NA ACTION DE LOGIN:", error);

    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || "Servidor indisponível ou erro na resposta.",
      };
    }

    return {
      success: false,
      error: "Falha na autenticação.",
    };
  }
}
/**
 * Action para registrar um Cliente (Customer)
 */
export async function registerCustomerAction(formdata: FormData) {
  try {
    await authService.registerCustomer(formdata);
    return { success: true };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao cadastrar cliente no servidor.",
      };
    }
    return {
      success: false,
      error: "Erro inesperado ao cadastrar cliente.",
    };
  }
}

/**
 * Action para registrar um Vendedor (Seller)
 */
export async function registerSellerAction(formdata: FormData) {
  try {
    await authService.registerSeller(formdata);
    return { success: true };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao cadastrar vendedor no servidor.",
      };
    }
    return {
      success: false,
      error: "Erro inesperado ao cadastrar vendedor.",
    };
  }
}

/**
 * Action para limpar a sessão
 */
export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("@PromoDay:token");
  redirect("/auth/login");
}

export async function getTokenAction(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get("@PromoDay:token")?.value;
  return token;
}