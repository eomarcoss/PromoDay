"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, PauseCircle, PlayCircle, Edit } from "lucide-react";

import { deletePromotionAction } from "@/app/actions/deletePromotionAction";
import { pausePromotionAction } from "@/app/actions/pausePromotionAction";

interface SellerPromoActionsProps {
  productId: string;
  isActive?: boolean;
}

export function SellerPromoActions({
  productId,
  isActive,
}: SellerPromoActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [activeState, setActiveState] = useState(isActive);

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta promoção?"))
      return;

    try {
      setIsDeleting(true);
      await deletePromotionAction(productId);
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

      // Se a action retornar sucesso e o novo status, atualiza o estado local
      if (res?.success) {
        setActiveState((prev) => !prev);
      }
    } catch (error) {
      console.error("Erro ao alternar status da promoção:", error);
    } finally {
      setIsPausing(false);
    }
  };

  const handleEdit = () => {
    window.location.href = `/dashboard/promotions/${productId}/edit`;
  };

  return (
    <div className="w-full grid grid-cols-3 gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
        className="w-full font-medium text-xs gap-1 h-9 rounded-lg border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        {isDeleting ? "..." : "Excluir"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handlePause}
        disabled={isPausing}
        className="w-full font-medium text-xs gap-1 h-9 rounded-lg border-border/80 hover:bg-accent transition-colors"
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
        onClick={handleEdit}
        className="w-full font-medium text-xs gap-1 h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <Edit className="w-3.5 h-3.5" />
        Editar
      </Button>
    </div>
  );
}
