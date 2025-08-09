import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface UserProfile {
  id: string;
  user_id: string;
  revendedor_id?: string;
  role: 'admin' | 'revendedor';
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Buscar sessão atual
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      
      setLoading(false);
    };

    getSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return;
      }

      const normalized: UserProfile = {
        id: data.id,
        user_id: data.user_id,
        revendedor_id: data.revendedor_id ?? undefined,
        role: data.role === 'admin' ? 'admin' : 'revendedor',
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setProfile(normalized);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso"
      });
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const isAdmin = () => profile?.role === 'admin';
  const isReseller = () => profile?.role === 'revendedor';

  return {
    user,
    profile,
    session,
    loading,
    signOut,
    isAdmin,
    isReseller,
    isAuthenticated: !!user
  };
};