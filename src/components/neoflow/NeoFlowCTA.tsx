import { Button } from "@/components/ui/button";
import { Rocket, Clock, Users } from "lucide-react";
import { useState, useEffect } from "react";

const NeoFlowCTA = () => {
  const [slots, setSlots] = useState(4);

  // Simular contagem decrescente de slots
  useEffect(() => {
    const interval = setInterval(() => {
      setSlots(prev => {
        const random = Math.random();
        if (random < 0.1 && prev > 1) { // 10% chance de decrementar
          return prev - 1;
        }
        return prev;
      });
    }, 30000); // Verifica a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-primary/20 text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
            Pronto para pôr a sua captação em{" "}
            <span className="text-primary glow">piloto-automático</span>?
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-300 mb-8">
            Junte-se aos negócios que já automatizaram o seu crescimento
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur rounded-3xl p-8 mb-8 border border-white/20">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Go-Live Garantido</h3>
              <p className="text-gray-300">Em 15 dias ou reembolso total</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2">ROI Rápido</h3>
              <p className="text-gray-300">Pay-back típico em &lt;30 dias</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Suporte Total</h3>
              <p className="text-gray-300">Manutenção e monitorização 24/7</p>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white text-xl px-12 py-8 rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 glow"
          >
            <Rocket className="w-6 h-6 mr-3" />
            Quero reservar a minha vaga
          </Button>
          
          <div className="mt-6">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">
                Faltam <span className="text-red-400 font-bold text-lg">{slots}</span> de 5 implementações deste mês
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
            <h3 className="font-bold text-lg mb-4 text-primary">✓ O que está incluído</h3>
            <ul className="space-y-2 text-sm">
              <li>• Site de alta conversão (5 secções)</li>
              <li>• CRM completo no Supabase</li>
              <li>• Automação WhatsApp + E-mail</li>
              <li>• Dashboard de métricas</li>
              <li>• Go-live em 15 dias</li>
            </ul>
          </div>
          
          <div className="bg-accent/10 rounded-2xl p-6 border border-accent/20">
            <h3 className="font-bold text-lg mb-4 text-accent">✓ Garantias</h3>
            <ul className="space-y-2 text-sm">
              <li>• 100% RGPD compliant</li>
              <li>• Entrega em 15 dias ou reembolso</li>
              <li>• Suporte técnico prioritário</li>
              <li>• Monitorização 24/7</li>
              <li>• ROI positivo em 30 dias</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Preço de lançamento válido apenas para as primeiras 5 implementações
          </p>
          <div className="flex justify-center items-center gap-4 text-lg">
            <span className="line-through text-gray-500">€1.200</span>
            <span className="text-3xl font-bold text-primary">€897</span>
            <span className="text-gray-300">+ €100/mês manutenção</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeoFlowCTA;