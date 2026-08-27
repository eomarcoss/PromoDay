"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pencil,
  Store,
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Clock,
  Tag,
  Camera,
  X,
  Check,
  Building2,
  Loader2,
} from "lucide-react";
import { formatBusinessHours } from "@/utils/formatHours";
import { updateProfileSellerAction } from "@/app/actions/sellerProfileActions";
import { useAuth } from "@/contexts/AuthContext";
import { useSellerMetrics } from "@/hooks/useSellerMetrics";

export type DayKey =
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado"
  | "domingo";

export interface DaySchedule {
  aberto: boolean;
  inicio: string;
  fim: string;
}

export type BusinessHoursState = Record<DayKey, DaySchedule>;

const DAY_LABELS: Record<DayKey, string> = {
  segunda: "Segunda",
  terca: "Terça",
  quarta: "Quarta",
  quinta: "Quinta",
  sexta: "Sexta",
  sabado: "Sábado",
  domingo: "Domingo",
};

const DEFAULT_HOURS: BusinessHoursState = {
  segunda: { aberto: true, inicio: "08:00", fim: "18:00" },
  terca: { aberto: true, inicio: "08:00", fim: "18:00" },
  quarta: { aberto: true, inicio: "08:00", fim: "18:00" },
  quinta: { aberto: true, inicio: "08:00", fim: "18:00" },
  sexta: { aberto: true, inicio: "08:00", fim: "18:00" },
  sabado: { aberto: false, inicio: "09:00", fim: "13:00" },
  domingo: { aberto: false, inicio: "00:00", fim: "00:00" },
};

function parseBusinessHours(
  hoursInput: string | object | null | undefined,
): BusinessHoursState {
  if (!hoursInput) return DEFAULT_HOURS;

  let parsed = hoursInput;

  if (typeof hoursInput === "string") {
    try {
      parsed = JSON.parse(hoursInput);
    } catch {
      return DEFAULT_HOURS;
    }
  }

  if (typeof parsed === "object" && parsed !== null) {
    const merged = { ...DEFAULT_HOURS };

    Object.keys(parsed).forEach((key) => {
      const lowerKey = key.toLowerCase() as DayKey;
      if (lowerKey in merged) {
        merged[lowerKey] = {
          ...merged[lowerKey],
          ...(parsed as Record<string, Partial<DaySchedule>>)[key],
        };
      }
    });

    return merged;
  }

  return DEFAULT_HOURS;
}

interface SellerProfileCardProps {
  avatarUrl?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  businessHours: string;
  category: string;
  onSaveProfile?: (formData: FormData) => void;
}

export function SellerProfileCard({
  avatarUrl: initialAvatar,
  name: initialName,
  email,
  phone: initialPhone,
  address: initialAddress,
  businessHours: initialBusinessHours,
  category: initialCategory,
  onSaveProfile,
}: SellerProfileCardProps) {
  const { updateUser } = useAuth();

  const [sellerData, setSellerData] = useState({
    name: initialName || "Seller sem nome",
    phone: initialPhone || "Não informado",
    address: initialAddress || "Endereço não informado",
    businessHours: initialBusinessHours || "",
    category: initialCategory || "Geral",
    avatarUrl: initialAvatar,
  });

  useEffect(() => {
    setSellerData({
      name: initialName || "Seller sem nome",
      phone: initialPhone || "Não informado",
      address: initialAddress || "Endereço não informado",
      businessHours: initialBusinessHours || "",
      category: initialCategory || "Geral",
      avatarUrl: initialAvatar,
    });
  }, [
    initialName,
    initialPhone,
    initialAddress,
    initialBusinessHours,
    initialCategory,
    initialAvatar,
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para o formulário
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editForm, setEditForm] = useState({
    name: sellerData.name,
    phone: sellerData.phone,
    address: sellerData.address,
    category: sellerData.category,
    avatarUrl: sellerData.avatarUrl,
    businessHours: parseBusinessHours(sellerData.businessHours),
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isEditing && !isSubmitting) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, isSubmitting]);

  const handleOpenEdit = () => {
    setSelectedFile(null); // Reseta o arquivo selecionado ao abrir
    setEditForm({
      name: sellerData.name,
      phone: sellerData.phone,
      address: sellerData.address,
      category: sellerData.category,
      avatarUrl: sellerData.avatarUrl,
      businessHours: parseBusinessHours(sellerData.businessHours),
    });
    setIsEditing(true);
  };

  const handleHoursChange = (
    dia: DayKey,
    campo: "aberto" | "inicio" | "fim",
    valor: boolean | string,
  ) => {
    setEditForm((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [dia]: {
          ...prev.businessHours[dia],
          [campo]: valor,
        },
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Guarda o arquivo binário real para o FormData
      const previewUrl = URL.createObjectURL(file); // Usa a URL temporária apenas para a prévia visual
      setEditForm((prev) => ({ ...prev, avatarUrl: previewUrl }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const jsonBusinessHours = JSON.stringify(editForm.businessHours);

    // Monta o FormData multipart para enviar arquivo e textos de forma limpa
    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("phone", editForm.phone);
    formData.append("address", editForm.address);
    formData.append("category", editForm.category);
    formData.append("businessHours", jsonBusinessHours);

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      // Envia o FormData para a Server Action / Controller
      const response = await updateProfileSellerAction(formData);

      if (response.success) {
        const newAvatarUrl = response.data?.avatarUrl || editForm.avatarUrl;

        const updatedData = {
          name: editForm.name,
          phone: editForm.phone,
          address: editForm.address,
          category: editForm.category,
          avatarUrl: newAvatarUrl,
          businessHours: jsonBusinessHours,
        };

        setSellerData(updatedData);
        setIsEditing(false);

        updateUser({
          name: updatedData.name,
          phone: updatedData.phone,
          address: updatedData.address,
          businessHours: updatedData.businessHours,
          category: updatedData.category,
          avatarUrl: updatedData.avatarUrl,
        });

        if (onSaveProfile) {
          onSaveProfile(updatedData);
        }
      } else {
        alert(
          `Erro ao salvar: ${response.error?.message || response.error || "Não foi possível atualizar."}`,
        );
      }
    } catch (error) {
      alert("Ocorreu um erro inesperado ao salvar os dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { metrics, isLoading, isError } = useSellerMetrics();

  return (
    <>
      <Card className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-3xl shadow-lg shadow-slate-950/5 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1 min-w-0">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                {sellerData.avatarUrl ? (
                  <img
                    src={sellerData.avatarUrl}
                    alt={sellerData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-extrabold text-2xl uppercase select-none">
                    {sellerData.name.substring(0, 2)}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-bold text-slate-950 truncate tracking-tight">
                    {sellerData.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-100 shrink-0 capitalize">
                    <Tag className="w-3 h-3" />
                    {sellerData.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-600 font-medium">
                  <div className="flex items-center justify-center sm:justify-start gap-2 min-w-0">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{email}</span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 min-w-0">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sellerData.phone}</span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 min-w-0 sm:col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sellerData.address}</span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 min-w-0 sm:col-span-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {formatBusinessHours(sellerData.businessHours)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden xl:block w-[1px] h-20 bg-slate-100 shrink-0" />

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-4 xl:pt-0 border-t xl:border-t-0 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="min-w-[120px] bg-slate-50 border border-slate-200/70 rounded-2xl p-3 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">
                      Anúncios
                    </span>
                    <span className="text-base font-black text-slate-950 mt-1 leading-none">
                      {isLoading ? (
                        <span className="animate-pulse text-gray-400">...</span>
                      ) : isError ? (
                        <span className="text-red-500 text-sm">Erro</span>
                      ) : (
                        (metrics?.totalPromotions ?? 0)
                      )}
                    </span>
                  </div>
                </div>

                <div className="min-w-[120px] bg-emerald-50/60 border border-emerald-100/80 rounded-2xl p-3 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100/70 text-emerald-600 shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider leading-none">
                      Vendas
                    </span>
                    <span className="text-base font-black text-emerald-950 mt-1 leading-none">
                      {isLoading ? (
                        <span className="animate-pulse text-gray-400">...</span>
                      ) : isError ? (
                        <span className="text-red-500 text-sm">Erro</span>
                      ) : (
                        (metrics?.totalSales ?? 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenEdit}
                className="h-11 px-4 bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-950 rounded-2xl transition-all border border-slate-200/80 flex items-center justify-center gap-2 text-xs font-bold shrink-0 cursor-pointer"
                title="Editar Perfil"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODAL DE EDIÇÃO */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => !isSubmitting && setIsEditing(false)}
        >
          <div
            className="bg-white border border-slate-100 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-950">
                Editar Dados do Estabelecimento
              </h3>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-all disabled:opacity-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex flex-col items-center justify-center mb-2">
                <div className="relative group cursor-pointer">
                  <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-slate-200 shadow-sm">
                    {editForm.avatarUrl ? (
                      <img
                        src={editForm.avatarUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-xl uppercase">
                        {editForm.name.substring(0, 2)}
                      </span>
                    )}
                  </div>
                  <label className="absolute inset-0 bg-slate-950/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6" />
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isSubmitting}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-xs text-slate-500 mt-2">
                  Clique para alterar a logo
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome da Loja
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl py-2 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition-all disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <div className="relative">
                    <select
                      disabled={isSubmitting}
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl py-2 px-3 text-sm font-medium text-slate-900 outline-none transition-all disabled:opacity-60 capitalize cursor-pointer"
                      required
                    >
                      <option value="" disabled>
                        Selecione...
                      </option>
                      <option value="alimentacao">
                        Alimentação / Restaurante
                      </option>
                      <option value="vestuario">Vestuário / Roupas</option>
                      <option value="servicos">Prestação de Serviços</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      disabled={isSubmitting}
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl py-2 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition-all disabled:opacity-60"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Endereço
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl py-2 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition-all disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              {/* HORÁRIOS */}
              <div className="space-y-3 bg-neutral-50 p-4 rounded-3xl border border-neutral-200">
                <label className="text-neutral-700 font-black ml-1 text-sm block border-b border-neutral-200 pb-2">
                  Horários de Funcionamento:
                </label>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {(Object.keys(editForm.businessHours) as DayKey[]).map(
                    (dia) => {
                      const infoDia = editForm.businessHours[dia];
                      return (
                        <div
                          key={dia}
                          className="flex items-center justify-between text-sm py-1 border-b border-neutral-100 last:border-none"
                        >
                          <div className="flex items-center space-x-3 w-28">
                            <input
                              type="checkbox"
                              id={`check-${dia}`}
                              disabled={isSubmitting}
                              checked={infoDia.aberto}
                              onChange={(e) =>
                                handleHoursChange(
                                  dia,
                                  "aberto",
                                  e.target.checked,
                                )
                              }
                              className="w-4 h-4 accent-black cursor-pointer"
                            />
                            <label
                              htmlFor={`check-${dia}`}
                              className="capitalize font-bold text-neutral-800 cursor-pointer text-xs"
                            >
                              {DAY_LABELS[dia]}
                            </label>
                          </div>

                          {infoDia.aberto ? (
                            <div className="flex items-center space-x-2 animate-in fade-in duration-150">
                              <input
                                type="time"
                                disabled={isSubmitting}
                                value={infoDia.inicio}
                                onChange={(e) =>
                                  handleHoursChange(
                                    dia,
                                    "inicio",
                                    e.target.value,
                                  )
                                }
                                className="bg-neutral-200 text-black text-xs font-bold rounded-full px-2 py-1 border-none focus:outline-none focus:ring-1 focus:ring-black"
                              />
                              <span className="text-neutral-400 text-xs">
                                às
                              </span>
                              <input
                                type="time"
                                disabled={isSubmitting}
                                value={infoDia.fim}
                                onChange={(e) =>
                                  handleHoursChange(dia, "fim", e.target.value)
                                }
                                className="bg-neutral-200 text-black text-xs font-bold rounded-full px-2 py-1 border-none focus:outline-none focus:ring-1 focus:ring-black"
                              />
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-neutral-400 pr-8 animate-in fade-in duration-150">
                              Fechado
                            </span>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 disabled:bg-blue-400 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
