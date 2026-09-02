import { cookies } from "next/headers";
import { getRoleFromToken } from "@/utils/getRoleFromToken"; // 👈 Certifique-se de que o caminho do import está correto para o seu projeto
import { SearchBar } from "@/components/shared/SearchBar";
import { BottomNav } from "@/components/shared/BottomNav";

export default async function NavegationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Lê o cookie diretamente no servidor
  const cookieStore = await cookies();
  const token = cookieStore.get("@PromoDay:token")?.value;

  // 2. Extrai a role de dentro do token JWT de forma segura
  const userRole = getRoleFromToken(token);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 3. Passa a role real descoberta no servidor para a SearchBar */}
      <SearchBar userRole={userRole || undefined} />
      <main className="grow">{children}</main>
      <BottomNav />
    </div>
  );
}