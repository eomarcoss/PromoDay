"use client";

import { useState } from "react";
import { UserProfileCard } from "@/components/shared/UserProfileCard";
import { signOutAction } from "@/app/actions/auth";
import {
  updateProfileCustomerAction,
  CustomerProfileData,
} from "@/app/actions/customerProfileAction";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

interface ProfileClientContainerProps {
  initialUser: CustomerProfileData;
}

export function ProfileClientContainer({
  initialUser,
}: ProfileClientContainerProps) {
  const [user, setUser] = useState<CustomerProfileData>(initialUser);
  const { updateUser: updateContextUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Função para salvar edições feitas no UserProfileCard
  const handleUpdateProfile = async (
    updatedFields: Partial<CustomerProfileData>,
  ) => {
    try {
      setIsUpdating(true);

      // Envia as alterações via Server Action para a API NestJS
      const updatedUser = await updateProfileCustomerAction(updatedFields);

      // Sincroniza o estado local e o contexto global
      setUser(updatedUser);
      updateContextUser(updatedUser);

      alert("Perfil atualizado com sucesso!");
    } catch (error: any) {
      alert(error.message || "Erro ao atualizar perfil.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <UserProfileCard
        name={user.name || "Usuário"}
        email={user.email || "Email não informado"}
        phone={user.phone || "(00) 00000-0000"}
        avatarUrl={user.avatarUrl || "/images/default-avatar.png"}
        onSaveProfile={handleUpdateProfile} // Passa a função async aqui
        isSubmitting={isUpdating}
      />

      <button
        type="button"
        onClick={async () => {
          await signOutAction();
        }}
        className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 font-semibold px-4 py-2.5 rounded-xl border border-red-500/20 transition-colors cursor-pointer text-sm"
      >
        <LogOut className="w-4 h-4" />
        <span>Sair da conta</span>
      </button>
    </div>
  );
}
