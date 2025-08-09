import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { Produto, ProdutoInsert, ProdutoUpdate } from '@/integrations/supabase/types';

export const useProdutos = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchProdutos = async (): Promise<Produto[]> => {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const { data: produtos = [], isLoading: loading, error } = useQuery({
    queryKey: ['produtos'],
    queryFn: fetchProdutos,
  });

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('produtos-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'produtos' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['produtos'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const adicionarProdutoMutation = useMutation({
    mutationFn: async (produto: ProdutoInsert) => {
      const { data, error } = await supabase
        .from('produtos')
        .insert(produto)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      toast({
        title: "Sucesso",
        description: "Produto adicionado com sucesso!"
      });
    },
    onError: (error: any) => {
      console.error('Erro ao adicionar produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto",
        variant: "destructive"
      });
    }
  });

  const atualizarProdutoMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProdutoUpdate }) => {
      const { data, error } = await supabase
        .from('produtos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso!"
      });
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o produto",
        variant: "destructive"
      });
    }
  });

  const removerProdutoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('produtos')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso!"
      });
    },
    onError: (error: any) => {
      console.error('Erro ao remover produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o produto",
        variant: "destructive"
      });
    }
  });

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('produtos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('produtos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  if (error) {
    toast({
      title: "Erro",
      description: "Não foi possível carregar os produtos",
      variant: "destructive"
    });
  }

  return {
    produtos,
    loading,
    adicionarProduto: adicionarProdutoMutation.mutateAsync,
    atualizarProduto: (id: string, updates: ProdutoUpdate) => 
      atualizarProdutoMutation.mutateAsync({ id, updates }),
    removerProduto: removerProdutoMutation.mutateAsync,
    uploadImage,
    isAdding: adicionarProdutoMutation.isPending,
    isUpdating: atualizarProdutoMutation.isPending,
    isRemoving: removerProdutoMutation.isPending
  };
};

// Export the type for backward compatibility
export type { Produto };