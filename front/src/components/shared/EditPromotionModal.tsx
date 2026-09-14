"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Plus,
  Trash2,
  Calendar,
  Package,
  Users,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { updatePromotionAction } from "@/app/actions/updatePromotionAction";

export interface PromotionData {
  id: string;
  name: string;
  sellerId: string;
  description?: string | null;
  requirements?: string | null;
  stock: number;
  limitPerUser: number;
  endTime: string;
  images: string[];
}

interface EditPromotionModalProps {
  promotion: PromotionData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface LocalFilePreview {
  id: string;
  file: File;
  previewUrl: string;
}

export function EditPromotionModal({
  promotion,
  isOpen,
  onClose,
  onSuccess,
}: EditPromotionModalProps) {
  const formatForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const [form, setForm] = useState({
    description: promotion?.description || "",
    requirements: promotion?.requirements || "",
    stock: promotion?.stock || 1,
    limitPerUser: promotion?.limitPerUser || 1,
    endTime: formatForInput(promotion?.endTime),
  });

  const [existingImages, setExistingImages] = useState<string[]>(
    promotion?.images || [],
  );

  const [newFiles, setNewFiles] = useState<LocalFilePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (promotion && isOpen) {
      setForm({
        description: promotion.description || "",
        requirements: promotion.requirements || "",
        stock: promotion.stock,
        limitPerUser: promotion.limitPerUser,
        endTime: formatForInput(promotion.endTime),
      });
      setExistingImages(promotion.images || []);
      setNewFiles([]);
      setErrorMessage(null);
    }
  }, [promotion, isOpen]);

  const cleanupPreviews = () => {
    newFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
  };

  const handleClose = () => {
    cleanupPreviews();
    setNewFiles([]);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newEntries: LocalFilePreview[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewFiles((prev) => [...prev, ...newEntries]);
    e.target.value = "";
  };

  const handleRemoveExistingImage = (urlToRemove: string) => {
    setExistingImages((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const handleRemoveNewFile = (idToRemove: string) => {
    setNewFiles((prev) => {
      const fileToRemove = prev.find((item) => item.id === idToRemove);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((item) => item.id !== idToRemove);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (existingImages.length === 0 && newFiles.length === 0) {
      setErrorMessage("A promoção deve conter pelo menos uma foto.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // Estruturação do FormData contendo todos os dados textuais e binários
    const formData = new FormData();
    formData.append("sellerId", promotion.sellerId);
    formData.append("description", form.description);
    formData.append("requirements", form.requirements);
    formData.append("stock", String(form.stock));
    formData.append("limitPerUser", String(form.limitPerUser));
    formData.append("endTime", new Date(form.endTime).toISOString());

    // Anexa as URLs mantidas
    existingImages.forEach((url) => {
      formData.append("existingImages", url);
    });

    // Anexa os novos arquivos binários para upload
    newFiles.forEach((item) => {
      formData.append("files", item.file);
    });

    try {
      console.log("=== CONTEÚDO DO FORMDATA ENVIADO ===");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`📁 File [${key}]:`, {
            name: value.name,
            size: value.size,
            type: value.type,
          });
        } else {
          console.log(`📝 Text [${key}]:`, value);
        }
      }
      const res = await updatePromotionAction(promotion.id, formData);

      if (res.success) {
        cleanupPreviews();
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const errorMsg = Array.isArray(res.error)
          ? res.error.join(", ")
          : res.error;
        setErrorMessage(errorMsg || "Erro ao salvar alterações.");
      }
    } catch (err) {
      setErrorMessage("Erro inesperado ao salvar os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={() => !loading && handleClose()}
    >
      <div
        className="bg-white border border-slate-100 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-950">
              Editar Promoção
            </h3>
            <p className="text-xs font-medium text-slate-500 truncate max-w-[280px]">
              {promotion.name}
            </p>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-all disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errorMessage && (
            <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-100">
              {errorMessage}
            </div>
          )}

          {/* GALERIA DE FOTOS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                Galeria de Imagens ({existingImages.length + newFiles.length})
              </label>
              <label className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar fotos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={loading}
                  onChange={handleAddImages}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200/80 min-h-[110px]">
              {existingImages.map((url, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="relative group w-full h-24 bg-slate-200 rounded-xl overflow-hidden border border-slate-300/60 shadow-sm"
                >
                  <img
                    src={url}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleRemoveExistingImage(url)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-md"
                    title="Excluir foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {newFiles.map((item) => (
                <div
                  key={item.id}
                  className="relative group w-full h-24 bg-slate-200 rounded-xl overflow-hidden border-2 border-blue-400 shadow-sm"
                >
                  <img
                    src={item.previewUrl}
                    alt="Nova foto"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-[#88E713] text-[#111827] text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                    Nova
                  </span>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleRemoveNewFile(item.id)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-md"
                    title="Remover foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {existingImages.length === 0 && newFiles.length === 0 && (
                <label className="col-span-3 flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-100/60 transition-all duration-300">
                  <Plus className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs text-slate-500 font-medium">
                    Clique para adicionar imagens
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={loading}
                    onChange={handleAddImages}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Descrição
            </label>
            <textarea
              rows={3}
              value={form.description}
              disabled={loading}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 transition-all resize-none disabled:opacity-60"
              placeholder="Detalhes adicionais..."
            />
          </div>

          {/* Requisitos */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Requisitos (Opcional)
            </label>
            <input
              type="text"
              value={form.requirements}
              disabled={loading}
              onChange={(e) =>
                setForm({ ...form, requirements: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 transition-all disabled:opacity-60"
              placeholder="Ex: Apresentar documento com foto..."
            />
          </div>

          {/* Estoque e Limite */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Estoque Total
              </label>
              <div className="relative">
                <Package className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min={1}
                  value={form.stock}
                  disabled={loading}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 disabled:opacity-60"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Limite / Cliente
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min={1}
                  value={form.limitPerUser}
                  disabled={loading}
                  onChange={(e) =>
                    setForm({ ...form, limitPerUser: Number(e.target.value) })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 disabled:opacity-60"
                  required
                />
              </div>
            </div>
          </div>

          {/* Fim da Oferta */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Prorrogar Fim da Oferta
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="datetime-local"
                value={form.endTime}
                disabled={loading}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 disabled:opacity-60"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex gap-2 shrink-0">
            <button
              type="button"
              disabled={loading}
              onClick={handleClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-[#88E713] hover:bg-[#76c910] text-[#111827] font-semibold text-xs rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md shadow-[#88E713]/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
