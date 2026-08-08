"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { Upload, Clock, MapPin, Plus, Minus, Loader2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatBusinessHours } from "@/utils/formatHours";
import { createPromotionAction } from "@/app/actions/promotions";

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
  // Alterado para suporte a até 3 imagens
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [isUnlimitedUser, setIsUnlimitedUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { user } = useAuth();

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

  // Função para adicionar novas imagens
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const availableSlots = 3 - imageFiles.length;
    const newFiles = selectedFiles.slice(0, availableSlots);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Reseta o input para permitir selecionar o mesmo arquivo novamente se desejar
    e.target.value = "";
  };

  // Função para remover uma imagem específica
  const handleRemoveImage = (index: number) => {
    // Revoga a URL criada para evitar leak de memória
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(data: AdFormValues) {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const parseCurrency = (value: string) => {
        if (!value) return 0;
        return Number(value.replace(/\./g, "").replace(",", "."));
      };

      const formData = new FormData();

      // Envia todas as imagens anexadas no FormData
      imageFiles.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("name", data.productName);
      if (data.description) formData.append("description", data.description);
      if (data.requirements) formData.append("requirements", data.requirements);
      formData.append("stock", String(data.stock));
      formData.append(
        "limitPerUser",
        String(isUnlimitedUser ? 0 : data.userLimit),
      );
      formData.append("startTime", new Date(data.startDate).toISOString());
      formData.append("endTime", new Date(data.endDate).toISOString());
      formData.append(
        "originalPrice",
        String(parseCurrency(data.originalPrice)),
      );
      formData.append("promoPrice", String(parseCurrency(data.discountPrice)));

      const result = await createPromotionAction(formData);

      if (!result.success) {
        throw new Error(result.error);
      }
      setSuccessMessage("Promoção cadastrada com sucesso! 🎉");

      // Reseta os campos e libera a memória das URLs
      reset();
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImageFiles([]);
      setImagePreviews([]);
      setIsUnlimitedUser(false);
    } catch (err: any) {
      console.error("Erro ao cadastrar promoção:", err);
      setErrorMessage(err.message || "Ocorreu um erro ao criar a promoção.");
    } finally {
      setLoading(false);
    }
  }

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
          {errorMessage && (
            <div className="mb-6 p-4 text-sm font-medium text-red-700 bg-red-100 rounded-2xl border border-red-200">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 text-sm font-medium text-green-700 bg-green-100 rounded-2xl border border-green-200">
              {successMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            {/* COLUNA DA ESQUERDA: Uploads de Imagens e Dados da Loja */}
            <div className="md:col-span-5 flex flex-col space-y-6">
              {/* Seção de Gerenciamento de Imagens */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-black">
                    Imagens do produto
                  </span>
                  <span className="text-xs font-medium text-neutral-500">
                    {imageFiles.length}/3 selecionadas
                  </span>
                </div>

                {/* Grid para Exibição das Imagens Fixadas e do Botão de Upload */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Pré-visualização das Imagens Adicionadas */}
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square w-full bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 group"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-sm transition-colors"
                        title="Remover imagem"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Botão de Upload Visível se Houver Vagas (Menos de 3 Imagens) */}
                  {imageFiles.length < 3 && (
                    <label
                      className={`relative aspect-square w-full bg-neutral-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-neutral-800 text-neutral-400 group hover:border-neutral-500 transition-colors cursor-pointer p-2 ${
                        imageFiles.length === 0 ? "col-span-3 aspect-4/3" : ""
                      }`}
                    >
                      <Upload className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
                      <span className="text-xs font-medium text-center mt-2 group-hover:text-white transition-colors">
                        {imageFiles.length === 0
                          ? "Enviar imagens do produto"
                          : "Adicionar"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Informações Dinâmicas da Loja */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-3">
                  {user?.avatarUrl ? (
                    <img
                      src={user?.avatarUrl}
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
                      {formatBusinessHours(user?.businessHours) ||
                        "Horário não informado"}
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
                  {...register("productName", { required: "Nome obrigatório" })}
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
              </div>

              {/* Linha Dupla: Estoque e Limite por Usuário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

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
                    {...register("startDate", { required: true })}
                    className="rounded-full bg-neutral-100 border-none h-11 text-black focus-visible:ring-2 focus-visible:ring-black px-4"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-black font-bold text-base">
                    Fim da oferta
                  </label>
                  <Input
                    type="datetime-local"
                    {...register("endDate", { required: true })}
                    className="rounded-full bg-neutral-100 border-none h-11 text-black focus-visible:ring-2 focus-visible:ring-black px-4"
                  />
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
                      placeholder="35,00"
                      {...register("originalPrice", { required: true })}
                      className="rounded-full bg-neutral-100 border-none h-11 text-black focus-visible:ring-2 focus-visible:ring-black px-4"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-neutral-600 font-semibold text-sm">
                      Por:
                    </label>
                    <Input
                      placeholder="25,00"
                      {...register("discountPrice", { required: true })}
                      className="rounded-full bg-neutral-100 border-none h-11 text-black focus-visible:ring-2 focus-visible:ring-black px-4"
                    />
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
                    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
                    setImageFiles([]);
                    setImagePreviews([]);
                    setIsUnlimitedUser(false);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="rounded-full cursor-pointer h-12 border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-100 font-bold text-base transition-colors"
                >
                  Limpar
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-full cursor-pointer h-12 bg-neutral-900 hover:bg-black text-white font-bold text-base transition-colors border-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Anunciando...
                    </>
                  ) : (
                    "Anunciar"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
