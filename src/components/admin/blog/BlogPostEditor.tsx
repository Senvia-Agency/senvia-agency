
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { BlogPost, useCreateBlogPost, useUpdateBlogPost } from "@/hooks/useBlogPosts";

interface BlogPostEditorProps {
  isOpen: boolean;
  onClose: () => void;
  post?: BlogPost | null;
}

const BlogPostEditor = ({ isOpen, onClose, post }: BlogPostEditorProps) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Marketing Digital',
    status: 'draft' as 'draft' | 'published' | 'archived',
    featured_image: '',
    seo_title: '',
    seo_description: '',
    author_name: 'Equipa SENVIA',
    reading_time: 5
  });
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content,
        category: post.category,
        status: post.status,
        featured_image: post.featured_image || '',
        seo_title: post.seo_title || '',
        seo_description: post.seo_description || '',
        author_name: post.author_name,
        reading_time: post.reading_time || 5
      });
      setTags(post.tags || []);
    } else {
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'Marketing Digital',
        status: 'draft',
        featured_image: '',
        seo_title: '',
        seo_description: '',
        author_name: 'Equipa SENVIA',
        reading_time: 5
      });
      setTags([]);
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      tags,
      published_at: formData.status === 'published' ? new Date().toISOString() : null
    };

    if (post) {
      await updatePost.mutateAsync({ id: post.id, ...postData });
    } else {
      await createPost.mutateAsync(postData);
    }

    onClose();
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const categories = [
    'Marketing Digital',
    'E-commerce',
    'Design',
    'IA & Marketing', 
    'SEO',
    'Social Media',
    'Tráfego Pago',
    'Desenvolvimento Web',
    'Estratégia Digital'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {post ? 'Editar Post' : 'Criar Novo Post'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-white">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-white">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-white hover:bg-gray-600">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt" className="text-white">Resumo</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-white">Conteúdo</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              rows={10}
              required
            />
          </div>

          <div>
            <Label htmlFor="featured_image" className="text-white">Imagem Destacada (URL)</Label>
            <Input
              id="featured_image"
              value={formData.featured_image}
              onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label className="text-white">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-senvia-500 text-white">
                  {tag}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Nova tag"
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status" className="text-white">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'draft' | 'published' | 'archived') => setFormData({...formData, status: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="draft" className="text-white hover:bg-gray-600">Rascunho</SelectItem>
                  <SelectItem value="published" className="text-white hover:bg-gray-600">Publicado</SelectItem>
                  <SelectItem value="archived" className="text-white hover:bg-gray-600">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="author" className="text-white">Autor</Label>
              <Input
                id="author"
                value={formData.author_name}
                onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="reading_time" className="text-white">Tempo de Leitura (min)</Label>
              <Input
                id="reading_time"
                type="number"
                value={formData.reading_time}
                onChange={(e) => setFormData({...formData, reading_time: parseInt(e.target.value) || 5})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seo_title" className="text-white">Título SEO</Label>
              <Input
                id="seo_title"
                value={formData.seo_title}
                onChange={(e) => setFormData({...formData, seo_title: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="seo_description" className="text-white">Descrição SEO</Label>
              <Textarea
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) => setFormData({...formData, seo_description: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-senvia-500 hover:bg-senvia-600"
              disabled={createPost.isPending || updatePost.isPending}
            >
              {createPost.isPending || updatePost.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostEditor;
