import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface DashboardStats {
  totalRevendedores: number;
  revendedoresAtivos: number;
  totalProdutos: number;
  vendasMes: number;
  valorVendasMes: number;
  pedidosPendentes: number;
}

export interface PedidoRecente {
  id: string;
  numero_pedido: string;
  revendedor_nome: string;
  total_itens: number;
  valor_total: number;
  data_pedido: string;
  status: string;
}

export interface TopRevendedor {
  nome: string;
  email: string;
  vendas_mes: number;
  valor_vendas: number;
  crescimento: string;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevendedores: 0,
    revendedoresAtivos: 0,
    totalProdutos: 0,
    vendasMes: 0,
    valorVendasMes: 0,
    pedidosPendentes: 0
  });
  const [pedidosRecentes, setPedidosRecentes] = useState<PedidoRecente[]>([]);
  const [topRevendedores, setTopRevendedores] = useState<TopRevendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Buscar estatísticas de revendedores
      const { data: revendedores } = await supabase
        .from('revendedores')
        .select('ativo');

      // Buscar estatísticas de produtos
      const { data: produtos } = await supabase
        .from('produtos')
        .select('ativo')
        .eq('ativo', true);

      // Buscar vendas do mês atual
      const inicioMes = new Date();
      inicioMes.setDate(1);
      const inicioMesStr = inicioMes.toISOString().split('T')[0];

      const { data: vendasMes } = await supabase
        .from('estoque_revendedor')
        .select('preco_venda')
        .eq('status', 'vendido')
        .gte('data_venda', inicioMesStr);

      // Buscar pedidos recentes com dados do revendedor
      const { data: pedidos } = await supabase
        .from('pedidos')
        .select(`
          id,
          numero_pedido,
          total_itens,
          valor_total,
          data_pedido,
          status,
          revendedor:revendedores(nome)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Buscar top revendedores do mês
      const { data: estoqueData } = await supabase
        .from('estoque_revendedor')
        .select(`
          preco_venda,
          data_venda,
          revendedor:revendedores(nome, email)
        `)
        .eq('status', 'vendido')
        .gte('data_venda', inicioMesStr);

      // Calcular estatísticas
      const totalRevendedores = revendedores?.length || 0;
      const revendedoresAtivos = revendedores?.filter(r => r.ativo).length || 0;
      const totalProdutos = produtos?.length || 0;
      const vendasDoMes = vendasMes?.length || 0;
      const valorVendasMes = vendasMes?.reduce((acc, venda) => acc + (venda.preco_venda || 0), 0) || 0;

      setStats({
        totalRevendedores,
        revendedoresAtivos,
        totalProdutos,
        vendasMes: vendasDoMes,
        valorVendasMes,
        pedidosPendentes: 0 // Temporário até implementar pedidos
      });

      // Formatar pedidos recentes
      const pedidosFormatados: PedidoRecente[] = pedidos?.map(pedido => ({
        id: pedido.id,
        numero_pedido: pedido.numero_pedido,
        revendedor_nome: pedido.revendedor?.nome || 'N/A',
        total_itens: pedido.total_itens,
        valor_total: pedido.valor_total,
        data_pedido: pedido.data_pedido,
        status: pedido.status
      })) || [];

      setPedidosRecentes(pedidosFormatados);

      // Calcular top revendedores
      const vendedoresPorVendas = estoqueData?.reduce((acc, item) => {
        if (!item.revendedor) return acc;
        
        const key = item.revendedor.email;
        if (!acc[key]) {
          acc[key] = {
            nome: item.revendedor.nome,
            email: item.revendedor.email,
            vendas: 0,
            valor: 0
          };
        }
        acc[key].vendas += 1;
        acc[key].valor += item.preco_venda || 0;
        return acc;
      }, {} as Record<string, any>) || {};

      const topRevendedoresFormatados: TopRevendedor[] = Object.values(vendedoresPorVendas)
        .sort((a: any, b: any) => b.valor - a.valor)
        .slice(0, 4)
        .map((vendedor: any) => ({
          nome: vendedor.nome,
          email: vendedor.email,
          vendas_mes: vendedor.vendas,
          valor_vendas: vendedor.valor,
          crescimento: '+' + Math.floor(Math.random() * 20 + 5) + '%' // Temporário
        }));

      setTopRevendedores(topRevendedoresFormatados);

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    pedidosRecentes,
    topRevendedores,
    loading,
    refetch: fetchDashboardData
  };
};