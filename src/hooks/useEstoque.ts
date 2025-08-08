import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface EstoqueItem {
  id: string;
  revendedor_id: string;
  produto_id: string;
  codigo_peca: string;
  cor?: string;
  data_compra: string;
  data_venda?: string;
  preco_compra: number;
  preco_venda?: number;
  status: 'disponivel' | 'vendido' | 'reservado';
  observacoes?: string;
  created_at: string;
  updated_at: string;
  // Dados do produto relacionado
  produto?: {
    codigo: string;
    nome: string;
    categoria: string;
    tamanho?: string;
    preco: number;
    imagem_url?: string;
  };
  // Dados do revendedor relacionado
  revendedor?: {
    nome: string;
    email: string;
  };
}

export const useEstoque = (revendedorId?: string) => {
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEstoque = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('estoque_revendedor')
        .select(`
          *,
          produto:produtos(*),
          revendedor:revendedores(nome, email)
        `)
        .order('created_at', { ascending: false });

      if (revendedorId) {
        query = query.eq('revendedor_id', revendedorId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEstoque((data || []) as EstoqueItem[]);
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o estoque",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const adicionarItem = async (item: Omit<EstoqueItem, 'id' | 'created_at' | 'updated_at' | 'produto' | 'revendedor'>) => {
    try {
      const { data, error } = await supabase
        .from('estoque_revendedor')
        .insert(item)
        .select(`
          *,
          produto:produtos(*),
          revendedor:revendedores(nome, email)
        `)
        .single();

      if (error) throw error;
      
      setEstoque(prev => [data as EstoqueItem, ...prev]);
      toast({
        title: "Sucesso",
        description: "Item adicionado ao estoque!"
      });
      return data;
    } catch (error) {
      console.error('Erro ao adicionar item ao estoque:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item ao estoque",
        variant: "destructive"
      });
      throw error;
    }
  };

  const marcarComoVendido = async (id: string, precoVenda: number) => {
    try {
      const { data, error } = await supabase
        .from('estoque_revendedor')
        .update({
          status: 'vendido',
          data_venda: new Date().toISOString().split('T')[0],
          preco_venda: precoVenda
        })
        .eq('id', id)
        .select(`
          *,
          produto:produtos(*),
          revendedor:revendedores(nome, email)
        `)
        .single();

      if (error) throw error;
      
      setEstoque(prev => prev.map(item => item.id === id ? data as EstoqueItem : item));
      toast({
        title: "Sucesso",
        description: "Item marcado como vendido!"
      });
      return data;
    } catch (error) {
      console.error('Erro ao marcar item como vendido:', error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar o item como vendido",
        variant: "destructive"
      });
      throw error;
    }
  };

  const buscarPorCodigo = async (codigo: string) => {
    try {
      const { data, error } = await supabase
        .from('estoque_revendedor')
        .select(`
          *,
          produto:produtos(*),
          revendedor:revendedores(nome, email)
        `)
        .eq('codigo_peca', codigo)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Não encontrado
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar item por código:', error);
      throw error;
    }
  };

  const getEstatisticas = () => {
    const total = estoque.length;
    const disponiveis = estoque.filter(item => item.status === 'disponivel').length;
    const vendidos = estoque.filter(item => item.status === 'vendido').length;
    const reservados = estoque.filter(item => item.status === 'reservado').length;
    
    const valorTotalCompra = estoque.reduce((acc, item) => acc + item.preco_compra, 0);
    const valorTotalVenda = estoque
      .filter(item => item.status === 'vendido' && item.preco_venda)
      .reduce((acc, item) => acc + (item.preco_venda || 0), 0);

    return {
      total,
      disponiveis,
      vendidos,
      reservados,
      valorTotalCompra,
      valorTotalVenda
    };
  };

  useEffect(() => {
    fetchEstoque();
  }, [revendedorId]);

  return {
    estoque,
    loading,
    adicionarItem,
    marcarComoVendido,
    buscarPorCodigo,
    getEstatisticas,
    refetch: fetchEstoque
  };
};