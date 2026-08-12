"use client";

import { useState, useRef, useEffect } from "react";
import {
  QrCode,
  Keyboard,
  CheckCircle2,
  XCircle,
  Loader2,
  Scan,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ValidationResult {
  success: boolean;
  customerName?: string;
  promotionName?: string;
  quantity?: number;
  message?: string;
}

export function ValidateCodeModal() {
  const [mode, setMode] = useState<"manual" | "scanner">("manual");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Formata o texto inserido para o padrão PD-XXXXXX
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Adiciona o hífen automaticamente após os 2 primeiros caracteres
    if (value.length > 2) {
      value = `${value.slice(0, 2)}-${value.slice(2, 8)}`;
    }

    setCode(value);
  };

  // Simulação de envio/validação para o backend
  const handleValidate = async (codeToValidate?: string) => {
    const targetCode = codeToValidate || code;
    if (!targetCode || targetCode.length < 9) return;

    setLoading(true);
    setResult(null);

    // Simula delay de requisição da API
    setTimeout(() => {
      setLoading(false);
      // Exemplo de retorno simulado
      if (targetCode.startsWith("PD-")) {
        setResult({
          success: true,
          customerName: "Lucas Silva",
          promotionName: "Combo X-Tudo + Refri 2L",
          quantity: 1,
          message: "Cupom válido! Pode realizar a entrega.",
        });
      } else {
        setResult({
          success: false,
          message: "Código inválido ou já utilizado.",
        });
      }
    }, 1200);
  };

  const handleReset = () => {
    setCode("");
    setResult(null);
    if (mode === "manual") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-sans">
      {/* Header do Card */}
      <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 leading-tight">
                Validar Cupom
              </h2>
              <p className="text-xs text-zinc-400">
                Área de conferência do estabelecimento
              </p>
            </div>
          </div>
        </div>

        {/* Abas de Alternância (Manual vs Scanner) */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
          <button
            onClick={() => {
              setMode("manual");
              setResult(null);
            }}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "manual"
                ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Keyboard className="w-4 h-4" />
            Digitando
          </button>
          <button
            onClick={() => {
              setMode("scanner");
              setResult(null);
            }}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "scanner"
                ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <QrCode className="w-4 h-4" />
            Câmera / QR Code
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-6">
        {!result ? (
          <>
            {mode === "manual" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">
                    Digite o código fornecido pelo cliente:
                  </label>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      maxLength={9}
                      value={code}
                      onChange={handleInputChange}
                      placeholder="PD-XXXXXX"
                      className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-center text-2xl font-mono tracking-widest text-zinc-100 placeholder:text-zinc-700 rounded-xl py-4 px-3 outline-none transition-all uppercase"
                    />
                    {code.length === 9 && !loading && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        Pronto
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleValidate()}
                  disabled={code.length < 9 || loading}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 disabled:shadow-none"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Validar Resgate
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Modo Câmera / QR Code */
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative w-full aspect-square max-w-[240px] bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden group">
                  {/* Overlay Efeito Scanner */}
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent animate-pulse" />
                  <div className="w-full h-0.5 bg-emerald-500 shadow-[0_0_15px_#10b981] absolute top-1/2 -translate-y-1/2 animate-bounce" />

                  <Scan className="w-12 h-12 text-zinc-600 mb-2 group-hover:text-emerald-400 transition-colors" />
                  <p className="text-xs text-zinc-500 text-center px-4">
                    Aponte a câmera do dispositivo para o QR Code do cliente
                  </p>
                </div>

                <button
                  onClick={() => handleValidate("PD-TW19DQ")}
                  className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-4 pt-2"
                >
                  [Simular leitura automática de QR Code]
                </button>
              </div>
            )}
          </>
        ) : (
          /* Estado de Resultado da Validação */
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {result.success ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                <h3 className="text-base font-bold text-emerald-400">
                  Cupom Validado!
                </h3>
                <p className="text-xs text-zinc-400 mt-1">{result.message}</p>

                <div className="mt-4 pt-4 border-t border-emerald-500/20 text-left space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Cliente:</span>
                    <span className="font-semibold text-zinc-200">
                      {result.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Item:</span>
                    <span className="font-semibold text-zinc-200">
                      {result.promotionName}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Qtd a entregar:</span>
                    <span className="font-bold text-emerald-400">
                      {result.quantity} un.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                <XCircle className="w-12 h-12 text-rose-400 mx-auto mb-2" />
                <h3 className="text-base font-bold text-rose-400">
                  Falha na Validação
                </h3>
                <p className="text-xs text-zinc-400 mt-1">{result.message}</p>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm rounded-xl transition-all border border-zinc-800"
            >
              Validar outro código
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
