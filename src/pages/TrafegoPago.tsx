import { ArrowRight, Target, BarChart, Zap, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TrafegoPago = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-background to-senvia-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Tráfego Pago</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Maximize o retorno dos seus investimentos em publicidade digital. 
              Campanhas estratégicas no Google Ads, Meta Ads e outras plataformas para gerar leads qualificados.
            </p>
            <Link 
              to="/#contacto" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-senvia-500 to-senvia-400 text-white font-medium rounded-xl hover:from-senvia-400 hover:to-senvia-300 transition-all duration-300"
            >
              Aumentar Vendas Agora
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
              <Target className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Google Ads</h3>
              <p className="text-muted-foreground">Campanhas otimizadas para aparecer no topo das pesquisas do Google.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <BarChart className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Meta Ads</h3>
              <p className="text-muted-foreground">Publicidade no Facebook e Instagram com targeting avançado.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <Zap className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Remarketing</h3>
              <p className="text-muted-foreground">Reative visitantes que já demonstraram interesse nos seus produtos.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-senvia-500/50 transition-all duration-300">
              <DollarSign className="w-12 h-12 text-senvia-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">ROI Otimizado</h3>
              <p className="text-muted-foreground">Maximização do retorno sobre investimento com análise contínua.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-gradient">Nossa Estratégia</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-senvia-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-senvia-500">1</span>
                </div>
                <h4 className="font-semibold mb-2">Análise e Planeamento</h4>
                <p className="text-muted-foreground">Estudamos o seu mercado, concorrência e audiência para criar campanhas certeiras.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-senvia-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-senvia-500">2</span>
                </div>
                <h4 className="font-semibold mb-2">Implementação</h4>
                <p className="text-muted-foreground">Criamos anúncios atrativos e configuramos campanhas otimizadas para conversão.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-senvia-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-senvia-500">3</span>
                </div>
                <h4 className="font-semibold mb-2">Otimização Contínua</h4>
                <p className="text-muted-foreground">Monitorizamos e ajustamos constantemente para melhorar os resultados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              <span className="text-gradient">Resultados Comprovados</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
                <div className="text-4xl font-bold text-senvia-500 mb-2">300%</div>
                <p className="text-muted-foreground">Aumento médio em leads qualificados</p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
                <div className="text-4xl font-bold text-senvia-500 mb-2">5x</div>
                <p className="text-muted-foreground">Retorno sobre investimento médio</p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
                <div className="text-4xl font-bold text-senvia-500 mb-2">50%</div>
                <p className="text-muted-foreground">Redução no custo por aquisição</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TrafegoPago;