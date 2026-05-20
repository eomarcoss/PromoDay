import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginCard() {
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
          <form action="/login" method="POST">
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
                className="rounded-full bg-neutral-200 border-none h-11 px-5 text-black focus-visible:ring-2 focus-visible:ring-black"
              />
            </div>

            {/* Ações de Entrada */}
            <div className="flex flex-col gap-2 pt-2 items-center">
              <Button className="rounded-full bg-black hover:bg-neutral-800 cursor-pointer text-white w-32 h-9 font-bold text-sm transition-all">
                Entrar
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
        <Button
          variant="outline"
          className="rounded-full border-black bg-transparent cursor-pointer text-black hover:bg-black hover:text-white px-6 h-9 font-bold text-sm transition-all"
        >
          Criar conta
        </Button>
      </div>
    </div>
  );
}
