"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, PauseCircle, PlayCircle, Edit } from "lucide-react";

import { deletePromotionAction } from "@/app/actions/deletePromotionAction";
import { pausePromotionAction } from "@/app/actions/pausePromotionAction";
import {
  EditPromotionModal,
  PromotionData,
} from "@/components/shared/EditPromotionModal";

interface SellerPromoActionsProps {
  productId: string;
  isActive?: boolean;
  promotion?: PromotionData; // 👈 Passamos os dados atuais da promoção
  onUpdate?: () => void; // 👈 Opcional: callback para recarregar a lista (ex: SWR mutate)
}

export function SellerPromoActions({
  productId,
  isActive,
  promotion,
  onUpdate,
}: SellerPromoActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeState, setActiveState] = useState(isActive);

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta promoção?"))
      return;

    try {
      setIsDeleting(true);
      await deletePromotionAction(productId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao excluir promoção:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePause = async () => {
    try {
      setIsPausing(true);
      const res = await pausePromotionAction(productId);

      if (res?.success) {
        setActiveState((prev) => !prev);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Erro ao alternar status da promoção:", error);
    } finally {
      setIsPausing(false);
    }
  };

  return (
    <>
      <div className="w-full grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full font-medium text-xs gap-1 h-9 rounded-lg border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all duration-300 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {isDeleting ? "..." : "Excluir"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePause}
          disabled={isPausing}
          className="w-full font-medium text-xs gap-1 h-9 rounded-lg border-border/80 hover:bg-accent transition-all duration-300 cursor-pointer"
        >
          {activeState ? (
            <>
              <PauseCircle className="w-3.5 h-3.5" />
              {isPausing ? "..." : "Pausar"}
            </>
          ) : (
            <>
              <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
              {isPausing ? "..." : "Ativar"}
            </>
          )}
        </Button>

        <Button
          size="sm"
          onClick={() => setIsEditOpen(true)}
          className="w-full font-medium text-xs gap-1 h-9 rounded-lg bg-primary text-foreground hover:bg-primary/90 transition-all duration-300 cursor-pointer"
        >
          <Edit className="w-3.5 h-3.5" />
          Editar
        </Button>
      </div>

      {/* MODAL DE EDIÇÃO */}
      {promotion && (
        <EditPromotionModal
          promotion={promotion}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSuccess={onUpdate}
        />
      )}
    </>
  );
}
