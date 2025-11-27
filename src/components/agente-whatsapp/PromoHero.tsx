import { Bot, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const PromoHero = () => {
  const scrollToForm = () => {
    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-block mb-6 px-6 py-2 bg-destructive/20 border border-destructive/50 rounded-full">
            <span className="text-destructive font-bold">🔥 PROMOÇÃO LIMITADA - APENAS 5 VAGAS</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Agente IA</span> para o{" "}
            <br className="hidden md:block" />
            seu WhatsApp Business
          </h1>

          {/* Robot Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full"></div>
              <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 p-8 rounded-3xl border border-primary/30">
                <Bot className="h-24 w-24 text-primary animate-pulse" />
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-8">
            <p className="text-muted-foreground mb-2">De €800 por apenas</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-6xl md:text-7xl font-bold text-gradient">€500</span>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Setup completo</p>
                <p className="text-xs text-muted-foreground">+ €50/mês servidor</p>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span className="text-foreground">Atendimento 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span className="text-foreground">Marcações automáticas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span className="text-foreground">Lembretes inteligentes</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            size="lg"
            onClick={scrollToForm}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-primary/50 transition-all"
          >
            Garantir Minha Vaga
            <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
          </Button>

          {/* Urgency Note */}
          <p className="text-sm text-muted-foreground mt-4">
            ⏰ Oferta válida até <strong>18 de Dezembro de 2025</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PromoHero;
