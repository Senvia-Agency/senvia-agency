import { ArrowRight, Globe, Smartphone, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Websites = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-background to-senvia-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Websites & Páginas Web</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Criamos websites modernos, responsivos e otimizados que convertem visitantes em clientes. 
              Da conceção ao lançamento, desenvolvemos soluções digitais que elevam o seu negócio.
            </p>
            <Link 
              to="/#contacto" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-senvia-500 to-senvia-400 text-white font-medium rounded-xl hover:from-senvia-400 hover:to-senvia-300 transition-all duration-300"
            >
              Solicitar Orçamento
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <Globe className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Websites Corporativos</h3>
              <p className="text-muted-foreground">Presença profissional online com design elegante e funcionalidades completas.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <Smartphone className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Landing Pages</h3>
              <p className="text-muted-foreground">Páginas otimizadas para conversão com foco em resultados e geração de leads.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <Zap className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Otimização SEO</h3>
              <p className="text-muted-foreground">Websites otimizados para motores de busca e performance superior.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <Users className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">UX/UI Design</h3>
              <p className="text-muted-foreground">Experiência do utilizador intuitiva com design moderno e responsivo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-gradient">O Que Incluímos</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Design Responsivo</h4>
                    <p className="text-muted-foreground">Perfeito em todos os dispositivos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Velocidade Otimizada</h4>
                    <p className="text-muted-foreground">Carregamento rápido e performance superior</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">SEO Integrado</h4>
                    <p className="text-muted-foreground">Otimização para motores de busca</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">CMS Fácil de Usar</h4>
                    <p className="text-muted-foreground">Gerencie conteúdo sem conhecimento técnico</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Segurança Avançada</h4>
                    <p className="text-muted-foreground">Proteção contra ameaças online</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-senvia-500 rounded-full mt-3"></div>
                  <div>
                    <h4 className="font-semibold">Suporte Contínuo</h4>
                    <p className="text-muted-foreground">Manutenção e atualizações regulares</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Websites;