"use server"; // 👈 Roda estritamente no servidor do Next.js

import { cookies } from "next/headers";
import { authService } from "@/services/auth";
import { LoginPayload } from "@/types/auth";
// import { RegisterCustomerPayload } from "@/types/customer";
import { RegisterSellerPayload } from "@/types/seller";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";
/**
 * Action para realizar o login e salvar o cookie seguro
 */
export async function signInAction(credentials: LoginPayload) {
  try {
    // Chama o serviço HTTP mapeado acima
    const { data } = await authService.login(credentials);

    const cookieStore = await cookies();

    // Grava o cookie httpOnly blindado contra XSS
    cookieStore.set("@PromoDay:token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });

    return { success: true, user: data.user };
  } catch (error) {
    console.error("ERRO COMPLETO NA ACTION DE LOGIN:", error);
    const axiosError = error as AxiosError<{ message: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.message || "Falha na autenticação.",
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
    const axiosError = error as AxiosError<{ message: string }>;
    return {
      success: false,
      error: axiosError.response?.data?.message || "Erro ao cadastrar cliente.",
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
    const axiosError = error as AxiosError<{ message: string }>;
    return {
      success: false,
      error:
        axiosError.response?.data?.message || "Erro ao cadastrar vendedor.",
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
