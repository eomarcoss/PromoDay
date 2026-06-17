// 🔑 Dados enviados no formulário de Login (idêntico para Customer e Seller)
export interface LoginPayload {
  email: string;
  password?: string; // Opcional no front dependendo do estado, mas obrigatório no envio
}

// 🔑 Resposta REAL do seu processo de Login/Autenticação
export interface AuthResponse {
  access_token: string; // 👈 Corrigido para snake_case como vem da API
  user: {
    id: string;
    name: string;
    email: string;
    role: "CUSTOMER" | "SELLER"; // 👈 Tipagem estrita baseada no enum do seu banco
  };
}
