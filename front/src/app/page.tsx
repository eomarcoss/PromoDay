import { redirect } from "next/navigation";

export default function RootPage() {
  // Redireciona a raiz para a página de login
  redirect("/auth/login");
}
