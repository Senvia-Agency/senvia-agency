import { ArrowRight, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const blogPosts = [
  {
    title: "Como Aumentar as Conversões do Seu E-commerce em 2024",
    excerpt: "Descubra as estratégias mais eficazes para otimizar sua loja online e aumentar significativamente suas vendas.",
    date: "15 de Janeiro, 2024",
    author: "Equipa SENVIA",
    category: "E-commerce",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop"
  },
  {
    title: "Tendências de Design Web para 2024",
    excerpt: "Explore as últimas tendências em design web que vão dominar o mercado digital este ano.",
    date: "10 de Janeiro, 2024",
    author: "Equipa SENVIA",
    category: "Design",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=400&fit=crop"
  },
  {
    title: "IA no Marketing Digital: O Futuro é Agora",
    excerpt: "Como a inteligência artificial está revolucionando as estratégias de marketing e vendas online.",
    date: "5 de Janeiro, 2024",
    author: "Equipa SENVIA",
    category: "IA & Marketing",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop"
  },
  {
    title: "SEO Local: Como Dominar as Pesquisas da Sua Região",
    excerpt: "Estratégias comprovadas para aparecer no topo das pesquisas locais e atrair mais clientes da sua área.",
    date: "28 de Dezembro, 2023",
    author: "Equipa SENVIA",
    category: "SEO",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
  },
  {
    title: "Redes Sociais: 10 Dicas para Aumentar o Engagement",
    excerpt: "Táticas práticas para criar conteúdo que gera interação e constrói uma comunidade engajada.",
    date: "20 de Dezembro, 2023",
    author: "Equipa SENVIA",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&h=400&fit=crop"
  },
  {
    title: "Google Ads vs Meta Ads: Qual Escolher?",
    excerpt: "Comparação detalhada entre as duas principais plataformas de publicidade online e quando usar cada uma.",
    date: "15 de Dezembro, 2023",
    author: "Equipa SENVIA",
    category: "Tráfego Pago",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop"
  }
];

const Blog = () => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article 
                key={index}
                className="bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-border/50 hover:border-senvia-500/50 transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
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
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-senvia-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
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