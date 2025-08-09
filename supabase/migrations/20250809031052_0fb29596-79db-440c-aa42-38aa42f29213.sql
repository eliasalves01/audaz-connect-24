-- Create a security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update produtos policies
DROP POLICY IF EXISTS "Produtos são visíveis para todos" ON public.produtos;
DROP POLICY IF EXISTS "Admins podem inserir produtos" ON public.produtos;
DROP POLICY IF EXISTS "Admins podem atualizar produtos" ON public.produtos;
DROP POLICY IF EXISTS "Admins podem deletar produtos" ON public.produtos;

CREATE POLICY "Produtos são visíveis para todos" ON public.produtos
FOR SELECT USING (true);

CREATE POLICY "Admins podem inserir produtos" ON public.produtos
FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins podem atualizar produtos" ON public.produtos
FOR UPDATE USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins podem deletar produtos" ON public.produtos
FOR DELETE USING (public.get_current_user_role() = 'admin');

-- Update revendedores policies  
DROP POLICY IF EXISTS "Revendedores são visíveis para todos" ON public.revendedores;
DROP POLICY IF EXISTS "Admins podem inserir revendedores" ON public.revendedores;
DROP POLICY IF EXISTS "Admins podem atualizar revendedores" ON public.revendedores;
DROP POLICY IF EXISTS "Admins podem deletar revendedores" ON public.revendedores;

CREATE POLICY "Revendedores são visíveis para todos" ON public.revendedores
FOR SELECT USING (true);

CREATE POLICY "Admins podem inserir revendedores" ON public.revendedores
FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins podem atualizar revendedores" ON public.revendedores
FOR UPDATE USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins podem deletar revendedores" ON public.revendedores
FOR DELETE USING (public.get_current_user_role() = 'admin');

-- Update pedidos policies
DROP POLICY IF EXISTS "Pedidos são visíveis conforme acesso" ON public.pedidos;
DROP POLICY IF EXISTS "Admins e revendedores podem ver pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Revendedores podem criar seus pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Admins podem atualizar pedidos" ON public.pedidos;

CREATE POLICY "Admins podem ver todos pedidos" ON public.pedidos
FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Revendedores podem ver seus pedidos" ON public.pedidos
FOR SELECT USING (
  public.get_current_user_role() = 'revendedor' AND 
  revendedor_id = (SELECT revendedor_id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Revendedores podem criar seus pedidos" ON public.pedidos
FOR INSERT WITH CHECK (
  public.get_current_user_role() = 'revendedor' AND 
  revendedor_id = (SELECT revendedor_id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Admins podem atualizar pedidos" ON public.pedidos
FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- Create trigger to update profiles when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, created_at, updated_at)
  VALUES (NEW.id, 'revendedor', NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup  
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();