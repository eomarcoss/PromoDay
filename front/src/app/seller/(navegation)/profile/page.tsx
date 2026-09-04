export const dynamic = 'force-dynamic';

import { getProfileSellerAction } from "@/app/actions/sellerProfileActions"; // Ou o caminho das suas actions
import { SellerClientContainer } from "./SellerClientContainer";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function SellerProfilePage() {
  // 1. Busca os dados do vendedor diretamente no servidor (Node.js/NestJS)
  const initialUser = await getProfileSellerAction();

  // 2. Redireciona para o login caso não esteja autenticado ou a session expire
  if (!initialUser) {
    redirect("/login");
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 space-y-6">
      <Suspense fallback={<div>Loading...</div>}>

        {/* 3. Renderiza o container de cliente passando os dados pré-carregados */}
        <SellerClientContainer initialUser={initialUser} />
      </Suspense>
    </div>
  );
}
