import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

const PacHeroSection = () => {
  const scrollToCalculator = () => {
    const calculatorSection = document.getElementById("roi-calculator");
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            🚀 Sistema de Crescimento Digital
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Dobre a sua</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              taxa de conversão
            </span>
            <br />
            <span className="text-foreground">em 30 dias</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Sem aumentar um euro no tráfego
          </p>

          {/* Service description */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 text-lg">
            <span className="font-semibold text-foreground">Landing Page + Automação</span>
            <span className="hidden md:block text-muted-foreground">•</span>
            <span className="text-primary font-semibold">ROI garantido ou re-trabalhamos grátis</span>
          </div>

          {/* CTA Button */}
          <Button
            onClick={scrollToCalculator}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            Calcular Meu ROI Grátis
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-sm text-muted-foreground mt-4">
            ✓ Análise personalizada em 2 minutos • ✓ Sem compromisso
          </p>

          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Resultado comprovado por
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="font-semibold text-foreground">50+ empresas</div>
              <div className="font-semibold text-foreground">SaaS & E-commerce</div>
              <div className="font-semibold text-foreground">Portugal & Brasil</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PacHeroSection;