import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface NovoPedidoItem {
  produto_id: string;
  codigo: string; // código base do produto (ex: SH001)
  quantidade: number;
  preco_unitario: number;
}

export interface PedidoCriado {
  id: string;
  numero_pedido: string;
  revendedor_id: string;
  total_itens: number;
  valor_total: number;
  data_pedido: string;
  status: string;
}

const gerarNumeroPedido = () => `PED-${Date.now()}`;
const gerarCodigoPeca = (codigoBase: string, index: number) => {
  const suffix = String(Date.now()).slice(-6);
  return `${codigoBase}-${suffix}-${index + 1}`.toUpperCase();
};

export const usePedidos = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const criarPedido = async (
    revendedor_id: string,
    itens: NovoPedidoItem[]
  ): Promise<PedidoCriado> => {
    try {
      setLoading(true);

      if (!revendedor_id || !itens.length) {
        throw new Error('Revendedor e itens são obrigatórios');
      }

      const total_itens = itens.reduce((sum, i) => sum + i.quantidade, 0);
      const valor_total = itens.reduce((sum, i) => sum + i.quantidade * i.preco_unitario, 0);
      const data_pedido = new Date().toISOString().split('T')[0];
      const numero_pedido = gerarNumeroPedido();

      // 1) Criar pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          numero_pedido,
          revendedor_id,
          total_itens,
          valor_total,
          data_pedido,
          status: 'pendente',
        })
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      // 2) Gerar itens no estoque do revendedor (um registro por peça)
      const hoje = data_pedido;
      const estoqueRecords = itens.flatMap((item) => {
        return Array.from({ length: item.quantidade }).map((_, idx) => ({
          revendedor_id,
          produto_id: item.produto_id,
          codigo_peca: gerarCodigoPeca(item.codigo, idx),
          data_compra: hoje,
          preco_compra: item.preco_unitario,
          status: 'disponivel' as const,
        }));
      });

      if (estoqueRecords.length) {
        const { error: estoqueError } = await supabase
          .from('estoque_revendedor')
          .insert(estoqueRecords);
        if (estoqueError) throw estoqueError;
      }

      toast({
        title: 'Pedido criado',
        description: 'Peças adicionadas ao estoque do revendedor com sucesso!'
      });

      return pedido as PedidoCriado;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o pedido',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { criarPedido, loading };
};
