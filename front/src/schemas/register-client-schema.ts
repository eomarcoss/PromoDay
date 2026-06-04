import { z } from "zod";

// ==========================================
// VALIDAÇÕES DA ETAPA 1: Identificação e Foto
// ==========================================
export const stepOneSchemaClient = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(50, "Nome longo demais"),

  phone: z
    .string()
    .min(10, "Telefone incompleto. Insira o DDD + Número")
    .max(15, "Telefone longo demais"),
  // Removi o regex antigo de "apenas números" caso você use máscaras como (11) 99999-9999 no front.
  // Se quiser apenas números puros salvos, mantenha o .regex(/^\d+$/, "Apenas números")

  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Insira um formato de e-mail válido (ex: seu@email.com)"),

  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Za-z]/, "A senha deve conter pelo menos uma letra")
    .regex(/\d/, "A senha deve conter pelo menos um número"),

  // Descomente as linhas abaixo se quiser validar o arquivo da foto no passo 1:
  avatarFile: z.any().optional(),
  /* .refine((file) => !file || file instanceof File, "Formato de arquivo inválido")
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "A imagem deve ter no máximo 5MB"
    )
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Use apenas JPG, JPEG, PNG ou WEBP"
    )
    */
});

// ==========================================
// VALIDAÇÕES DA ETAPA 2: Termos de Uso
// ==========================================
export const stepTwoSchemaClient = z.object({
  // Garante que o usuário precise preencher a etapa (pode ser expandido para aceitar um checkbox futuramente)
  // Deixei flexível para o seu objeto formData atual
});

// ==========================================
// SCHEMA UNIFICADO (Para tipagem do Cliente)
// ==========================================
export const registerFormSchemaClient =
  stepOneSchemaClient.merge(stepTwoSchemaClient);

// Cria a tipagem do TypeScript automaticamente baseada no Cliente
export type RegisterFormData = z.infer<typeof registerFormSchemaClient>;
