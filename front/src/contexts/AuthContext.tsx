"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { signOutAction } from "@/app/actions/auth";

export interface User {
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
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null; // Permite inicializar vindo do Server Component
}

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  // Inicializa o estado com o usuário vindo do servidor, se houver
  const [user, setUser] = useState<User | null>(initialUser);

  const logout = async () => {
    setUser(null);
    await signOutAction(); // Executa a Server Action de logout
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
