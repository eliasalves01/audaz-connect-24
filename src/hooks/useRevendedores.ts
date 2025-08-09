import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Revendedor {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useRevendedores = () => {
  const [revendedores, setRevendedores] = useState<Revendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRevendedores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('revendedores')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setRevendedores(data || []);
    } catch (error) {
      console.error('Erro ao buscar revendedores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os revendedores",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const adicionarRevendedor = async (revendedor: Omit<Revendedor, 'id' | 'created_at' | 'updated_at'> & { senha?: string }) => {
    try {
      // Se tem senha, criar usuário no Auth
      if (revendedor.senha) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: revendedor.email,
          password: revendedor.senha,
          options: {
            data: {
              nome: revendedor.nome,
              role: 'revendedor'
            }
          }
        });

        if (authError) {
          toast({
            title: "Erro",
            description: "Não foi possível criar o usuário de acesso",
            variant: "destructive"
          });
          throw authError;
        }

        // Remover senha do objeto antes de inserir na tabela revendedores
        const { senha, ...revendedorData } = revendedor;
        const { data, error } = await supabase
          .from('revendedores')
          .insert({ ...revendedorData, user_id: authData.user?.id })
          .select()
          .single();

        if (error) throw error;
        
        setRevendedores(prev => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)));
        toast({
          title: "Sucesso",
          description: "Revendedor e usuário criados com sucesso!"
        });
        return data;
      } else {
        // Apenas inserir revendedor sem criar usuário
        const { data, error } = await supabase
          .from('revendedores')
          .insert(revendedor)
          .select()
          .single();

        if (error) throw error;
        
        setRevendedores(prev => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)));
        toast({
          title: "Sucesso",
          description: "Revendedor adicionado com sucesso!"
        });
        return data;
      }
    } catch (error) {
      console.error('Erro ao adicionar revendedor:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o revendedor",
        variant: "destructive"
      });
      throw error;
    }
  };

  const atualizarRevendedor = async (id: string, updates: Partial<Revendedor>) => {
    try {
      const { data, error } = await supabase
        .from('revendedores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setRevendedores(prev => prev.map(r => r.id === id ? data : r).sort((a, b) => a.nome.localeCompare(b.nome)));
      toast({
        title: "Sucesso",
        description: "Revendedor atualizado com sucesso!"
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar revendedor:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o revendedor",
        variant: "destructive"
      });
      throw error;
    }
  };

  const removerRevendedor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('revendedores')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;
      
      setRevendedores(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Sucesso",
        description: "Revendedor removido com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao remover revendedor:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o revendedor",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchRevendedores();
  }, []);

  return {
    revendedores,
    loading,
    adicionarRevendedor,
    atualizarRevendedor,
    removerRevendedor,
    refetch: fetchRevendedores
  };
};