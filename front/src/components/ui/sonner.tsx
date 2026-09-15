"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // 1. CORREÇÃO: Coloquei a cor específica diretamente na classe de cada ícone!
      icons={{
        success: <CircleCheckIcon className="size-5 text-primary" />,
        info: <InfoIcon className="size-5 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-5 text-yellow-500" />,
        error: <OctagonXIcon className="size-5 text-red-500" />,
        loading: <Loader2Icon className="size-5 animate-spin text-zinc-500" />,
      }}
      toastOptions={{
        classNames: {
          // Toast Base: Usamos as variáveis do tema para dark mode automático
          toast: 'bg-background border border-border shadow-lg rounded-xl',

          // 2. CORREÇÃO: Usamos text-foreground em vez de text-zinc-900 chumbado
          title: 'font-semibold text-foreground text-sm',
          description: 'text-muted-foreground text-sm',

          closeButton: 'bg-secondary border-none text-muted-foreground hover:text-foreground',

          // 3. CORREÇÃO: Usamos o "!" para forçar que o Tailwind respeite 
          // essa borda lateral ao invés da borda padrão cinza do 'toast' base.
          success: '!border-l-4 !border-l-primary',
          error: '!border-l-4 !border-l-red-500',
          warning: '!border-l-4 !border-l-yellow-500',
          info: '!border-l-4 !border-l-blue-500',

          // Botões internos
          actionButton: 'bg-primary text-primary-foreground font-medium rounded-md px-3 py-1',
          cancelButton: 'bg-secondary text-secondary-foreground font-medium rounded-md px-3 py-1',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }