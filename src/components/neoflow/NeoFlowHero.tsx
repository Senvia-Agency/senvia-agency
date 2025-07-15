import { Button } from "@/components/ui/button";
import { Smartphone, MessageCircle, Zap } from "lucide-react";

const NeoFlowHero = () => {
  return (
    <section className="relative pt-16 pb-12 md:pb-20 px-4 bg-gradient-to-br from-background via-muted/50 to-primary/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight text-foreground">
              Contrate o seu primeiro{" "}
              <span className="text-primary glow">COLABORADOR DIGITAL</span>.
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed">
              Sistema completo: Site + CRM + Automação WhatsApp & E-mail em 15 dias.
            </p>
            
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xl md:text-2xl">
                <span className="line-through text-muted-foreground">~€1.200~</span>
                <span className="text-2xl md:text-3xl font-bold text-primary">€897</span>
                <span className="text-base md:text-lg text-foreground">(one-off)</span>
              </div>
              <p className="text-base md:text-lg text-foreground">+ manutenção €100/mês</p>
            </div>
            
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-base md:text-lg px-6 md:px-8 py-4 md:py-6 glow font-semibold w-full md:w-auto"
              onClick={() => {
                const element = document.getElementById('pricing');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ver Preços e Reservar
            </Button>
          </div>
          
          <div className="relative mt-8 lg:mt-0">
            <div className="relative bg-card rounded-3xl p-4 md:p-8 border border-border shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Smartphone className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">WhatsApp Business</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-2xl p-4 ml-4 md:ml-8 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">Auto-resposta</span>
                  </div>
                  <p className="text-foreground text-sm md:text-base">
                    Olá! Recebi o seu contacto do site. Dentro de 5 minutos envio-lhe toda a informação por e-mail. Obrigado!
                  </p>
                </div>
                
                <div className="bg-accent/10 rounded-2xl p-4 mr-4 md:mr-8 border border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="text-sm text-foreground">Sistema</span>
                  </div>
                  <p className="text-foreground text-sm md:text-base">
                    Lead registado no CRM • E-mail de seguimento enviado • Score: 85/100
                  </p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <span className="text-primary font-semibold">✓ Tudo automatizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeoFlowHero;