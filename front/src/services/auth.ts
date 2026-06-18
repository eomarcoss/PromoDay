import { api } from "./api";
import { LoginPayload, AuthResponse } from "@/types/auth";
// import { RegisterCustomerPayload } from "@/types/customer";
import { RegisterSellerPayload } from "@/types/seller";

export const authService = {
  // 🔐 Função de Login Única
  login: async (credentials: LoginPayload) => {
    // Como seu backend centralizou o login com e-mail e senha, batemos no endpoint geral
    const { data } = await api.post<AuthResponse>("/auth/login", credentials);
    return data;
  },

  // 👤 Cadastro de Cliente
  registerCustomer: async (formData: FormData) => {
    const { data } = await api.post("/costomers", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // 👈 Crucial para envio de arquivos
      },
    });

    return data;
  },

  // 🏪 Cadastro de Vendedor
  registerSeller: async (payload: RegisterSellerPayload) => {
    const { data } = await api.post("/sellers", payload);
    return data;
  },
};
