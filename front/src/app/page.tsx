import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona a raiz para a página de login
  return (
    <h1>Home</h1>
  )
  // redirect("/auth/login");
}
