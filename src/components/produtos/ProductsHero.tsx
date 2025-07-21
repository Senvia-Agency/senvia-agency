import { ArrowRight, Zap, Target, Rocket } from "lucide-react";
import { Button } from "../ui/button";

const ProductsHero = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-secondary to-card relative overflow-hidden">
      {/* Animated background elements with SENVIA colors */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Automação Profissional
              <span className="block text-gradient glow">
                Que Gera Resultados
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              <span className="font-semibold text-primary">Páginas que convertem + CRM + Automação completa.</span><br />
              Tudo pronto para captar e nutrir seus leads automaticamente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={scrollToPricing}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 glow-box group"
            >
              Ver Planos Agora
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Direct benefits */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="glass-effect rounded-xl p-6 hover:bg-card/80 transition-all duration-300 card-hover">
              <Zap className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Setup em 7-18 dias</h3>
              <p className="text-muted-foreground text-sm">Tudo configurado e funcionando rapidamente</p>
            </div>
            <div className="glass-effect rounded-xl p-6 hover:bg-card/80 transition-all duration-300 card-hover">
              <Target className="h-10 w-10 text-accent mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Leads Organizados</h3>
              <p className="text-muted-foreground text-sm">CRM integrado que nunca perde um contato</p>
            </div>
            <div className="glass-effect rounded-xl p-6 hover:bg-card/80 transition-all duration-300 card-hover">
              <Rocket className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">ROI Comprovado</h3>
              <p className="text-muted-foreground text-sm">Automação que aumenta vendas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsHero;