import { ArrowRight, Phone, MessageCircle, Clock } from "lucide-react";
import { Button } from "../ui/button";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 via-black to-primary-dark text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.15),transparent)]" />
      
      {/* Animated Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-full px-8 py-4 mb-8">
            <Clock className="w-6 h-6 text-red-400" />
            <span className="text-red-400 font-bold text-lg">Última Oportunidade Este Mês</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            Pronto Para
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent block">
              Transformar Tudo?
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-2xl md:text-3xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed">
            Cada minuto que passa é dinheiro perdido. Cada lead não capturado é uma oportunidade que nunca volta.
            <strong className="text-yellow-400 block mt-4">Não deixe para amanhã o que pode revolucionar hoje.</strong>
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-4xl font-bold text-green-400 mb-2">+284%</div>
              <div className="text-gray-300">Aumento de Conversões</div>
              <div className="text-sm text-gray-500 mt-2">Média dos clientes Premium</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-4xl font-bold text-blue-400 mb-2">24h</div>
              <div className="text-gray-300">Para Ver Resultados</div>
              <div className="text-sm text-gray-500 mt-2">Sistema funcionando</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-4xl font-bold text-purple-400 mb-2">€7.500+</div>
              <div className="text-gray-300">Receita Adicional/Mês</div>
              <div className="text-sm text-gray-500 mt-2">ROI médio Premium</div>
            </div>
          </div>

          {/* Main CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-white px-12 py-8 text-2xl font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[300px]"
            >
              Revolucionar Agora
              <ArrowRight className="w-8 h-8 ml-3" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-8 text-2xl font-bold rounded-2xl min-w-[300px]"
            >
              <MessageCircle className="w-8 h-8 mr-3" />
              Falar com Especialista
            </Button>
          </div>

          {/* Contact Options */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/50 rounded-3xl p-12 mb-16">
            <h3 className="text-3xl font-bold mb-8">Prefere Falar Connosco Primeiro?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/30 rounded-2xl p-8 text-center">
                <Phone className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-3">Chamada Estratégica Gratuita</h4>
                <p className="text-gray-300 mb-6">
                  30 minutos para analisar seu negócio e desenhar a estratégia perfeita
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl">
                  Agendar Agora
                </Button>
              </div>
              
              <div className="bg-black/30 rounded-2xl p-8 text-center">
                <MessageCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-3">WhatsApp Directo</h4>
                <p className="text-gray-300 mb-6">
                  Tire todas as dúvidas e receba proposta personalizada em minutos
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl">
                  Conversar Agora
                </Button>
              </div>
            </div>
          </div>

          {/* Final Push */}
          <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-500/30 rounded-3xl p-12">
            <h3 className="text-3xl font-bold mb-6 text-red-400">⚠️ Aviso Importante</h3>
            
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Só conseguimos aceitar <strong>5 novos clientes por mês</strong> para garantir qualidade máxima. 
              Dezembro tem apenas <strong>2 vagas restantes</strong>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="bg-red-900/50 border border-red-500/50 rounded-xl px-6 py-3">
                <span className="text-red-400 font-bold">🔥 Vagas Limitadas: 2/5 restantes</span>
              </div>
              <div className="bg-orange-900/50 border border-orange-500/50 rounded-xl px-6 py-3">
                <span className="text-orange-400 font-bold">⏰ Próxima disponibilidade: Janeiro 2025</span>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-16 py-8 text-2xl font-bold rounded-2xl shadow-2xl animate-pulse"
            >
              Garantir Minha Vaga Agora
              <ArrowRight className="w-8 h-8 ml-3" />
            </Button>
          </div>

          {/* Trust Footer */}
          <div className="mt-16 text-gray-400 text-center">
            <p className="mb-4">✅ Sem contratos • ✅ Garantia 30 dias • ✅ Suporte em português</p>
            <p className="text-sm">
              Junte-se aos <strong className="text-white">200+ empresas</strong> que já revolucionaram o negócio com SENVIA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;