// "use server";

// import { api } from "@/services/api";
// import { cookies } from "next/headers";
// import { revalidatePath } from "next/cache";

// export interface UpdateSellerData {
//   name: string;
//   phone: string;
//   address: string;
//   businessHours: string;
//   category: string;
//   avatarUrl?: string;
// }

// export interface UpdateSellerResponse {
//   success: boolean;
//   data?: any;
//   error?: string;
// }

// export async function updateSellerAction(
//   formData: FormData, // 👈 Ajustado para receber o FormData
// ): Promise<UpdateSellerResponse> {
//   try {
//     const cookieStore = await cookies();

//     const token = cookieStore.get("@PromoDay:token")?.value;
//     const role = cookieStore.get("@PromoDay:role")?.value;

//     // Garante que existe um token e que o usuário possui perfil de SELLER
//     if (!token || role !== "SELLER") {
//       return {
//         success: false,
//         error: "Sessão expirada ou usuário não autorizado.",
//       };
//     }

//     console.log("Enviando isso para a rota patch:", formData);
//     // Ajuste o endpoint "/sellers/profile" caso o seu backend use outra rota (ex: /sellers ou /profile)
//     const response = await api.patch("/sellers/profile", formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data", // 👈 Crucial para envio de arquivos
//       },
//     });

//     revalidatePath("/seller/profile");
//     return {
//       success: true,
//       data: response.data,
//     };
//   } catch (error: any) {
//     console.error(
//       "Erro na Server Action updateSellerAction:",
//       error?.response?.data || error.message,
//     );

//     const errorMessage =
//       error?.response?.data?.message || "Falha ao atualizar dados do vendedor.";

//     return {
//       success: false,
//       error: errorMessage,
//     };
//   }
// }
