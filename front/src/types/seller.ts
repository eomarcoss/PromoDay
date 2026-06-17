// 🕒 Interface auxiliar para tipar o array de horários de funcionamento
export interface BusinessHour {
  dayOfWeek: string; // ex: "Segunda-feira", "Tuesday" ou 0 a 6
  openTime: string; // ex: "18:00"
  closeTime: string; // ex: "23:00"
}

// 🏪 Estrutura completa do Seller que vem do Banco/API
export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  address: string;
  businessHours: BusinessHour[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

// 📝 Payload de Registro do Vendedor (Espelhando o CreateSellerDto)
export interface RegisterSellerPayload extends Omit<
  Seller,
  "id" | "createdAt" | "updatedAt"
> {
  password?: string;
}
