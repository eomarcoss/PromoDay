"use client";

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
} from "lucide-react";
import { useCustomerMetrics } from "@/hooks/useCustomerMetric";

interface UserProfileCardProps {
  avatarUrl?: string;
  name: string;
  email: string;
  phone: string;
  totalRedemptions?: number;
  totalSavedAmount?: number;
  onSaveProfile?: (updatedData: {
    name: string;
    phone: string;
    avatarUrl?: string;
  }) => void;
}

export function UserProfileCard({
  avatarUrl: initialAvatar,
  name: initialName,
  email,
  phone: initialPhone,
  totalRedemptions = 0,
  totalSavedAmount = 0,
  onSaveProfile,
}: UserProfileCardProps) {
  // Estados para dados locais
  const [userData, setUserData] = useState({
    name: initialName,
    phone: initialPhone,
    avatarUrl: initialAvatar,
  });

  // Estados para o Modal de Edição
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(userData);

  // 👈 CORREÇÃO: Sincroniza o estado interno sempre que as props externas mudarem (pós-carregamento do cookie/API)
  useEffect(() => {
    setUserData({
      name: initialName,
      phone: initialPhone,
      avatarUrl: initialAvatar,
    });
  }, [initialName, initialPhone, initialAvatar]);

  const handleOpenEdit = () => {
    setEditForm(userData);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData(editForm);
    setIsEditing(false);
    if (onSaveProfile) {
      onSaveProfile(editForm);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditForm((prev) => ({ ...prev, avatarUrl: url }));
    }
  };

  const { metrics, isLoading, isError } = useCustomerMetrics();

  const formattedSaved = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(metrics?.totalSavedAmount ?? totalSavedAmount);

  return (
    <>
      <Card className="w-full max-w-4xl bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-950/5 overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* PARTE ESQUERDA: Avatar + Infos Pessoais */}
            <div className="flex flex-col sm:flex-row items-center gap-5 w-full lg:w-auto text-center sm:text-left">
              {/* Avatar com Badge de Foto */}
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
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-bold text-slate-950 truncate tracking-tight">
                    {userData.name}
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-medium text-slate-600">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
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

            {/* PARTE DIREITA: Métricas (Resgates + Economia) + Botão Editar */}
            <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto">
              <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
                {/* Métrica 1: Resgates */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 px-4 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/60 shrink-0">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Resgates
                    </span>
                    <span className="text-base font-extrabold text-slate-950">
                      {metrics?.totalRedemptions ?? totalRedemptions}
                    </span>
                  </div>
                </div>

                {/* Métrica 2: Economia */}
                <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-3 px-4 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100/70 text-emerald-600 shrink-0">
                    <PiggyBank className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      Economizado
                    </span>
                    <span className="text-base font-extrabold text-emerald-950">
                      {formattedSaved}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão para Abrir Edição */}
              <button
                onClick={handleOpenEdit}
                className="p-3 bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-950 rounded-2xl transition-all border border-slate-200/60 shrink-0 flex items-center justify-center gap-2 text-sm font-semibold"
                title="Editar Perfil"
              >
                <Pencil className="w-4 h-4" />
                <span className="hidden xl:inline">Editar</span>
              </button>
            </div>
          </div>
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
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Modal */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
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
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition-all"
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
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Botões do Form */}
              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
                >
                  <Check className="w-4 h-4" />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
