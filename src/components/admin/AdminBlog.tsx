
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Search, Plus, Eye, Edit, Calendar, User } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import BlogPostEditor from "./blog/BlogPostEditor";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminBlog = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { data: posts, isLoading, refetch } = useBlogPosts();

  const filteredPosts = posts?.filter(post => {
    return post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           post.content?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreatePost = () => {
    setSelectedPost(null);
    setIsCreating(true);
    setIsEditorOpen(true);
  };

  const handleEditPost = (post: any) => {
    setSelectedPost(post);
    setIsCreating(false);
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setSelectedPost(null);
    setIsCreating(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        <div className="text-center py-8 text-gray-400">
          Carregando posts...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6 w-full max-w-full overflow-x-hidden">
      {/* Header - Mobile Optimized */}
      <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-3xl font-bold mb-1 lg:mb-2 truncate">Gestão do Blog</h1>
          <p className="text-sm lg:text-base text-gray-400 truncate">Gerencie todos os posts do blog</p>
        </div>
        <div className="flex items-center justify-between lg:justify-end gap-2">
          <Button 
            onClick={handleCreatePost}
            className="bg-senvia-500 hover:bg-senvia-600 text-white text-xs lg:text-sm px-3 py-2 flex-shrink-0"
          >
            <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
            Novo Post
          </Button>
          <Badge 
            variant="outline" 
            className="text-blue-500 border-blue-500/50 bg-blue-500/10 text-xs lg:text-sm px-2 py-1 flex-shrink-0"
          >
            {filteredPosts?.length || 0} posts
          </Badge>
        </div>
      </div>

      {/* Search - Mobile Optimized */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardContent className="p-3 lg:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar posts por título ou conteúdo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600/50 text-white text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Posts */}
      <div className="space-y-3 lg:space-y-4">
        {filteredPosts?.map((post) => (
          <Card 
            key={post.id}
            className="bg-slate-800/80 border-slate-600/50 hover:border-slate-500/50 transition-all cursor-pointer hover:bg-slate-750/80"
            onClick={() => handleEditPost(post)}
          >
            <CardContent className="p-4 lg:p-6">
              {/* Mobile-First Layout */}
              <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
                {/* Main Info */}
                <div className="min-w-0 flex-1 space-y-2 lg:space-y-3">
                  {/* Title and Status */}
                  <div className="flex items-start gap-2 lg:gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-sm lg:text-lg truncate">
                        {post.title || 'Título não informado'}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs lg:text-sm text-slate-400 mt-1 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs flex-shrink-0 px-2 py-0.5 ${
                        post.published 
                          ? 'border-green-500/50 text-green-400 bg-green-500/10' 
                          : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                      }`}
                    >
                      {post.published ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </div>
                  
                  {/* Meta Info - Stack on Mobile */}
                  <div className="space-y-1 lg:space-y-0 lg:flex lg:items-center lg:gap-4 text-xs lg:text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                      <span>Admin</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                      <span>{format(new Date(post.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>

                    {post.tags && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {post.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs px-1.5 py-0.5 bg-slate-700/50 text-slate-300"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-slate-500">+{post.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button - Right aligned on desktop */}
                <div className="flex justify-start lg:justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 text-xs lg:text-sm px-3 py-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPost(post);
                    }}
                  >
                    <Edit className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(!filteredPosts || filteredPosts.length === 0) && (
        <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
          <CardContent className="text-center py-8 lg:py-12">
            <FileText className="h-8 w-8 lg:h-12 lg:w-12 text-slate-500 mx-auto mb-3 lg:mb-4" />
            <h3 className="text-base lg:text-lg font-medium text-white mb-2">Nenhum post encontrado</h3>
            <p className="text-sm lg:text-base text-slate-400">
              {searchTerm ? 'Ajuste os filtros de busca.' : 'Crie seu primeiro post para começar.'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={handleCreatePost}
                className="mt-4 bg-senvia-500 hover:bg-senvia-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Post
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Editor Modal */}
      <BlogPostEditor
        post={selectedPost}
        isOpen={isEditorOpen}
        onClose={handleEditorClose}
        isCreating={isCreating}
      />
    </div>
  );
};

export default AdminBlog;
