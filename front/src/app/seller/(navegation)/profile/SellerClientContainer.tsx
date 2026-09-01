"use client";

import { useState } from "react";
import { SellerProfileCard } from "@/components/shared/SellerProfileCard";
import { signOutAction } from "@/app/actions/auth";
import {
  updateProfileSellerAction,
  SellerProfileData,
} from "@/app/actions/sellerProfileActions";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

interface SellerClientContainerProps {
  initialUser: SellerProfileData;
}

export function SellerClientContainer({
  initialUser,
}: SellerClientContainerProps) {
  const [user, setUser] = useState<SellerProfileData>(initialUser);
  const { updateUser: updateContextUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Função para sincronizar atualizações vindas do SellerProfileCard
  const handleUpdateProfile = (updatedFields: Partial<SellerProfileData>) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
    updateContextUser(updatedFields);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <SellerProfileCard
        name={user.name || "Usuário"}
        email={user.email || "Email não informado"}
        phone={user.phone || "(00) 00000-0000"}
        avatarUrl={user.avatarUrl || "/images/default-avatar.png"}
        address={user.address || "Endereço não informado"}
        businessHours={user.businessHours || "Horário não informado"}
        category={user.category || "Categoria não informada"}
        // totalPromotions={user.totalPromotions || 0}
        // totalSales={user.totalSales || 0}
        onSaveProfile={handleUpdateProfile}
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
