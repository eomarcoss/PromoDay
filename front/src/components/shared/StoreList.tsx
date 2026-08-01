import React from "react";
import { StoreCard } from "../shared/StoreCard";

// Tipagem da loja que vem da API
export interface Store {
  id: string;
  name: string;
  imageUrl?: string;
  _count?: {
    promotions: number;
  };
  offersCount?: number;
  isOpen?: boolean;
}

interface StoreListProps {
  stores: Store[];
}

export function StoreList({ stores }: StoreListProps) {
  if (!stores || stores.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400 font-medium">
          Nenhuma loja encontrada no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      {stores.map((store) => {
        const count = store.offersCount ?? store._count?.promotions ?? 0;

        return (
          <StoreCard
            key={store.id}
            id={store.id}
            name={store.name}
            imageUrl={store.imageUrl}
            offersCount={count}
            isOpen={store.isOpen ?? true}
          />
        );
      })}
    </div>
  );
}