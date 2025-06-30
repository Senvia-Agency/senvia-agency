
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Calendar,
  User,
  Tag,
  FileText
} from "lucide-react";
import { useBlogPosts, useDeleteBlogPost, BlogPost } from "@/hooks/useBlogPosts";
import BlogPostEditor from "./blog/BlogPostEditor";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const AdminBlog = () => {
  const { data: posts, isLoading } = useBlogPosts();
  const deletePost = useDeleteBlogPost();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleNewPost = () => {
    setSelectedPost(null);
    setIsEditorOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsEditorOpen(true);
  };

  const handleDeletePost = async (id: string) => {
    await deletePost.mutateAsync(id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Rascunho';
      case 'archived': return 'Arquivado';
      default: return status;
    }
  };

  const categories = [...new Set(posts?.map(post => post.category) || [])];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Carregando posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight break-words">
            Gestão de<br className="sm:hidden" /> Blog
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-1 break-words">
            Gerencie os artigos<br className="sm:hidden" /> do seu blog
          </p>
        </div>
        <Button 
          onClick={handleNewPost}
          className="bg-senvia-500 hover:bg-senvia-600 w-full sm:w-auto flex-shrink-0 whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Novo Post</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center">
              <FileText className="h-6 w-6 md:h-8 md:w-8 text-senvia-500" />
              <div className="ml-2 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-400">Total de Posts</p>
                <p className="text-lg md:text-2xl font-bold text-white">{posts?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center">
              <Eye className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
              <div className="ml-2 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-400">Publicados</p>
                <p className="text-lg md:text-2xl font-bold text-white">
                  {posts?.filter(p => p.status === 'published').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center">
              <Edit className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
              <div className="ml-2 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-400">Rascunhos</p>
                <p className="text-lg md:text-2xl font-bold text-white">
                  {posts?.filter(p => p.status === 'draft').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center">
              <Tag className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
              <div className="ml-2 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-400">Categorias</p>
                <p className="text-lg md:text-2xl font-bold text-white">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-3 md:p-4">
          <div className="space-y-3 md:space-y-0 md:flex md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Pesquisar posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:flex md:gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-600">Todos os Status</SelectItem>
                  <SelectItem value="published" className="text-white hover:bg-gray-600">Publicados</SelectItem>
                  <SelectItem value="draft" className="text-white hover:bg-gray-600">Rascunhos</SelectItem>
                  <SelectItem value="archived" className="text-white hover:bg-gray-600">Arquivados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-600">Todas as Categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-gray-600">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-3 md:space-y-4">
        {filteredPosts?.map((post) => (
          <Card key={post.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-bold text-white line-clamp-1">{post.title}</h3>
                    <Badge className={`${getStatusColor(post.status)} text-white text-xs w-fit`}>
                      {getStatusLabel(post.status)}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-400 mb-3 line-clamp-2 text-sm md:text-base">{post.excerpt}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                      <span className="truncate">{post.author_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                      <span>{new Date(post.created_at).toLocaleDateString('pt-PT')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                      <span className="truncate">{post.category}</span>
                    </div>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 md:gap-2 mt-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 justify-end lg:justify-start lg:ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPost(post)}
                    className="flex-shrink-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-800 border-gray-700 mx-4">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeletePost(post.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts?.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 md:p-8 text-center">
            <FileText className="w-8 h-8 md:w-12 md:h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum post encontrado.</p>
          </CardContent>
        </Card>
      )}

      {/* Blog Post Editor */}
      <BlogPostEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        post={selectedPost}
      />
    </div>
  );
};

export default AdminBlog;
