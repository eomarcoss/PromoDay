import * as crypto from 'crypto';

/**
 * Gera um código legível com o prefixo 'PD-' e 6 caracteres alfanuméricos em caixa alta.
 * Exemplo de retorno: PD-8A2F9B
 */
export function generateClaimCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const randomBytes = crypto.randomBytes(6);

  for (let i = 0; i < 6; i++) {
    result += chars[randomBytes[i] % chars.length];
  }

  return `PD-${result}`;
}
