import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CheckCircle } from "lucide-react";

const CTASection = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary to-accent relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground leading-tight">
              Pare de Perder Leads
              <span className="block">Comece Hoje Mesmo</span>
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Sua concorrência já está automatizando. Não fique para trás.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={scrollToPricing}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3 shadow-xl"
            >
              Escolher Plano
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-primary-foreground/90">
              <CheckCircle className="h-5 w-5 text-white" />
              <span className="text-sm">Setup rápido</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-primary-foreground/90">
              <CheckCircle className="h-5 w-5 text-white" />
              <span className="text-sm">Suporte incluso</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-primary-foreground/90">
              <CheckCircle className="h-5 w-5 text-white" />
              <span className="text-sm">RGPD completo</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 max-w-lg mx-auto border border-white/20">
            <div className="flex items-center justify-center gap-2 text-white mb-2">
              <Clock className="h-4 w-4" />
              <span className="font-semibold text-sm">Apenas 10 vagas/mês</span>
            </div>
            <p className="text-primary-foreground/90 text-sm">
              Vagas limitadas para garantir qualidade máxima no atendimento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;