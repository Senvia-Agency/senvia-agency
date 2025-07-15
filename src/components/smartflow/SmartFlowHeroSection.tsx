import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Zap, Target } from "lucide-react";

const SmartFlowHeroSection = () => {
  const scrollToTimeline = () => {
    const element = document.getElementById('timeline-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Infraestrutura de Aquisição Premium
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            <span className="block">Site + n8n</span>
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SmartFlow
            </span>
          </h1>
        </div>

        {/* Value Proposition */}
        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
          Entregamos, em <span className="text-primary font-semibold">15 dias</span>, um microsite ultrarrápido já conectado a um fluxo de automação n8n que responde leads em <span className="text-primary font-semibold">60 segundos</span> e alimenta o seu CRM
        </p>

        {/* Guarantee Badge */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-6 py-3 rounded-full text-base font-medium">
            <Target className="w-5 h-5" />
            Garantia de ≥20% mais oportunidades qualificadas ou otimizamos sem custo
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
            <Clock className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">15 Dias</h3>
            <p className="text-sm text-muted-foreground">Infraestrutura completa entregue</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
            <Zap className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">60 Segundos</h3>
            <p className="text-sm text-muted-foreground">Resposta automática aos leads</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
            <Target className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">+20% Leads</h3>
            <p className="text-sm text-muted-foreground">Garantia de performance</p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            onClick={scrollToTimeline}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Ver Cronograma de 15 Dias
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <span className="line-through">€1.200</span>
            <span className="text-primary font-bold text-xl ml-2">€897</span>
            <span className="text-xs block">Oferta limitada</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartFlowHeroSection;