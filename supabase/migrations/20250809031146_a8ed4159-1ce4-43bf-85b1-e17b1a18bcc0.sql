-- Fix the remaining function with search_path
CREATE OR REPLACE FUNCTION public.create_admin_profile(admin_email text, admin_password text)
RETURNS JSON 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_user_id uuid;
  result json;
BEGIN
  -- Esta função deve ser executada por um super admin via SQL Editor
  -- Não pode ser chamada via API por questões de segurança
  
  -- Criar usuário no auth.users (isso normalmente seria feito via signUp)
  -- Inserir diretamente o perfil de admin
  INSERT INTO public.profiles (user_id, role, created_at, updated_at)
  VALUES (
    -- Você deve substituir este UUID pelo user_id real do usuário criado via Auth
    gen_random_uuid(), -- SUBSTITUA pelo user_id real
    'admin',
    now(),
    now()
  );
  
  result := json_build_object(
    'success', true,
    'message', 'Perfil de admin criado. Lembre-se de usar o user_id correto.'
  );
  
  RETURN result;
END;
$$;