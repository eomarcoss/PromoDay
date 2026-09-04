"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  AlertCircle,
  ChevronDown,
  Sparkles,
  Calendar,
  Layers,
} from "lucide-react";
import { formatBusinessHours } from "@/utils/formatHours";
import {
  updateProfileSellerAction,
  SellerProfileData,
} from "@/app/actions/sellerProfileActions";
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
  segunda: "Segunda-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sabado: "Sábado",
  domingo: "Domingo",
};

const DAY_KEYS_ORDER: DayKey[] = [
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
  "domingo",
];

const JS_DAY_MAP: Record<number, DayKey> = {
  0: "domingo",
  1: "segunda",
  2: "terca",
  3: "quarta",
  4: "quinta",
  5: "sexta",
  6: "sabado",
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
  isSubmitting?: boolean;
  message?: string;
  onSaveProfile?: (data: Partial<SellerProfileData>) => void;
}

export function SellerProfileCard({
  avatarUrl: initialAvatar,
  name: initialName,
  email,
  phone: initialPhone,
  address: initialAddress,
  businessHours: initialBusinessHours,
  category: initialCategory,
  message,
  onSaveProfile,
}: SellerProfileCardProps) {
  const { updateUser } = useAuth();
  const { metrics, isLoading: isLoadingMetrics, isError: isMetricsError } =
    useSellerMetrics();

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
  const [activeTab, setActiveTab] = useState<"general" | "hours">("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

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
    setSelectedFile(null);
    setErrorMessage(null);
    setActiveTab("general");
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
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setEditForm((prev) => ({ ...prev, avatarUrl: previewUrl }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const jsonBusinessHours = JSON.stringify(editForm.businessHours);

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
        setErrorMessage(
          typeof response.error === "string"
            ? response.error
            : (response.error as any)?.message || "Não foi possível atualizar o perfil."
        );
      }
    } catch (error: any) {
      setErrorMessage(
        error?.message || "Ocorreu um erro inesperado ao salvar os dados.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status de funcionamento em tempo real
  const currentHoursParsed = useMemo(() => {
    return parseBusinessHours(sellerData.businessHours);
  }, [sellerData.businessHours]);

  const isStoreOpenNow = useMemo(() => {
    const now = new Date();
    const currentDayKey = JS_DAY_MAP[now.getDay()];
    const todaySchedule = currentHoursParsed[currentDayKey];

    if (!todaySchedule || !todaySchedule.aberto) return false;

    const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;

    return (
      currentTimeStr >= todaySchedule.inicio &&
      currentTimeStr <= todaySchedule.fim
    );
  }, [currentHoursParsed]);

  return (
    <>
      {/* PAINEL PRINCIPAL DE PERFIL DO VENDEDOR (MINIMALISTA & MODERNO) */}
      <div className="w-full max-w-4xl flex flex-col gap-5">

        {/* HERO CARD COM IDENTIDADE VISUAL */}
        <Card className="relative overflow-hidden bg-card border border-border/70 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">

          {/* Top Banner Accent Sutil */}
          <div className="h-28 w-full bg-gradient-to-r from-primary/15 via-primary/5 to-transparent relative border-b border-border/40">
            <div className="absolute inset-0 bg-[radial-gradient(#144ae0_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

            {/* Tag de Conta de Vendedor Verificada */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-background/80 backdrop-blur-md border border-border/60 text-foreground shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Painel do Lojista
              </span>
            </div>
          </div>

          <CardContent className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
            {/* Header: Avatar, Identidade e Ação */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-6">

              {/* Avatar Squircle de Alto Padrão */}
              <div className="flex items-end gap-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-background border-4 border-card shadow-lg flex items-center justify-center overflow-hidden shrink-0">
                    {sellerData.avatarUrl ? (
                      <img
                        src={sellerData.avatarUrl}
                        alt={sellerData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-foreground font-black text-2xl uppercase tracking-wider">
                          {sellerData.name.substring(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Indicator Dot */}
                  <span
                    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-card ${isStoreOpenNow ? "bg-emerald-500" : "bg-muted-foreground/40"
                      }`}
                    title={isStoreOpenNow ? "Loja aberta agora" : "Loja fechada"}
                  />
                </div>

                {/* Título & Categoria (Mobile Stack / Desktop Row) */}
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                      {sellerData.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20 capitalize">
                      <Tag className="w-3 h-3" />
                      {sellerData.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${isStoreOpenNow
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isStoreOpenNow ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/50"
                          }`}
                      />
                      {isStoreOpenNow ? "Aberto agora" : "Fechado no momento"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão de Edição Primário */}
              <button
                type="button"
                onClick={handleOpenEdit}
                className="w-full sm:w-auto h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow active:scale-[0.98] cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar Estabelecimento</span>
              </button>
            </div>

            {/* GRID DE INFORMAÇÕES DE CONTATO E HORÁRIOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-border/50">

              {/* E-mail */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-background border border-border/60 flex items-center justify-center text-muted-foreground shrink-0 shadow-2xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    E-mail de Contato
                  </span>
                  <span className="text-xs font-medium text-foreground truncate mt-0.5">
                    {email}
                  </span>
                </div>
              </div>

              {/* Telefone */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-background border border-border/60 flex items-center justify-center text-muted-foreground shrink-0 shadow-2xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Telefone / WhatsApp
                  </span>
                  <span className="text-xs font-medium text-foreground truncate mt-0.5">
                    {sellerData.phone}
                  </span>
                </div>
              </div>

              {/* Endereço */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors md:col-span-2">
                <div className="w-9 h-9 rounded-xl bg-background border border-border/60 flex items-center justify-center text-muted-foreground shrink-0 shadow-2xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Localização da Loja
                  </span>
                  <span className="text-xs font-medium text-foreground truncate mt-0.5">
                    {sellerData.address}
                  </span>
                </div>
              </div>

              {/* Horários (Accordion Interativo Minimalista) */}
              <div className="flex flex-col p-3.5 rounded-2xl bg-muted/30 border border-border/40 md:col-span-2 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-background border border-border/60 flex items-center justify-center text-primary shrink-0 shadow-2xs">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Horários de Atendimento
                      </span>
                      <span className="text-xs font-semibold text-foreground truncate mt-0.5">
                        {formatBusinessHours(sellerData.businessHours)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFullSchedule(!showFullSchedule)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 rounded-lg border border-primary/20 transition-all flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                  >
                    <span>{showFullSchedule ? "Recolher" : "Ver semana"}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${showFullSchedule ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                </div>

                {/* Lista Sanfona de Horários da Semana */}
                {showFullSchedule && (
                  <div className="mt-3 pt-3 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs animate-in fade-in duration-200">
                    {DAY_KEYS_ORDER.map((dayKey) => {
                      const daySchedule = currentHoursParsed[dayKey];
                      const isToday =
                        JS_DAY_MAP[new Date().getDay()] === dayKey;

                      return (
                        <div
                          key={dayKey}
                          className={`flex items-center justify-between px-3 py-1.5 rounded-xl transition-colors ${isToday
                            ? "bg-primary/10 font-semibold text-primary border border-primary/20"
                            : "bg-background/60 border border-border/40 text-muted-foreground"
                            }`}
                        >
                          <span className="capitalize text-xs">
                            {DAY_LABELS[dayKey]} {isToday && "(Hoje)"}
                          </span>
                          {daySchedule?.aberto ? (
                            <span className="font-medium text-foreground text-xs">
                              {daySchedule.inicio} às {daySchedule.fim}
                            </span>
                          ) : (
                            <span className="italic text-muted-foreground/70 text-xs">
                              Fechado
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* STAT CARDS / MÉTRICAS DE PERFORMANCE DO LOJISTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Card: Total de Promoções */}
          <div className="group relative overflow-hidden bg-card border border-border/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Ofertas Publicadas
                </span>
                <span className="text-2xl font-black text-foreground tabular-nums tracking-tight mt-0.5">
                  {isLoadingMetrics ? (
                    <span className="animate-pulse text-muted-foreground">...</span>
                  ) : isMetricsError ? (
                    <span className="text-destructive text-sm font-medium">Erro</span>
                  ) : (
                    (metrics?.totalPromotions ?? 0)
                  )}
                </span>
              </div>
            </div>

          </div>

          {/* Card: Total de Vendas */}
          <div className="group relative overflow-hidden bg-card border border-border/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Cupons Validados
                </span>
                <span className="text-2xl font-black text-foreground tabular-nums tracking-tight mt-0.5">
                  {isLoadingMetrics ? (
                    <span className="animate-pulse text-muted-foreground">...</span>
                  ) : isMetricsError ? (
                    <span className="text-destructive text-sm font-medium">Erro</span>
                  ) : (
                    (metrics?.totalSales ?? 0)
                  )}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Vendas
            </span>
          </div>
        </div>
      </div>

      {/* MODAL DE EDIÇÃO MINIMALISTA & ESTRUTURADO */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => !isSubmitting && setIsEditing(false)}
        >
          <div
            className="bg-card text-card-foreground border border-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal com Abas */}
            <div className="px-6 pt-5 pb-3 border-b border-border/60 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Configurações do Estabelecimento
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Gerencie os dados cadastrais e horários da sua loja
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsEditing(false)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Segmented Control / Tabs */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
                <button
                  type="button"
                  onClick={() => setActiveTab("general")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "general"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Dados Gerais</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("hours")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "hours"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Horários</span>
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">

                {/* Banner de Erro Inline */}
                {errorMessage && (
                  <div className="flex items-center gap-2 p-3 text-xs bg-destructive/10 text-destructive rounded-xl border border-destructive/20 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* TAB 1: DADOS GERAIS */}
                {activeTab === "general" && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* Upload de Avatar */}
                    <div className="flex flex-col items-center justify-center pb-2">
                      <div className="relative group cursor-pointer">
                        <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center overflow-hidden border-2 border-border shadow-sm">
                          {editForm.avatarUrl ? (
                            <img
                              src={editForm.avatarUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-foreground font-bold text-xl uppercase">
                              {editForm.name.substring(0, 2)}
                            </span>
                          )}
                        </div>
                        <label className="absolute inset-0 bg-background/70 backdrop-blur-xs rounded-2xl flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Camera className="w-5 h-5" />
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isSubmitting}
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-2 font-medium">
                        Clique para alterar o logo da loja
                      </span>
                    </div>

                    {/* Nome da Loja */}
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                        Nome da Loja
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          disabled={isSubmitting}
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full bg-muted/40 border border-border focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium text-foreground outline-none transition-all disabled:opacity-60"
                          required
                        />
                      </div>
                    </div>

                    {/* Categoria & Telefone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                          Categoria
                        </label>
                        <select
                          disabled={isSubmitting}
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({ ...editForm, category: e.target.value })
                          }
                          className="w-full bg-muted/40 border border-border focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 rounded-xl py-2.5 px-3 text-sm font-medium text-foreground outline-none transition-all disabled:opacity-60 capitalize cursor-pointer"
                          required
                        >
                          <option value="" disabled>
                            Selecione...
                          </option>
                          <option value="supermercado">
                            Supermercado & Mercados
                          </option>
                          <option value="farmacia">
                            Farmácia & Drogarias
                          </option>
                          <option value="padaria">
                            Padaria & Confeitarias
                          </option>
                          <option value="hortifruti">
                            Hortifrúti & Feira
                          </option>
                          <option value="restaurante">
                            Restaurantes & Lanchonetes
                          </option>
                          <option value="petshop">
                            Pet Shops
                          </option>
                          <option value="vestuario">
                            Roupas & Acessórios
                          </option>
                          <option value="eletronicos">
                            Eletrônicos & Informática
                          </option>
                          <option value="servicos">
                            Serviços
                          </option>
                          <option value="outros">
                            Outros
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                          Telefone
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            disabled={isSubmitting}
                            value={editForm.phone}
                            onChange={(e) =>
                              setEditForm({ ...editForm, phone: e.target.value })
                            }
                            className="w-full bg-muted/40 border border-border focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium text-foreground outline-none transition-all disabled:opacity-60"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Endereço */}
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1.5">
                        Endereço Completo
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-muted-foreground/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          disabled={isSubmitting}
                          value={editForm.address}
                          onChange={(e) =>
                            setEditForm({ ...editForm, address: e.target.value })
                          }
                          className="w-full bg-muted/40 border border-border focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium text-foreground outline-none transition-all disabled:opacity-60"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: HORÁRIOS DE ATENDIMENTO */}
                {activeTab === "hours" && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <p className="text-xs text-muted-foreground">
                      Configure os horários de abertura e fechamento para cada dia da semana:
                    </p>

                    <div className="space-y-2">
                      {DAY_KEYS_ORDER.map((dia) => {
                        const infoDia = editForm.businessHours[dia];
                        return (
                          <div
                            key={dia}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors gap-2"
                          >
                            <label
                              htmlFor={`edit-check-${dia}`}
                              className="flex items-center gap-2.5 cursor-pointer select-none"
                            >
                              <input
                                type="checkbox"
                                id={`edit-check-${dia}`}
                                disabled={isSubmitting}
                                checked={infoDia.aberto}
                                onChange={(e) =>
                                  handleHoursChange(
                                    dia,
                                    "aberto",
                                    e.target.checked,
                                  )
                                }
                                className="w-4 h-4 accent-primary rounded cursor-pointer"
                              />
                              <span
                                className={`text-xs font-semibold ${infoDia.aberto
                                  ? "text-foreground"
                                  : "text-muted-foreground/60"
                                  }`}
                              >
                                {DAY_LABELS[dia]}
                              </span>
                            </label>

                            {infoDia.aberto ? (
                              <div className="flex items-center gap-1.5 self-end sm:self-auto">
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
                                  className="bg-background text-foreground text-xs font-semibold rounded-lg px-2 py-1 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <span className="text-muted-foreground text-xs">
                                  às
                                </span>
                                <input
                                  type="time"
                                  disabled={isSubmitting}
                                  value={infoDia.fim}
                                  onChange={(e) =>
                                    handleHoursChange(dia, "fim", e.target.value)
                                  }
                                  className="bg-background text-foreground text-xs font-semibold rounded-lg px-2 py-1 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                            ) : (
                              <span className="text-xs font-medium text-muted-foreground/60 self-end sm:self-auto pr-2">
                                Fechado
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Footer com Ações */}
              <div className="p-4 px-6 border-t border-border/60 bg-muted/10 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 px-4 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
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
