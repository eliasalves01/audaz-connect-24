import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  tamanho?: string;
  preco: number;
  imagem_url?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useProdutos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const adicionarProduto = async (produto: Omit<Produto, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .insert(produto)
        .select()
        .single();

      if (error) throw error;
      
      setProdutos(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Produto adicionado com sucesso!"
      });
      return data;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto",
        variant: "destructive"
      });
      throw error;
    }
  };

  const atualizarProduto = async (id: string, updates: Partial<Produto>) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProdutos(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso!"
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o produto",
        variant: "destructive"
      });
      throw error;
    }
  };

  const removerProduto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('produtos')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;
      
      setProdutos(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o produto",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return {
    produtos,
    loading,
    adicionarProduto,
    atualizarProduto,
    removerProduto,
    refetch: fetchProdutos
  };
};