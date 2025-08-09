import { customAlphabet } from 'nanoid';

// Gerar códigos únicos sem caracteres ambíguos
const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8);

export const useCodeGenerator = () => {
  const gerarCodigoPeca = (codigoBase: string): string => {
    const sufixo = nanoid();
    return `${codigoBase}-${sufixo}`;
  };

  const gerarNumeroPedido = (): string => {
    const timestamp = Date.now().toString().slice(-8);
    const sufixo = nanoid(4);
    return `PED-${timestamp}-${sufixo}`;
  };

  return {
    gerarCodigoPeca,
    gerarNumeroPedido
  };
};