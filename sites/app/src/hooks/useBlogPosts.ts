
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author_name: string;
  category: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  seo_title?: string;
  seo_description?: string;
  reading_time?: number;
}

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar posts:', error);
        throw error;
      }

      return data as BlogPost[];
    },
  });
};

export const usePublishedBlogPosts = () => {
  return useQuery({
    queryKey: ['published-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar posts publicados:', error);
        throw error;
      }

      return data as BlogPost[];
    },
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postData: Partial<BlogPost>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Gerar slug se não fornecido
      let slug = postData.slug;
      if (!slug && postData.title) {
        const { data: generatedSlug } = await supabase
          .rpc('generate_blog_slug', { title: postData.title });
        slug = generatedSlug;
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          ...postData,
          content: postData.content || '',
          slug,
          created_by: user.id
        } as any])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['published-blog-posts'] });
      toast({
        title: "Sucesso!",
        description: "Post criado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar post:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar post. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...postData }: Partial<BlogPost> & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['published-blog-posts'] });
      toast({
        title: "Sucesso!",
        description: "Post atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar post:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar post. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['published-blog-posts'] });
      toast({
        title: "Sucesso!",
        description: "Post deletado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar post:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar post. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};
