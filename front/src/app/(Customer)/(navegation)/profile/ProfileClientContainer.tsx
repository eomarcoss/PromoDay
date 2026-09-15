"use client";

import { useState } from "react";
import { UserProfileCard } from "@/components/shared/UserProfileCard";
import { signOutAction } from "@/app/actions/auth";
import { updateProfileCustomerAction } from "@/app/actions/customerProfileAction";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export interface CustomerProfileData {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
}

interface ProfileClientContainerProps {
  initialUser: CustomerProfileData;
}

export function ProfileClientContainer({
  initialUser,
}: ProfileClientContainerProps) {
  const [user, setUser] = useState<CustomerProfileData>(initialUser);
  const { updateUser: updateContextUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // A função agora recebe o FormData diretamente vindo do UserProfileCard
  const handleUpdateProfile = async (formData: FormData) => {
    try {
      setIsUpdating(true);

      // Envia o FormData para a Server Action
      const response = await updateProfileCustomerAction(formData);

      if (response.success && response.data) {
        const updatedCustomer = response.data;

        // Sincroniza o estado local e o contexto global com os dados reais do banco
        setUser(updatedCustomer);
        updateContextUser(updatedCustomer);

        toast.success("Perfil atualizado com sucesso!");
      } else {
        toast.error(`Erro ao atualizar: ${response.error || "Tente novamente."}`);
      }
    } catch (error: any) {
      toast.error("Erro inesperado ao atualizar perfil.");
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
        onSaveProfile={handleUpdateProfile} // Passa o handler que aceita FormData
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
