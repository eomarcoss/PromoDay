"use client";

import { useState, useRef } from "react";
// Assumindo que a action e as validações permanecem as mesmas
import { validateClaimAction } from "@/app/actions/validate-claim";
import {
  QrCode,
  Keyboard,
  CheckCircle2,
  XCircle,
  Loader2,
  Scan,
  ArrowRight,
  Zap,
} from "lucide-react";

// Mantenho a interface intacta pois é tipagem
interface ValidationResult {
  success: boolean;
  customerName?: string;
  promotionName?: string;
  quantity?: number;
  message?: string;
}

export function ValidateCodeModal() {
  // Lógica permanece inalterada
  const [mode, setMode] = useState<"manual" | "scanner">("manual");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length > 2) {
      value = `${value.slice(0, 2)}-${value.slice(2, 8)}`;
    }
    setCode(value);
  };

  const handleValidate = async (codeToValidate?: string) => {
    const targetCode = codeToValidate || code;
    if (!targetCode || targetCode.length < 9) return;

    setLoading(true);
    setResult(null);

    const res = await validateClaimAction(targetCode);

    setLoading(false);

    if (res.success && res.data) {
      setResult({
        success: true,
        customerName: res.data.user?.name || "Cliente",
        promotionName: res.data.promotion?.name || "Promoção",
        quantity: res.data.quantity || 1,
        message: res.message || "Cupom validado com sucesso.",
      });
    } else {
      setResult({
        success: false,
        message: res.message || "Código inválido ou expirado.",
      });
    }
  };

  const handleReset = () => {
    setCode("");
    setResult(null);
    if (mode === "manual") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // --- INÍCIO DA REESTILIZAÇÃO VISUAL ---
  // Cores aplicadas baseadas no tema Claro (Light Mode) fornecido:
  // Fundo: #FAFAFA, Card: #FFFFFF, Texto Principal: #070F22, Primária: #144AE0

  return (
    // Container Principal: Agora branco, com sombra suave e bordas sutis (Light Mode)
    <div className="w-full max-w-lvh mx-auto bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-950/5 overflow-hidden font-sans">
      {/* Header do Card: Fundo levemente cinza (#FAFAFA), divisória sutil */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Ícone: Fundo suave e cor Primária (#144AE0) */}
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              {/* Título: Texto Escuro (#070F22) */}
              <h2 className="text-xl font-bold text-slate-950 tracking-tight leading-tight">
                Validar Cupom
              </h2>
              {/* Subtítulo: Texto secundário (cinza) */}
              <p className="text-sm text-slate-600">
                Central de verificação do parceiro
              </p>
            </div>
          </div>
        </div>

        {/* Abas de Alternância: Fundo cinza claro, visual 'pílula' */}
        <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/70">
          <button
            onClick={() => {
              setMode("manual");
              setResult(null);
            }}
            className={`flex items-center justify-center gap-2.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
              mode === "manual"
                ? "bg-white text-blue-700 shadow-md shadow-slate-950/5 border border-slate-200/50" // Ativo: Branco, texto Primária
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50" // Inativo: Texto cinza
            }`}
          >
            <Keyboard className="w-4 h-4" />
            Digitar Código
          </button>
          <button
            onClick={() => {
              setMode("scanner");
              setResult(null);
            }}
            className={`flex items-center justify-center gap-2.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
              mode === "scanner"
                ? "bg-white text-blue-700 shadow-md shadow-slate-950/5 border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <QrCode className="w-4 h-4" />
            Ler QR Code
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-6">
        {!result ? (
          <>
            {mode === "manual" ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2.5">
                    Informe o código do cliente (PD-XXXXXX):
                  </label>
                  <div className="relative">
                    {/* Input: Fundo branco, borda sutil, foco na cor Primária */}
                    <input
                      ref={inputRef}
                      type="text"
                      maxLength={9}
                      value={code}
                      onChange={handleInputChange}
                      placeholder="PD-000000"
                      className="w-full bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-center text-3xl font-mono tracking-[0.2em] text-slate-950 placeholder:text-slate-300 rounded-2xl py-5 px-4 outline-none transition-all uppercase shadow-inner shadow-slate-950/5"
                    />
                    {code.length === 9 && !loading && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 text-xs font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                        Pronto
                      </span>
                    )}
                  </div>
                </div>

                {/* Botão Principal: Cor Primária (#144AE0), Texto Branco */}
                <button
                  onClick={() => handleValidate()}
                  disabled={code.length < 9 || loading}
                  className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-500 text-white font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 disabled:shadow-none"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Confirmar Resgate
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Modo Câmera: Cores de escaneamento ajustadas para o tema claro */
              <div className="flex flex-col items-center justify-center space-y-5">
                <div className="relative w-full aspect-square max-w-[260px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center overflow-hidden group">
                  {/* Overlay Efeito Scanner: Agora usando azul primário suave */}
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent animate-pulse" />
                  <div className="w-full h-0.5 bg-blue-500 shadow-[0_0_15px_#144AE0] absolute top-1/2 -translate-y-1/2 animate-bounce" />

                  <Scan className="w-14 h-14 text-slate-400 mb-3 group-hover:text-blue-600 transition-colors duration-300" />
                  <p className="text-sm text-slate-500 text-center px-6 leading-relaxed">
                    Posicione o QR Code do cliente em frente à câmera
                  </p>
                </div>

                <button
                  onClick={() => handleValidate("PD-DEMO12")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4 pt-2"
                >
                  [ Simular leitura de QR Code ]
                </button>
              </div>
            )}
          </>
        ) : (
          /* Estado de Resultado: Cores de Feedback (Verde/Vermelho) mantidas, mas suavizadas */
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {result.success ? (
              // Sucesso: Fundo verde suave, texto verde escuro
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-emerald-900 tracking-tight">
                  Cupom Validado!
                </h3>
                <p className="text-sm text-emerald-700 mt-1.5 leading-relaxed">
                  {result.message}
                </p>

                {/* Detalhes: Linhas divisórias sutis em verde */}
                <div className="mt-5 pt-5 border-t border-emerald-100 text-left space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-700/80">Cliente</span>
                    <span className="font-semibold text-emerald-950 bg-white px-2 py-0.5 rounded-md border border-emerald-100">
                      {result.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-700/80">Oferta</span>
                    <span className="font-semibold text-emerald-950 bg-white px-2 py-0.5 rounded-md border border-emerald-100 max-w-[200px] truncate">
                      {result.promotionName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-emerald-100/50">
                    <span className="text-emerald-700 font-medium">
                      Quantidade a entregar
                    </span>
                    <span className="font-extrabold text-xl text-emerald-600">
                      {result.quantity} un.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // Erro: Fundo vermelho suave, texto vermelho escuro
              <div className="p-6 rounded-2xl bg-red-50 border border-red-100 text-center">
                <XCircle className="w-14 h-14 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-red-900 tracking-tight">
                  Falha na Validação
                </h3>
                <p className="text-sm text-red-700 mt-1.5 leading-relaxed">
                  {result.message}
                </p>
              </div>
            )}

            {/* Botão Secundário: Fundo branco/cinza, borda, texto escuro */}
            <button
              onClick={handleReset}
              className="w-full py-3.5 px-6 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base rounded-2xl transition-all border border-slate-200 shadow-sm shadow-slate-950/5"
            >
              Validar Novo Código
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
