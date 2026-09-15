import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Ajustado para o nome da sua aplicação!
export const metadata: Metadata = {
  title: "PromoDay | As melhores promoções",
  description: "Encontre as melhores promoções e cupons no PromoDay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      suppressHydrationWarning={true}
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        inter.variable, // Agrupei as variáveis juntas para ficar mais limpo
        "font-sans"
      )}
    >
      {/* CORRIGIDO: bg-[#ECF0F1] */}
      <body className="min-h-full flex flex-col bg-[#ECF0F1]">
        <AuthProvider>
          {children}
        </AuthProvider>

        {/* Se você preferir manter as opções de cor aqui, o código que você fez funciona perfeitamente! 
            Mas se não pegar as cores, lembre-se de mover o toastOptions para dentro de @/components/ui/sonner.tsx */}
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast: 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-lg rounded-xl',
              title: 'font-semibold text-zinc-900 dark:text-zinc-50 text-sm',
              description: 'text-zinc-500 dark:text-zinc-400 text-sm',
              closeButton: 'bg-zinc-100 dark:bg-zinc-800 border-none text-zinc-500 hover:text-zinc-900',
              success: 'border-l-4 border-l-primary',
              error: 'border-l-4 border-l-red-500 text-red-600',
              warning: 'border-l-4 border-l-yellow-500 text-yellow-600',
              info: 'border-l-4 border-l-blue-500 text-blue-600',
              actionButton: 'bg-primary text-white font-medium rounded-md px-3 py-1',
              cancelButton: 'bg-zinc-100 text-zinc-700 font-medium rounded-md px-3 py-1',
            },
          }}
        />
      </body>
    </html>
  );
}