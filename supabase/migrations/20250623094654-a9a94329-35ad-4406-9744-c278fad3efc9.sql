
-- Adicionar colunas para nome completo e data de nascimento na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Atualizar a função que cria perfis automaticamente para incluir o nome completo dos metadados
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;
