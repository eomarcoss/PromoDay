"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { Upload, Clock, MapPin, Plus, Minus, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AdFormValues {
  productName: string;
  description?: string;
  requirements?: string;
  stock: string;
  userLimit: string;
  startDate: string;
  endDate: string;
  originalPrice: string;
  discountPrice: string;
}

export function CreateAdForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUnlimitedUser, setIsUnlimitedUser] = useState(false);

  // 2. EXTRAIA O USUÁRIO/LOJA DO SEU CONTEXTO:
  // Substiua `useAuth()` pelo hook real que você utiliza na aplicação
  const { user } = useAuth();

  // Objeto de demonstração (Remova e use o do seu contexto acima):
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm<AdFormValues>({
    defaultValues: {
      productName: "",
      description: "",
      requirements: "",
      stock: "1",
      userLimit: "1",
      startDate: "",
      endDate: "",
      originalPrice: "",
      discountPrice: "",
    },
  });

  function onSubmit(data: AdFormValues) {
    console.log("Dados prontos para envio:", data);
  }

  // Função auxiliar para gerar as iniciais caso não exista imagem cadastrada
  const getInitials = (name?: string) => {
    if (!name) return "LJ";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-neutral-100 min-h-screen p-4 md:p-8 flex justify-center items-center">
      <Card className="w-full max-w-5xl bg-white border border-neutral-200 rounded-[32px] shadow-sm overflow-hidden">
        <CardContent className="p-6 md:p-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            {/* COLUNA DA ESQUERDA: Imagem e Dados da Loja */}
            <div className="md:col-span-5 flex flex-col space-y-6">
              {/* Área de Upload de Imagem */}
              <div className="relative aspect-4/3 w-full bg-neutral-900 rounded-[24px] overflow-hidden flex flex-col items-center justify-center border border-neutral-800 text-neutral-400 group hover:border-neutral-500 transition-colors">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4 space-y-3">
                    <Upload className="w-8 h-8 text-neutral-400 group-hover:text-white transition-colors" />
                    <span className="text-base font-medium group-hover:text-white transition-colors">
                      Enviar imagem do produto
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setImagePreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Informações Dinâmicas da Loja (Contexto) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-3">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.name || "Loja"}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(user?.name)}
                    </div>
                  )}
                  <span className="text-xl font-bold text-black truncate">
                    {user?.name || "Nome da Loja"}
                  </span>
                </div>

                <div className="space-y-2 text-neutral-600 text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>
                      {user?.businessHours || "Horário não informado"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="truncate">
                      {user?.address || "Endereço não informado"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUNA DA DIREITA: Campos do Formulário */}
            <div className="md:col-span-7 flex flex-col space-y-5">
              {/* Campo: Produto */}
              <div className="flex flex-col space-y-2">
                <label className="text-black font-bold text-base">
                  Produto:
                </label>
                <Input
                  placeholder="Nome do produto"
                  {...register("productName")}
                  className="rounded-full bg-neutral-100 border-none h-11 text-black focus-visible:ring-2 focus-visible:ring-black pl-4"
                />
                {errors.productName && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.productName.message}
                  </p>
                )}
              </div>

              {/* Campo: Descrição */}
              <div className="flex flex-col space-y-2">
                <label className="text-black font-bold text-base">
                  Descrição (Opcional)
                </label>
                <Textarea
                  placeholder="Detalhes do item..."
                  {...register("description")}
                  className="rounded-2xl bg-neutral-100 border-none min-h-[80px] text-black focus-visible:ring-2 focus-visible:ring-black p-4 resize-none"
                />
                {errors.description && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Campo: Requisitos */}
              <div className="flex flex-col space-y-2">
                <label className="text-black font-bold text-base">
                  Requisitos (Opcional)
                </label>
                <Textarea
                  placeholder="Ex: Válido apenas para novos clientes..."
                  {...register("requirements")}
                  className="rounded-2xl bg-neutral-100 border-none min-h-[80px] text-black focus-visible:ring-2 focus-visible:ring-black p-4 resize-none"
                />
                {errors.requirements && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.requirements.message}
                  </p>
                )}
              </div>

              {/* Linha Dupla: Estoque e Limite por Usuário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CAMPO: ESTOQUE */}
                <div className="flex flex-col space-y-2">
                  <label className="text-black font-bold text-base">
                    Estoque total disponível:
                  </label>
                  <Controller
                    control={control}
                    name="stock"
                    render={({ field }) => (
                      <div className="flex items-center h-11 w-full bg-neutral-100 rounded-full overflow-hidden px-2 border-none">
                        <button
                          type="button"
                          onClick={() => {
                            const current = Number(field.value) || 1;
                            field.onChange(String(Math.max(1, current - 1)));
                          }}
                          className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-200 rounded-full transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <input
                          type="number"
                          className="flex-1 text-center bg-transparent border-none text-black font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={field.value}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            field.onChange(isNaN(val) ? "" : String(val));
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const current = Number(field.value) || 0;
                            field.onChange(String(current + 1));
                          }}
                          className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-200 rounded-full transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  />
                  {errors.stock && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.stock.message}
                    </p>
                  )}
                </div>

                {/* CAMPO: LIMITE POR USUÁRIO */}
                <div className="flex flex-col space-y-2">
                  <label className="text-black font-bold text-base">
                    Limite por usuário:
                  </label>
                  <Controller
                    control={control}
                    name="userLimit"
                    render={({ field }) => (
                      <div className="flex flex-col space-y-2">
                        <div
                          className={`flex items-center h-11 w-full bg-neutral-100 rounded-full overflow-hidden px-2 border-none transition-opacity ${
                            isUnlimitedUser
                              ? "opacity-40 pointer-events-none"
                              : ""
                          }`}
                        >
                          <button
                            type="button"
                            disabled={isUnlimitedUser}
                            onClick={() => {
                              const current = Number(field.value) || 1;
                              field.onChange(String(Math.max(1, current - 1)));
                            }}
                            className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-200 rounded-full transition-colors disabled:pointer-events-none"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <input
                            type="number"
                            disabled={isUnlimitedUser}
                            className="flex-1 text-center bg-transparent border-none text-black font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={isUnlimitedUser ? "" : field.value}
                            placeholder={isUnlimitedUser ? "∞" : "1"}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              field.onChange(isNaN(val) ? "" : String(val));
                            }}
                          />

                          <button
                            type="button"
                            disabled={isUnlimitedUser}
                            onClick={() => {
                              const current = Number(field.value) || 0;
                              field.onChange(String(current + 1));
                            }}
                            className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-200 rounded-full transition-colors disabled:pointer-events-none"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <label className="flex items-center space-x-2 cursor-pointer select-none pl-2">
                          <input
                            type="checkbox"
                            checked={isUnlimitedUser}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setIsUnlimitedUser(checked);
                              if (checked) {
                                setValue("userLimit", "0");
                              } else {
                                setValue("userLimit", "1");
                              }
                            }}
                            className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 accent-black"
                          />
                          <span className="text-sm font-medium text-neutral-600">
                            Permitir compras sem limite por cliente
                          </span>
                        </label>
                      </div>
                    )}
                  />
                  {errors.userLimit && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.userLimit.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Linha Dupla: Datas de Início e Fim */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-black font-bold text-base">
                    Início da oferta
                  </label>
                  <Input
                    type="datetime-local"
                    {...register("startDate")}
                    className="rounded-full bg-neutral-100 border-none h-11 text-black focus-visible:ring-2 focus-visible:ring-black px-4"
                  />
                  {errors.startDate && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-black font-bold text-base">
                    Fim da oferta
                  </label>
                  <Input
                    type="datetime-local"
                    {...register("endDate")}
                    className="rounded-full bg-neutral-100 border-none h-11 text-black focus-visible:ring-2 focus-visible:ring-black px-4"
                  />
                  {errors.endDate && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Seção de Preços (Oferta) */}
              <div className="space-y-2">
                <span className="text-black font-bold text-lg block">
                  Oferta
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-neutral-600 font-semibold text-sm">
                      De:
                    </label>
                    <Input
                      placeholder="R$ 0,00"
                      {...register("originalPrice")}
                      className="rounded-full bg-neutral-100 border-none h-11 text-black focus-visible:ring-2 focus-visible:ring-black px-4"
                    />
                    {errors.originalPrice && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.originalPrice.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-neutral-600 font-semibold text-sm">
                      Por:
                    </label>
                    <Input
                      placeholder="R$ 0,00"
                      {...register("discountPrice")}
                      className="rounded-full bg-neutral-100 border-none h-11 text-black focus-visible:ring-2 focus-visible:ring-black px-4"
                    />
                    {errors.discountPrice && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.discountPrice.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Botões de Ação Inferiores */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setImagePreview(null);
                  }}
                  className="rounded-full cursor-pointer h-12 border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-100 font-bold text-base transition-colors"
                >
                  Limpar
                </Button>

                <Button
                  type="submit"
                  className="rounded-full cursor-pointer h-12 bg-neutral-900 hover:bg-black text-white font-bold text-base transition-colors border-none"
                >
                  Anunciar
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
