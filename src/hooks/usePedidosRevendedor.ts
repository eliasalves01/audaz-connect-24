import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface PedidoRevendedor {
  id: string;
  numero_pedido: string;
  total_itens: number;
  valor_total: number;
  data_pedido: string;
  status: string;
  created_at: string;
}

export const usePedidosRevendedor = (revendedorId?: string) => {
  const [pedidos, setPedidos] = useState<PedidoRevendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPedidos = async () => {
    if (!revendedorId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('revendedor_id', revendedorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPedidos((data || []) as PedidoRevendedor[]);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pedidos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [revendedorId]);

  // Configurar atualizações em tempo real
  useEffect(() => {
    if (!revendedorId) return;

    const channel = supabase
      .channel('pedidos-revendedor')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pedidos',
          filter: `revendedor_id=eq.${revendedorId}`
        },
        (payload) => {
          console.log('Novo pedido recebido:', payload);
          setPedidos(prev => [payload.new as PedidoRevendedor, ...prev]);
          toast({
            title: "Novo pedido recebido!",
            description: `Pedido ${(payload.new as any).numero_pedido} foi criado`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pedidos',
          filter: `revendedor_id=eq.${revendedorId}`
        },
        (payload) => {
          console.log('Pedido atualizado:', payload);
          setPedidos(prev => prev.map(pedido => 
            pedido.id === (payload.new as any).id 
              ? payload.new as PedidoRevendedor 
              : pedido
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [revendedorId]);

  return {
    pedidos,
    loading,
    refetch: fetchPedidos
  };
};