"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// 1. Defina a estrutura do Usuário com base no que o seu NestJS retorna
interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "SELLER";
  avatarUrl?: string;
}

// 2. Defina o formato dos dados que o Contexto vai compartilhar com o app
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Recupera o usuário do localStorage ao carregar a página (apenas no Front-end)
  useEffect(() => {
    const storedUser = localStorage.getItem("@PromoDay:user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("@PromoDay:user");
      }
    }
  }, []);

  // Função customizada para salvar o usuário tanto no estado quanto no localStorage
  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("@PromoDay:user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("@PromoDay:user");
    }
  };

  const logout = () => {
    handleSetUser(null);
    // Aqui no futuro você pode chamar uma Action para limpar o Cookie httpOnly também
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: handleSetUser,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para facilitar o uso do contexto nas páginas
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado de dentro de um AuthProvider");
  }
  return context;
}
