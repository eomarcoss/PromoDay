"use client";

import { UserProfileCard } from "@/components/shared/UserProfileCard";
import { signOutAction } from "@/app/actions/auth";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { SellerProfileCard } from "@/components/shared/SellerProfileCard";

export default function Profile() {
  // 1. Resgata os dados reais do usuário logado
  const { user } = useAuth();

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 space-y-6">
      <h1 className="text-2xl text-center font-bold text-black">Minha conta</h1>
      {/* 2. Passa as props dinâmicas (com fallback caso o dado demore a carregar ou seja opcional) */}
      {/* <UserProfileCard
        name={user?.name || "Usuário"}
        email={user?.email || "Email não informado"}
        phone={user?.phone || "(00) 00000-0000"}
        avatarUrl={user?.avatarUrl || "/images/default-avatar.png"}
      /> */}

      <SellerProfileCard
        name={user?.name || "Usuário"}
        email={user?.email || "Email não informado"}
        phone={user?.phone || "(00) 00000-0000"}
        avatarUrl={user?.avatarUrl || "/images/default-avatar.png"}
        address={user?.address || "Endereço não informado"}
        businessHours={user?.businessHours || "Horário não informado"}
        category={user?.category || "Categoria não informada"}
        totalPromotions={user?.totalPromotions || 0}
        totalSales={user?.totalSales || 0}
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
