export const dynamic = 'force-dynamic';

import { getProfileCustomerAction } from "@/app/actions/customerProfileAction"; // Ou o caminho das suas actions
import { ProfileClientContainer } from "@/app/(Customer)/(navegation)/profile/ProfileClientContainer";
import { redirect } from "next/navigation";

export default async function Profile() {
  // 1. Busca os dados no servidor Node do Next.js antes de renderizar
  const initialUser = await getProfileCustomerAction();

  // 2. Se o cookie não existir ou for inválido, redireciona antes de montar a tela
  if (!initialUser) {
    redirect("/login");
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 space-y-6">

      {/* 3. Delega a interatividade, edições e logout para um Client Component wrapper */}
      <ProfileClientContainer initialUser={initialUser} />
    </div>
  );
}
