import { z } from "zod";

// ==========================================
// VALIDAÇÕES DA ETAPA 1: Dados Principais
// ==========================================
export const stepOneSchema = z.object({
  name: z
    .string()
    .min(3, "O nome da empresa deve ter pelo menos 3 caracteres")
    .max(50, "Nome longo demais"),

  phone: z
    .string()
    .min(10, "Telefone incompleto. Insira o DDD + Número")
    .max(15, "Telefone longo demais")
    .regex(/^\d+$/, "O telefone deve conter apenas números"), // Garante apenas dígitos

  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Insira um formato de e-mail válido (ex: nome@empresa.com)"),

  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Za-z]/, "A senha deve conter pelo menos uma letra")
    .regex(/\d/, "A senha deve conter pelo menos um número"),
});

// ==========================================
// VALIDAÇÕES DA ETAPA 2: Dados Jurídicos
// ==========================================
export const stepTwoSchema = z.object({
  // avatar: z
  //   .any()
  //   .refine((file) => file instanceof File, "A foto de perfil é obrigatória")
  //   .refine(
  //     (file) => file?.size <= 5 * 1024 * 1024,
  //     "A imagem deve ter no máximo 5MB",
  //   )
  //   .refine(
  //     (file) =>
  //       ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
  //         file?.type,
  //       ),
  //     "Formato inválido. Use apenas JPG, JPEG, PNG ou WEBP",
  //   ),
  address: z
    .string()
    .min(5, "Por favor, insira o endereço completo da sua empresa"),
  category: z
    .string({ message: "Selecione uma categoria" })
    .min(1, "Selecione uma categoria para o seu negócio"),
  businessHours: z
    .record(
      z.string(),
      z.object({
        aberto: z.boolean(),
        // 🚀 Ajuste: Permite que venha vazio ou undefined caso o dia esteja fechado
        inicio: z.string().optional().or(z.literal("")),
        fim: z.string().optional().or(z.literal("")),
      }),
    )
    .refine(
      (hours) => {
        // Regra 1: A loja precisa abrir pelo menos um dia na semana
        const temDiaAberto = Object.values(hours).some((dia) => dia.aberto);
        return temDiaAberto;
      },
      {
        message: "Você precisa selecionar pelo menos um dia de funcionamento!",
      },
    )
    .refine(
      (hours) => {
        // Regra 2: Se o dia está aberto, a hora de término não pode ser menor ou igual à inicial
        for (const dia in hours) {
          if (hours[dia].aberto) {
            // Se por acaso vier undefined mesmo aberto, joga um fallback "00:00" para não quebrar o split
            const horaInicioStr = hours[dia].inicio || "00:00";
            const horaFimStr = hours[dia].fim || "00:00";

            const [horaInicio, minInicio] = horaInicioStr
              .split(":")
              .map(Number);
            const [horaFim, minFim] = horaFimStr.split(":").map(Number);

            const totalMinInicio = horaInicio * 60 + minInicio;
            const totalMinFim = horaFim * 60 + minFim;

            if (totalMinFim <= totalMinInicio) return false;
          }
        }
        return true;
      },
      {
        message: "O horário de término deve ser maior que o horário de início!",
      },
    ),
});

// ==========================================
// VALIDAÇÕES DA ETAPA 3: Dados Complementares
// ==========================================
export const stepThreeSchema = z.object({
  // Validamos o arquivo binário da imagem do avatar
  // Validamos a estrutura aninhada do Horário de Funcionamento semanal
});

// ==========================================
// SCHEMA UNIFICADO (Para tipagem se necessário)
// ==========================================
export const registerFormSchema = stepOneSchema
  .merge(stepTwoSchema)
  .merge(stepThreeSchema);

// Cria o tipo do TypeScript automaticamente baseado nas regras do Zod
export type RegisterFormData = z.infer<typeof registerFormSchema>;
