"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInAction } from "@/app/actions/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoginCard() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signInAction({ email, password });

    setLoading(false);

    if (result.success && result.user) {
      setUser(result.user);

      // Redireciona conforme o papel do usuário
      if (result.user.role === "SELLER") {
        router.push("/seller/announce");
      } else {
        router.push("/promotions");
      }

      // Forces Next.js to re-evaluate auth middleware & server state with the new cookie
      router.refresh();
    } else {
      setError(result.error || "Falha ao tentar entrar.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 text-center">
      <h1 className="text-3xl font-black text-foreground tracking-tight">
        Entrar no Promoday
      </h1>

      <Card className="bg-neutral-100 border border-neutral-200 rounded-[2rem] p-8 shadow-sm text-left bg-">
        <CardContent className="p-0 space-y-5">
          <form onSubmit={handleLogin}>

            {/* Mensagem de Erro visual */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-xs font-bold rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-neutral-500 font-medium ml-1 text-xs uppercase tracking-wider">
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

            <div className="space-y-1.5 mt-4">
              <Label htmlFor="senha" className="text-neutral-500 font-medium ml-1 text-xs uppercase tracking-wider">
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

            <div className="flex flex-col gap-2 pt-6 items-center">
              <Button
                type="submit"
                disabled={loading}
                className="rounded-full bg-black hover:bg-neutral-800 cursor-pointer text-white w-32 h-9 font-bold text-sm transition-all"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

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