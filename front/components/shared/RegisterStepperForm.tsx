"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export function RegisterStepperForm() {
  const [currentStep, setCurrentStep] = useState(1);

  // 1. Criamos um único estado para armazenar todos os dados do formulário
  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    email: "",
    password: "",
    // Deixei esses campos prontos para as suas próximas etapas:
  });

  const [showPassword, setShowPassword] = useState(false);

  // Estado extra para guardar o preview da imagem selecionada
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // 2. Função genérica para atualizar o estado quando o usuário digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value, // Atualiza dinamicamente o campo com base no id do input
    }));
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 text-center">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-black tracking-tight">
          Seja bem vindo, empreendedor(a)!
        </h1>
        <p className="text-sm font-bold text-neutral-800">
          Preencha os dados abaixo para continuar:
        </p>
      </div>

      {/* Stepper */}
      <div className="relative flex items-center justify-between w-48 mx-auto py-4">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 z-0 rounded-full" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-black z-0 transition-all duration-300 rounded-full"
          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
        />
        <div
          className={`w-6 h-6 rounded-full z-10 transition-colors duration-300 border-4 ${currentStep >= 1 ? "bg-neutral-800 border-neutral-800" : "bg-neutral-200 border-neutral-200"}`}
        />
        <div
          className={`w-6 h-6 rounded-full z-10 transition-colors duration-300 border-4 ${currentStep >= 2 ? "bg-neutral-500 border-neutral-500" : "bg-neutral-200 border-neutral-200"}`}
        />
        <div
          className={`w-6 h-6 rounded-full z-10 transition-colors duration-300 border-4 ${currentStep === 3 ? "bg-neutral-400 border-neutral-400" : "bg-neutral-200 border-neutral-200"}`}
        />
      </div>

      {/* Card do Formulário */}
      <Card className="bg-neutral-100 border border-neutral-200 rounded-[2rem] p-8 shadow-sm text-left">
        <CardContent className="p-0">
          <form onSubmit={nextStep} className="space-y-5">
            <h2 className="text-xl font-black text-black tracking-tight text-center pb-2">
              {currentStep === 1 && "Dados principais"}
              {currentStep === 2 && "Dados adicionais"}
              {currentStep === 3 && "Confirmação"}
            </h2>

            {/* ETAPA 1 */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="companyName"
                    className="text-neutral-700 font-bold ml-1 text-sm"
                  >
                    Nome da empresa:
                  </Label>
                  <Input
                    id="companyName"
                    required
                    value={formData.companyName} // 3. Vincula o valor ao estado
                    onChange={handleChange} // 4. Dispara a atualização ao digitar
                    className="rounded-full bg-neutral-200 border-none h-11 px-5 text-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-neutral-700 font-bold ml-1 text-sm"
                  >
                    Telefone:
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="rounded-full bg-neutral-200 border-none h-11 px-5 text-black"
                  />
                </div>
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
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-full bg-neutral-200 border-none h-11 px-5 text-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-neutral-700 font-bold ml-1 text-sm"
                  >
                    Senha:
                  </Label>

                  {/* Container relativo para segurar o botão absoluto dentro dele */}
                  <div className="relative flex items-center">
                    <Input
                      id="password"
                      // Se showPassword for true, vira "text" (visível), se não, continua "password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      // Adicionamos pr-12 para o texto digitado não ficar por baixo do olho
                      className="rounded-full bg-neutral-200 border-none h-11 pl-5 pr-12 text-black w-full focus-visible:ring-2 focus-visible:ring-black"
                    />

                    {/* Botão do Olhinho */}
                    <button
                      type="button" // OBRIGATÓRIO para não dar submit no formulário sem querer
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 p-1 text-neutral-500 hover:text-black transition-colors rounded-full focus:outline-none focus:ring-1 focus:ring-black"
                      aria-label={
                        showPassword ? "Esconder senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? (
                        // Ícone de Olho Aberto (Importe do lucide-react)
                        <Eye className="h-5 w-5" />
                      ) : (
                        // Ícone de Olho Fechado/Cortado (Importe do lucide-react)
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 2 */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Título da Etapa */}

                {/* SEÇÃO: FOTO DE PERFIL (Upload Customizado) */}
                <div className="flex flex-col items-center space-y-2 pb-2">
                  <label
                    htmlFor="avatar"
                    className="w-24 h-24 rounded-full bg-neutral-300 hover:bg-neutral-400 transition-colors cursor-pointer flex flex-col items-center justify-center text-center overflow-hidden border border-neutral-400 group relative"
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-neutral-600 group-hover:text-neutral-800 transition-colors">
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
                          // Aqui você guardaria o arquivo em um estado se fosse enviar como FormData
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs font-bold text-neutral-500">
                    Foto de perfil
                  </span>
                </div>

                {/* CAMPO: Endereço Detalhado */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="fullAddress"
                    className="text-neutral-700 font-bold ml-1 text-sm"
                  >
                    Endereço:
                  </Label>
                  <Input
                    id="fullAddress"
                    placeholder="Rua Exemplo, 123 - Apt 42"
                    required
                    value={formData.fullAddress}
                    onChange={handleChange}
                    className="rounded-full bg-neutral-200 border-none h-11 px-5 text-black focus-visible:ring-2 focus-visible:ring-black"
                  />
                </div>

                {/* CAMPO: Horário de Funcionamento */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="businessHours"
                    className="text-neutral-700 font-bold ml-1 text-sm"
                  >
                    Horario de funcionamento:
                  </Label>
                  <Input
                    id="businessHours"
                    placeholder="Seg a Sex das 08:00 às 18:00"
                    required
                    value={formData.businessHours}
                    onChange={handleChange}
                    className="rounded-full bg-neutral-200 border-none h-11 px-5 text-black focus-visible:ring-2 focus-visible:ring-black"
                  />
                </div>

                {/* CAMPO: Categoria (Usando select nativo estilizado no padrão pílula) */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="category"
                    className="text-neutral-700 font-bold ml-1 text-sm"
                  >
                    Categoria:
                  </Label>
                  <div className="relative">
                    <select
                      id="category"
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full rounded-full bg-neutral-200 border-none h-11 px-5 text-black text-sm appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black font-medium"
                    >
                      <option value="" disabled>
                        Selecione uma categoria...
                      </option>
                      <option value="alimentacao">
                        Alimentação / Restaurante
                      </option>
                      <option value="vestuario">Vestuário / Roupas</option>
                      <option value="servicos">Prestação de Serviços</option>
                      <option value="outros">Outros</option>
                    </select>
                    {/* Seta customizada do select para não quebrar o visual minimalista */}
                    <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-neutral-500">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/01/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 3 */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-center text-neutral-500 py-8">
                  Conteúdo da Etapa 3 (Confirmação / Finalização)
                </p>
              </div>
            )}

            {/* Botões de Navegação */}
            <div className="flex items-center justify-between pt-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-sm font-bold text-neutral-600 hover:text-black hover:underline transition-colors ml-2"
                >
                  Voltar
                </button>
              ) : (
                <div />
              )}

              <Button
                type="submit"
                className="rounded-full bg-black hover:bg-neutral-800 text-white px-8 h-9 font-bold text-sm transition-all"
              >
                {currentStep === 3 ? "Finalizar" : "Continuar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
