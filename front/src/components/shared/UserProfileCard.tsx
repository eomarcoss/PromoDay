import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface UserProfileCardProps {
  avatarUrl?: string;
  name: string;
  email: string;
  phone: string;
}

export function UserProfileCard({
  avatarUrl,
  name,
  email,
  phone,
}: UserProfileCardProps) {
  return (
    <Card className="w-full max-w-4xl bg-neutral-100 border border-neutral-200 rounded-[28px] shadow-sm overflow-hidden">
      <CardContent className="p-3 pr-6 flex items-center">
        {/* BLOCO 1: Avatar Redondo */}
        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-neutral-800 ml-1">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            // Iniciais do usuário caso não tenha foto cadastrada
            <span className="text-white font-bold text-lg uppercase select-none">
              {name.substring(0, 2)}
            </span>
          )}
        </div>

        {/* Divisória Vertical 1 */}
        <div className="h-12 w-[1px] bg-neutral-200 mx-4 shrink-0" />

        {/* BLOCO 2: Informações de Identificação (Nome, E-mail e Telefone) */}
        <div className="flex flex-col flex-1 min-w-0 justify-center py-1">
          {/* Nome em Destaque */}
          <h2 className="text-lg font-bold text-black truncate mb-1">{name}</h2>

          {/* Grid Responsivo para os Contatos: Lado a lado em telas maiores, empilhado no mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-x-12">
            <div className="flex items-center space-x-1 min-w-0">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider shrink-0">
                Email:
              </span>
              <span className="text-sm font-medium text-black truncate">
                {email}
              </span>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Telefone:
              </span>
              <span className="text-sm font-medium text-black">{phone}</span>
            </div>
          </div>
        </div>

        {/* Divisória Vertical 3 (Mantendo o grid da sua imagem para a área vazia na direita) */}
        <div className="h-12 w-[1px] bg-neutral-200 mx-6 hidden md:block shrink-0" />

        {/* Espaço reservado na direita caso queira adicionar um botão de 'Editar' no futuro */}
        <div className="hidden md:block w-24 shrink-0" />
        <h3 className="text-sm font-medium text-black">Editar</h3>
      </CardContent>
    </Card>
  );
}
