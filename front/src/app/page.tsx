import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona automaticamente a raiz para a tela de login/registro
  redirect("/register");
}