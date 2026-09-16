"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  stepOneSchemaClient,
  stepTwoSchemaClient,
} from "../../schemas/register-client-schema";
import { useRouter } from "next/navigation";
import { registerCustomerAction } from "@/app/actions/auth";
import { toast } from "sonner";
import { PatternFormat } from "react-number-format";

export function RegisterStepperFormClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // 1. Estado limpo focado puramente nos dados do Cliente comprador
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    avatarFile: null as File | null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // 2. Atualização dinâmica dos inputs simples
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFinalSubmit = async () => {
    setLoading(true);

    // 1. Criamos o objeto FormData nativo do navegador
    const data = new FormData();

    // 2. Anexamos os textos usando as chaves exatas que o seu NestJS espera no DTO
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("password", formData.password);

    // 3. Se o usuário escolheu uma foto, anexamos o arquivo bruto
    // Mude o primeiro parâmetro ("avatar") para o nome exato que o seu NestJS @UploadedFile('campo') espera!
    if (formData.avatarFile) {
      data.append("avatar", formData.avatarFile);
    }

    // 4. Envia o FormData para a Server Action
    const result = await registerCustomerAction(data);

    setLoading(false);

    if (result.success) {
      toast.success("Cadastro do cliente realizado com sucesso!");
      router.push("/login"); // 🔀 Redireciona o cliente para fazer o primeiro login
    } else {
      toast.error(result.error || "Erro ao efetuar o cadastro.");
    }
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();

    // --- VALIDAÇÃO DA ETAPA 1 (Dados principais) ---
    if (currentStep === 1) {
      const validacao = stepOneSchemaClient.safeParse(formData);

      if (!validacao.success) {
        const primeiroErro =
          validacao.error?.issues?.[0]?.message ||
          "Erro de validação nos dados principais";
        alert(primeiroErro);
        return; // Trava o avanço
      }

      setCurrentStep(2);
      return;
    }

    // // --- VALIDAÇÃO DA ETAPA 2 (Termos e Condições) ---
    if (currentStep === 2) {
      const validacao = stepTwoSchemaClient.safeParse(formData);

      if (!validacao.success) {
        const primeiroErro =
          validacao.error?.issues?.[0]?.message ||
          "Você precisa aceitar os termos para continuar.";
        alert(primeiroErro);
        return;
      }

      // Se passou da etapa 2, envia os dados pro banco
      handleFinalSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 text-center">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-black tracking-tight ">
          Seja bem vindo, cliente amigo!
        </h1>
        <p className="text-sm font-medium text-neutral-500">
          Preencha os dados para começar a resgatar ofertas:
        </p>

        {/* Stepper Simplificado de 2 Etapas */}
        <div className="relative flex items-center justify-between w-32 mx-auto py-4">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 z-0 rounded-full" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-black z-0 transition-all duration-300 rounded-full"
            style={{ width: `${((currentStep - 1) / 1) * 100}%` }}
          />
          <div
            className={`w-6 h-6 rounded-full z-10 transition-all duration-300 duration-300 border-4 ${currentStep >= 1
              ? "bg-black border-black"
              : "bg-neutral-200 border-neutral-200"
              }`}
          />
          <div
            className={`w-6 h-6 rounded-full z-10 transition-all duration-300 duration-300 border-4 ${currentStep === 2
              ? "bg-black border-black"
              : "bg-neutral-200 border-neutral-200"
              }`}
          />
        </div>
      </div>

      {/* Card do Formulário */}
      <Card className="bg-neutral-100 border border-neutral-200 rounded-[2rem] p-8 shadow-sm text-left">
        <CardContent className="p-0">
          <form onSubmit={nextStep} className="space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 text-center pb-2">
              {currentStep === 1 && "Passo 1: Identificação"}
              {currentStep === 2 && "Passo 2: Termos de Uso"}
            </h2>

            {/* ETAPA 1: Cadastro completo do Cliente */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* UPLOAD DA FOTO DE PERFIL */}
                <div className="flex flex-col items-center space-y-2 pb-2">
                  <label
                    htmlFor="avatar"
                    className="w-24 h-24 rounded-full bg-neutral-200 hover:bg-neutral-300 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center overflow-hidden border border-neutral-300 group relative"
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-black text-neutral-500 uppercase tracking-wider group-hover:text-black transition-all duration-300">
                        Adicionar
                      </span>
                    )}
                    <input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatarPreview(URL.createObjectURL(file));
                          setFormData((prev) => ({
                            ...prev,
                            avatarFile: file,
                          }));
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Foto de perfil
                  </span>
                </div>

                {/* CAMPO: Nome Completo */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-neutral-700 font-bold ml-1 text-sm"
                  >
                    Nome completo:
                  </Label>
                  <Input
                    id="name"
                    placeholder="Digite seu nome completo"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-full bg-neutral-200 border-none h-11 px-5 text-black focus-visible:ring-2 focus-visible:ring-black"
                  />
                </div>

                {/* CAMPO: Telefone */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-neutral-700 font-bold ml-1 text-sm"
                  >
                    Telefone:
                  </Label>
                  {/* Usando customInput={Input} para manter a estilização e o componente do Shadcn UI perfeitamente integrados com a máscara */}
                  <PatternFormat
                    customInput={Input}
                    id="phone"
                    name="phone"
                    format="(##) #####-####"
                    mask="_"
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={handleChange}
                    className="rounded-full bg-neutral-200 border-none h-11 px-5 text-black focus-visible:ring-2 focus-visible:ring-black"
                  />
                </div>

                {/* CAMPO: Email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-neutral-700 font-bold ml-1 text-sm"
                  >
                    Email:
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-full bg-neutral-200 border-none h-11 px-5 text-black focus-visible:ring-2 focus-visible:ring-black"
                  />
                </div>

                {/* CAMPO: Senha com Olhinho */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-neutral-700 font-bold ml-1 text-sm"
                  >
                    Senha:
                  </Label>
                  <div className="relative flex items-center">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="rounded-full bg-neutral-200 border-none h-11 pl-5 pr-12 text-black w-full focus-visible:ring-2 focus-visible:ring-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 p-1 text-neutral-500 hover:text-black transition-all duration-300 rounded-full focus:outline-none"
                    >
                      {showPassword ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 2: Termos e Condições */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200 py-6 text-center">
                <div className="max-w-md mx-auto space-y-3">
                  <h3 className="text-lg font-black uppercase tracking-tight">
                    Termos e Condições
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    [Texto legal, políticas de privacidade e regras de resgate
                    do PromoDay serão inseridos aqui futuramente...]
                  </p>
                </div>
              </div>
            )}

            {/* BARRA DE BOTÕES DE NAVEGAÇÃO */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200/50">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-sm font-bold text-neutral-500 hover:text-black hover:underline transition-all duration-300 ml-2"
                >
                  Voltar
                </button>
              ) : (
                <div />
              )}

              <Button
                type="submit"
                className="rounded-full bg-black hover:bg-neutral-900 text-white px-8 h-10 font-bold text-sm transition-all"
              >
                {currentStep === 2 ? "Finalizar" : "Continuar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
