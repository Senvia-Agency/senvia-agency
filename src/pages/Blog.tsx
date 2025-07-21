
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePublishedBlogPosts } from "@/hooks/useBlogPosts";


const Blog = () => {
  const { data: posts, isLoading } = usePublishedBlogPosts();

  return (
    <div className="min-h-screen">
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-background to-senvia-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Blog SENVIA</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Insights, dicas e estratégias para impulsionar o seu negócio digital. 
              Mantenha-se atualizado com as últimas tendências do marketing e tecnologia.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">Carregando artigos...</div>
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article 
                  key={post.id}
                  className="bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-border/50 hover:border-senvia-500/50 transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.featured_image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-senvia-500/90 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.published_at || post.created_at).toLocaleDateString('pt-PT', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author_name}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-senvia-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {post.reading_time && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                        <Clock className="w-3 h-3" />
                        {post.reading_time} min de leitura
                      </div>
                    )}

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-senvia-500/20 text-senvia-400 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <Link 
                      to="#" 
                      className="inline-flex items-center gap-2 text-senvia-500 font-medium hover:gap-3 transition-all duration-300"
                    >
                      Ler Mais
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">Nenhum artigo publicado ainda.</div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-gradient">Mantenha-se Atualizado</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Receba as nossas últimas dicas e insights diretamente no seu email.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-senvia-500/50"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-senvia-500 to-senvia-400 text-white font-medium rounded-xl hover:from-senvia-400 hover:to-senvia-300 transition-all duration-300">
                Subscrever
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
