/*
  # Fix RLS policies for proper admin/reseller access control

  1. Security Updates
    - Fix RLS policies to properly check admin role from profiles table
    - Ensure estoque_revendedor is restricted to logged-in reseller
    - Add proper admin checks for produtos, revendedores, professores, pedidos

  2. Changes
    - Update all "true" policies to check profiles.role = 'admin'
    - Fix estoque_revendedor policies to use authenticated user's revendedor_id
    - Add missing profiles table foreign key constraint
*/

-- Add missing foreign key constraint for profiles.user_id -> auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_user_id_fkey' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Drop existing policies that use "true"
DROP POLICY IF EXISTS "Apenas admins podem atualizar produtos" ON produtos;
DROP POLICY IF EXISTS "Apenas admins podem deletar produtos" ON produtos;
DROP POLICY IF EXISTS "Apenas admins podem inserir produtos" ON produtos;

DROP POLICY IF EXISTS "Apenas admins podem atualizar revendedores" ON revendedores;
DROP POLICY IF EXISTS "Apenas admins podem deletar revendedores" ON revendedores;
DROP POLICY IF EXISTS "Apenas admins podem inserir revendedores" ON revendedores;

DROP POLICY IF EXISTS "Apenas admins podem atualizar professores" ON professores;
DROP POLICY IF EXISTS "Apenas admins podem inserir professores" ON professores;

DROP POLICY IF EXISTS "Pedidos podem ser atualizados" ON pedidos;
DROP POLICY IF EXISTS "Revendedores podem criar pedidos" ON pedidos;

DROP POLICY IF EXISTS "Itens podem ser inseridos em pedidos" ON itens_pedido;

-- Create proper admin policies for produtos
CREATE POLICY "Admins podem inserir produtos"
  ON produtos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins podem atualizar produtos"
  ON produtos
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins podem deletar produtos"
  ON produtos
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create proper admin policies for revendedores
CREATE POLICY "Admins podem inserir revendedores"
  ON revendedores
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins podem atualizar revendedores"
  ON revendedores
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins podem deletar revendedores"
  ON revendedores
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create proper admin policies for professores
CREATE POLICY "Admins podem inserir professores"
  ON professores
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins podem atualizar professores"
  ON professores
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create proper policies for pedidos
CREATE POLICY "Admins e revendedores podem ver pedidos"
  ON pedidos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND (
        profiles.role = 'admin' 
        OR (profiles.role = 'revendedor' AND profiles.revendedor_id = pedidos.revendedor_id)
      )
    )
  );

CREATE POLICY "Admins podem atualizar pedidos"
  ON pedidos
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Revendedores podem criar seus pedidos"
  ON pedidos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.revendedor_id = pedidos.revendedor_id
    )
  );

-- Create proper policies for itens_pedido
CREATE POLICY "Admins e revendedores podem ver itens de pedido"
  ON itens_pedido
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN pedidos pd ON pd.id = itens_pedido.pedido_id
      WHERE p.user_id = auth.uid() 
      AND (
        p.role = 'admin' 
        OR (p.role = 'revendedor' AND p.revendedor_id = pd.revendedor_id)
      )
    )
  );

CREATE POLICY "Revendedores podem inserir itens em seus pedidos"
  ON itens_pedido
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN pedidos pd ON pd.id = itens_pedido.pedido_id
      WHERE p.user_id = auth.uid() 
      AND p.revendedor_id = pd.revendedor_id
    )
  );

-- Fix estoque_revendedor policies to use proper user authentication
DROP POLICY IF EXISTS "Revendedores autenticados podem ver seu próprio estoque" ON estoque_revendedor;
DROP POLICY IF EXISTS "Revendedores autenticados podem inserir em seu estoque" ON estoque_revendedor;
DROP POLICY IF EXISTS "Revendedores autenticados podem atualizar seu estoque" ON estoque_revendedor;

CREATE POLICY "Admins e revendedores podem ver estoque"
  ON estoque_revendedor
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND (
        profiles.role = 'admin' 
        OR (profiles.role = 'revendedor' AND profiles.revendedor_id = estoque_revendedor.revendedor_id)
      )
    )
  );

CREATE POLICY "Admins podem inserir no estoque"
  ON estoque_revendedor
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins e revendedores podem atualizar estoque"
  ON estoque_revendedor
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND (
        profiles.role = 'admin' 
        OR (profiles.role = 'revendedor' AND profiles.revendedor_id = estoque_revendedor.revendedor_id)
      )
    )
  );

-- Enable realtime for key tables
ALTER TABLE produtos REPLICA IDENTITY FULL;
ALTER TABLE pedidos REPLICA IDENTITY FULL;
ALTER TABLE estoque_revendedor REPLICA IDENTITY FULL;

-- Create realtime publication
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE produtos;
ALTER PUBLICATION supabase_realtime ADD TABLE pedidos;
ALTER PUBLICATION supabase_realtime ADD TABLE estoque_revendedor;
ALTER PUBLICATION supabase_realtime ADD TABLE itens_pedido;