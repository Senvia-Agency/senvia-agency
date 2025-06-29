
-- Criar tabela para artigos do blog
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_name TEXT NOT NULL DEFAULT 'Equipa SENVIA',
  category TEXT NOT NULL DEFAULT 'Marketing Digital',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  reading_time INTEGER DEFAULT 5
);

-- Adicionar RLS à tabela de posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Política para admins poderem ver todos os posts
CREATE POLICY "Admins can view all blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Política para admins poderem inserir posts
CREATE POLICY "Admins can insert blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

-- Política para admins poderem atualizar posts
CREATE POLICY "Admins can update blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Política para admins poderem deletar posts
CREATE POLICY "Admins can delete blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Política para posts publicados serem visíveis publicamente
CREATE POLICY "Published posts are publicly visible" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');

-- Trigger para atualizar updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para gerar slug automaticamente
CREATE OR REPLACE FUNCTION public.generate_blog_slug(title TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Converter título para slug
  base_slug := lower(trim(title));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(base_slug, '-');
  
  final_slug := base_slug;
  
  -- Verificar se slug já existe e adicionar número se necessário
  WHILE EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

-- Inserir alguns posts de exemplo baseados nos dados existentes
INSERT INTO public.blog_posts (title, slug, excerpt, content, category, status, published_at, created_by) VALUES
('Como Aumentar as Conversões do Seu E-commerce em 2024', 
 'como-aumentar-conversoes-ecommerce-2024',
 'Descubra as estratégias mais eficazes para otimizar sua loja online e aumentar significativamente suas vendas.',
 'Conteúdo completo do artigo sobre conversões de e-commerce...',
 'E-commerce',
 'published',
 '2024-01-15 10:00:00+00',
 (SELECT user_id FROM public.profiles WHERE role = 'admin' LIMIT 1)),

('Tendências de Design Web para 2024',
 'tendencias-design-web-2024', 
 'Explore as últimas tendências em design web que vão dominar o mercado digital este ano.',
 'Conteúdo completo do artigo sobre design web...',
 'Design',
 'published',
 '2024-01-10 10:00:00+00',
 (SELECT user_id FROM public.profiles WHERE role = 'admin' LIMIT 1)),

('IA no Marketing Digital: O Futuro é Agora',
 'ia-marketing-digital-futuro',
 'Como a inteligência artificial está revolucionando as estratégias de marketing e vendas online.',
 'Conteúdo completo do artigo sobre IA no marketing...',
 'IA & Marketing',
 'published',
 '2024-01-05 10:00:00+00',
 (SELECT user_id FROM public.profiles WHERE role = 'admin' LIMIT 1));
