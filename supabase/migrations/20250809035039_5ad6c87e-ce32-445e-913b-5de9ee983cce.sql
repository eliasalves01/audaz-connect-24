-- Corrigir políticas RLS para pedidos
-- Remover políticas existentes
DROP POLICY IF EXISTS "Admins podem ver todos pedidos" ON pedidos;
DROP POLICY IF EXISTS "Revendedores podem ver seus pedidos" ON pedidos;
DROP POLICY IF EXISTS "Revendedores podem criar seus pedidos" ON pedidos;
DROP POLICY IF EXISTS "Admins podem atualizar pedidos" ON pedidos;

-- Criar novas políticas corretas
-- Admins podem ver todos os pedidos
CREATE POLICY "Admins podem ver todos pedidos" 
ON pedidos FOR SELECT 
USING (get_current_user_role() = 'admin');

-- Revendedores podem ver apenas seus pedidos
CREATE POLICY "Revendedores podem ver seus pedidos" 
ON pedidos FOR SELECT 
USING (
  get_current_user_role() = 'revendedor' AND 
  revendedor_id = (SELECT revendedor_id FROM profiles WHERE user_id = auth.uid())
);

-- ADMINS podem criar pedidos para qualquer revendedor
CREATE POLICY "Admins podem criar pedidos" 
ON pedidos FOR INSERT 
WITH CHECK (get_current_user_role() = 'admin');

-- Revendedores podem criar apenas seus próprios pedidos
CREATE POLICY "Revendedores podem criar seus pedidos" 
ON pedidos FOR INSERT 
WITH CHECK (
  get_current_user_role() = 'revendedor' AND 
  revendedor_id = (SELECT revendedor_id FROM profiles WHERE user_id = auth.uid())
);

-- Admins podem atualizar todos os pedidos
CREATE POLICY "Admins podem atualizar pedidos" 
ON pedidos FOR UPDATE 
USING (get_current_user_role() = 'admin');

-- Revendedores podem atualizar apenas seus pedidos
CREATE POLICY "Revendedores podem atualizar seus pedidos" 
ON pedidos FOR UPDATE 
USING (
  get_current_user_role() = 'revendedor' AND 
  revendedor_id = (SELECT revendedor_id FROM profiles WHERE user_id = auth.uid())
);