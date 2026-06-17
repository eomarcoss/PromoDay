// 👤 Estrutura completa do Cliente que vem do banco
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Payload de registro baseado no seu CreateCostomerDto
export interface RegisterCustomerPayload extends Omit<
  Customer,
  "id" | "createdAt" | "updatedAt"
> {
  password?: string;
}
