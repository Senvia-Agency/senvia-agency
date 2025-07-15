import { Button } from "@/components/ui/button";
import { Smartphone, MessageCircle, Zap } from "lucide-react";

const NeoFlowHero = () => {
  return (
    <section className="relative pt-16 pb-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-primary/20 text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-50"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Contrate o seu primeiro{" "}
              <span className="text-primary glow">COLABORADOR DIGITAL</span>.
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
              Site de Alta Conversão + CRM + Automação WhatsApp & E-mail em 15 dias.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-2xl">
                <span className="line-through text-gray-400">~€1.200~</span>
                <span className="text-3xl font-bold text-primary">€897</span>
                <span className="text-lg text-gray-300">(one-off)</span>
              </div>
              <p className="text-lg text-gray-300">+ manutenção €100/mês</p>
            </div>
            
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 glow">
              Calcular meu ROI em 2 cliques
            </Button>
          </div>
          
          <div className="relative">
            <div className="relative bg-gray-900 rounded-3xl p-8 border border-gray-700 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Smartphone className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">WhatsApp Business</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-primary/20 rounded-2xl p-4 ml-8">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-300">Auto-resposta</span>
                  </div>
                  <p className="text-white">
                    Olá! Recebi o seu contacto do site. Dentro de 5 minutos envio-lhe toda a informação por e-mail. Obrigado!
                  </p>
                </div>
                
                <div className="bg-accent/20 rounded-2xl p-4 mr-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="text-sm text-gray-300">Sistema</span>
                  </div>
                  <p className="text-white">
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