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
    <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 bg-gradient-to-br from-senvia-500/10 via-transparent to-senvia-400/10">
      <div className="container mx-auto text-center max-w-6xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground">
            Automação Profissional
            <span className="block text-gradient glow">
              Que Gera Resultados
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            <span className="font-semibold text-senvia-500">Páginas que convertem + CRM + Automação completa.</span><br />
            Tudo pronto para captar e nutrir seus leads automaticamente.
          </p>

          <Button 
            size="lg" 
            onClick={scrollToPricing}
            className="bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 text-black text-lg px-8 py-4 mb-8 group"
          >
            Ver Planos Agora
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Direct benefits */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-senvia-500/20 hover:bg-card/80 transition-all duration-300">
              <Zap className="h-10 w-10 text-senvia-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Setup em 7-18 dias</h3>
              <p className="text-muted-foreground text-sm">Tudo configurado e funcionando rapidamente</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-senvia-500/20 hover:bg-card/80 transition-all duration-300">
              <Target className="h-10 w-10 text-senvia-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Leads Organizados</h3>
              <p className="text-muted-foreground text-sm">CRM integrado que nunca perde um contato</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-senvia-500/20 hover:bg-card/80 transition-all duration-300">
              <Rocket className="h-10 w-10 text-senvia-500 mx-auto mb-3" />
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