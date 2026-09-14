
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pencil,
  Ticket,
  PiggyBank,
  Mail,
  Phone,
  Camera,
  X,
  Check,
  User,
  Loader2,
} from "lucide-react";
import { useCustomerMetrics } from "@/hooks/useCustomerMetric";

interface UserProfileCardProps {
  avatarUrl?: string;
  name: string;
  email: string;
  phone: string;
  totalRedemptions?: number;
  totalSavedAmount?: number;
  isSubmitting?: boolean;
  onSaveProfile?: (formData: FormData) => Promise<void> | void; // 👈 Ajustado para aceitar FormData
}

export function UserProfileCard({
  avatarUrl: initialAvatar,
  name: initialName,
  email,
  phone: initialPhone,
  totalRedemptions = 0,
  totalSavedAmount = 0,
  isSubmitting = false,
  onSaveProfile,
}: UserProfileCardProps) {
  // Estados para dados exibidos no Card
  const [userData, setUserData] = useState({
    name: initialName,
    phone: initialPhone,
    avatarUrl: initialAvatar,
  });

  // Estados do Modal de Edição
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(userData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 👈 Guarda o arquivo binário real
  const [localLoading, setLocalLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sincroniza o estado interno quando as props mudarem
  useEffect(() => {
    setUserData({
      name: initialName,
      phone: initialPhone,
      avatarUrl: initialAvatar,
    });
  }, [initialName, initialPhone, initialAvatar]);

  const handleOpenEdit = () => {
    setEditForm(userData);
    setSelectedFile(null); // Reseta o arquivo selecionado
    setErrorMessage(null);
    setIsEditing(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Guarda o objeto File para envio no FormData
      const previewUrl = URL.createObjectURL(file); // Blob apenas para a prévia visual no modal
      setEditForm((prev) => ({ ...prev, avatarUrl: previewUrl }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Monta o FormData para enviar os textos + arquivo para o container/action
    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("phone", editForm.phone);

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    if (onSaveProfile) {
      try {
        setLocalLoading(true);
        // 2. Dispara a callback passando o FormData montado
        await onSaveProfile(formData);
        setIsEditing(false); // O container/action cuida da atualização do userData via props
      } catch (error: any) {
        setErrorMessage(
          error?.message || "Erro ao salvar alterações. Tente novamente.",
        );
      } finally {
        setLocalLoading(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const { metrics } = useCustomerMetrics();

  const formattedSaved = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(metrics?.totalSavedAmount ?? totalSavedAmount);

  const isPending = isSubmitting || localLoading;

  return (
    <>
      <Card className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden">
        <CardContent className="p-5 sm:p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

            {/* PARTE ESQUERDA: Avatar + Infos Pessoais */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5 w-full lg:w-auto text-center sm:text-left pt-1 lg:pt-0">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 sm:w-22 sm:h-22 bg-slate-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-100 shadow-md">
                  {userData.avatarUrl ? (
                    <img
                      src={userData.avatarUrl}
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-extrabold text-2xl uppercase select-none">
                      {userData.name?.substring(0, 2) || "US"}
                    </span>
                  )}
                </div>
              </div>

              {/* Detalhes do Usuário */}
              <div className="space-y-1.5 min-w-0 max-w-[240px] sm:max-w-none">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-bold text-slate-950 truncate tracking-tight">
                    {userData.name}
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs font-medium text-slate-600">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 min-w-0">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{email}</span>
                  </div>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{userData.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DIVISÓRIA MOBILE/DESKTOP */}
            <div className="w-full h-[1px] lg:w-[1px] lg:h-16 bg-slate-100" />

            {/* PARTE DIREITA: Métricas + Botão Editar */}
            <div className="flex items-center justify-center lg:justify-end gap-4 w-full lg:w-auto">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full sm:max-w-sm lg:w-auto">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-white text-[#111827] border border-[#88E713]/30 shrink-0">
                    <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0 w-full">
                    <span className="block text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase tracking-wide sm:tracking-wider">
                      Resgates
                    </span>
                    <span className="block text-sm sm:text-base font-extrabold text-slate-950 leading-tight break-words">
                      {metrics?.totalRedemptions ?? totalRedemptions}
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-100/70 text-emerald-600 shrink-0">
                    <PiggyBank className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0 w-full">
                    <span className="block text-[10px] sm:text-[11px] font-bold text-emerald-800 uppercase tracking-wide sm:tracking-wider">
                      Economizado
                    </span>
                    <span className="block text-sm sm:text-base font-extrabold text-emerald-950 leading-tight break-words">
                      {formattedSaved}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão Editar — permanece no fluxo apenas no desktop */}
              <button
                type="button"
                onClick={handleOpenEdit}
                className="hidden lg:flex p-3 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-2xl transition-all shrink-0 items-center justify-center gap-2 text-sm font-semibold cursor-pointer"
                title="Editar Perfil"
                aria-label="Editar Perfil"
              >
                <Pencil className="w-4 h-4" />
                <span className="hidden xl:inline">Editar</span>
              </button>
            </div>

          </div>

          {/* Botão Editar — flutuante no canto superior direito apenas no mobile/tablet */}
          <button
            type="button"
            onClick={handleOpenEdit}
            className="absolute top-4 right-4 lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-700 active:scale-95 active:bg-slate-200 transition-all cursor-pointer"
            title="Editar Perfil"
            aria-label="Editar Perfil"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </CardContent>
      </Card>

      {/* MODAL DE EDIÇÃO DE DADOS */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-950">
                Editar Dados Pessoais
              </h3>
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-all disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Modal */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-100">
                  {errorMessage}
                </div>
              )}

              {/* Foto de Perfil */}
              <div className="flex flex-col items-center justify-center mb-2">
                <div className="relative group cursor-pointer">
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-200 shadow-sm">
                    {editForm.avatarUrl ? (
                      <img
                        src={editForm.avatarUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-xl uppercase">
                        {editForm.name?.substring(0, 2) || "US"}
                      </span>
                    )}
                  </div>
                  <label className="absolute inset-0 bg-slate-950/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isPending}
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-xs text-slate-600 mt-2">
                  Clique na foto para alterar
                </span>
              </div>

              {/* Campo Nome */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={editForm.name}
                    disabled={isPending}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-100 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition-all disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              {/* Campo Telefone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={editForm.phone}
                    disabled={isPending}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-100 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition-all disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              {/* Botões do Form */}
              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 px-4 bg-primary hover:bg-primary/90 text-foreground font-semibold text-sm rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Salvar
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
