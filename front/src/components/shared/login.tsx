"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInAction } from "@/app/actions/auth"; // 👈 Importa a Action que acabamos de ajustar
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoginCard() {
  const router = useRouter();
  const { setUser } = useAuth(); // Função do contexto para atualizar o usuário globalmente

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 🚀 Chama a Server Action passando as credenciais puras (aqui usamos JSON normal)
    const result = await signInAction({ email, password });

    setLoading(false);
    console.log("Resultado da Action:", result.user);
    if (result.success && result.user) {
      // 1. Salva o usuário no Contexto para o Front-end renderizar o nome/foto dele na tela
      setUser(result.user);

      // 2. Redirecionamento inteligente baseado no Role que veio do seu NestJS
      if (result.user.role === "SELLER") {
        router.push("/seller/announce");
      } else {
        router.push("/promotions");
      }
    } else {
      // Exibe na tela o erro exato retornado pelo NestJS
      setError(result.error || "Falha ao tentar entrar.");
    }
  };
  return (
    <div className="w-full max-w-md mx-auto space-y-6 text-center">
      {/* Título */}
      <h1 className="text-3xl font-black text-black tracking-tight">
        Entrar no Promoday
      </h1>

      {/* Card Principal */}
      <Card className="bg-neutral-100 border border-neutral-200 rounded-[2rem] p-8 shadow-sm text-left">
        <CardContent className="p-0 space-y-5">
          {/* Campo Email */}
          <form onSubmit={handleLogin} method="POST">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-neutral-500 font-medium ml-1 text-xs uppercase tracking-wider"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="rounded-full bg-neutral-200 border-none h-11 px-5 text-black focus-visible:ring-2 focus-visible:ring-black"
              />
            </div>

            {/* Campo Senha */}
            <div className="space-y-1.5">
              <Label
                htmlFor="senha"
                className="text-neutral-500 font-medium ml-1 text-xs uppercase tracking-wider mt-4"
              >
                Senha
              </Label>
              <Input
                id="senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="rounded-full bg-neutral-200 border-none h-11 px-5 text-black focus-visible:ring-2 focus-visible:ring-black"
              />
            </div>

            {/* Ações de Entrada */}
            <div className="flex flex-col gap-2 pt-2 items-center">
              <Button
                type="submit"
                disabled={loading}
                className="rounded-full bg-black hover:bg-neutral-800 cursor-pointer text-white w-32 h-9 font-bold text-sm transition-all"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
              <Button
                variant="link"
                className="text-black font-bold text-xs hover:underline p-0 h-auto cursor-pointer"
              >
                Entrar como convidado
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Rodapé: Criar Conta */}
      <div className="space-y-2 pt-2">
        <p className="text-sm font-medium text-neutral-600">Não tem conta?</p>
        <Link href="/register">
          <Button
            variant="outline"
            className="rounded-full border-black bg-transparent cursor-pointer text-black hover:bg-black hover:text-white px-6 h-9 font-bold text-sm transition-all"
          >
            Criar conta
          </Button>
        </Link>
      </div>
    </div>
  );
}
