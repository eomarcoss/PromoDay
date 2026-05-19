import { Card } from "@/components/ui/card";

export function UserTypeSelector() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 text-center flex flex-col items-center justify-center">
      {/* Título Principal */}
      <h1 className="text-4xl font-black text-black tracking-tight">Você é</h1>

      {/* Grid de Escolha */}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
        {/* Opção Cliente */}
        <Card className="w-full sm:w-64 h-36 bg-neutral-100 hover:bg-black hover:text-white border border-neutral-200 hover:border-black rounded-[2rem] flex items-center justify-center cursor-pointer transition-all duration-200 group shadow-sm active:scale-95">
          <span className="text-xl font-black text-neutral-900 group-hover:text-white tracking-tight">
            Cliente
          </span>
        </Card>

        {/* Texto Intermediário "ou" */}
        <span className="text-lg font-bold text-neutral-800 px-2">ou</span>

        {/* Opção Vendedor(a) */}
        <Card className="w-full sm:w-64 h-36 bg-neutral-100 hover:bg-black hover:text-white border border-neutral-200 hover:border-black rounded-[2rem] flex items-center justify-center cursor-pointer transition-all duration-200 group shadow-sm active:scale-95">
          <span className="text-xl font-black text-neutral-900 group-hover:text-white tracking-tight">
            Vendedor(a)
          </span>
        </Card>
      </div>
    </div>
  );
}
