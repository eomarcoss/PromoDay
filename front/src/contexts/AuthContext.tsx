"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { api } from "@/lib/api"; // Instância do Axios com `withCredentials: true`
import { signOutAction } from "@/app/actions/auth"; // Sua Server Action de logout

interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "SELLER";
  avatarUrl?: string;
  phone?: string;
  imageUrl?: string;
  businessHours?: string;
  address?: string;
  category?: string;
  totalPromotions?: number;
  totalSales?: number;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Busca o usuário logado na API usando o cookie httpOnly enviado automaticamente
  useEffect(() => {
    async function loadUser() {
      try {
        const { data } = await api.get("/seller/profile"); // ou a sua rota de perfil
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const logout = async () => {
    setUser(null);
    await signOutAction(); // Limpa os cookies @PromoDay:token e @PromoDay:role e redireciona
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prevUser) =>
      prevUser ? { ...prevUser, ...updatedFields } : null,
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        isAuthenticated: !!user,
        isLoading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
