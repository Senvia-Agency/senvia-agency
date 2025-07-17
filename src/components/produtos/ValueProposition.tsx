import { Check, X, ArrowRight, Crown, Star, Zap } from "lucide-react";
import { Button } from "../ui/button";

const ValueProposition = () => {
  const problemsWithoutSenvia = [
    "Perder leads por formulários que não funcionam",
    "Gastar horas organizando contactos em planilhas",
    "Esquecer de responder e-mails importantes",
    "Não saber de onde vêm os seus clientes",
    "Site lento que afasta visitantes",
    "Insegurança com proteção de dados",
    "Dependência total de programadores",
    "Custos mensais astronómicos"
  ];

  const solutionsWithSenvia = [
    "Sistema inteligente que nunca perde um lead",
    "CRM automático que organiza tudo sozinho",
    "E-mails profissionais enviados instantaneamente",
    "Analytics detalhados de cada fonte",
    "Performance de nível enterprise garantida",
    "100% RGPD compliant sem esforço",
    "Suporte técnico especializado 24/7",
    "Preços fixos sem surpresas"
  ];

  const premiumFeatures = [
    {
      feature: "Sequência de 3 E-mails Automáticos",
      description: "Nutre leads automaticamente até à compra",
      impact: "↗️ +180% conversão"
    },
    {
      feature: "Integrações Externas (até 3)",
      description: "Conecta com Google Sheets, Calendar, WhatsApp",
      impact: "⚡ -85% trabalho manual"
    },
    {
      feature: "Suporte Prioritário VIP",
      description: "Resolução garantida em 24h úteis",
      impact: "🛡️ Tranquilidade total"
    },
    {
      feature: "Fluxo Pós-Venda Inteligente",
      description: "Aumenta ticket médio automaticamente",
      impact: "💰 +40% receita por cliente"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(147,51,234,0.1),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(59,130,246,0.1),transparent)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-full px-6 py-3 mb-6">
              <span className="text-red-400 font-medium">⚠️ Pare de Perder Dinheiro</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Sem SENVIA vs
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent block">
                Com SENVIA
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Veja a diferença brutal entre continuar como está e <strong>revolucionar</strong> seu negócio hoje.
            </p>
          </div>

          {/* Comparison Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Without SENVIA */}
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 border border-red-500/30 rounded-3xl p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-red-400 mb-2">Sem SENVIA</h3>
                <p className="text-gray-400">O que está a perder cada dia</p>
              </div>
              
              <div className="space-y-4">
                {problemsWithoutSenvia.map((problem, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{problem}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-red-900/40 rounded-2xl border border-red-500/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">-67%</div>
                  <div className="text-sm text-gray-400">Perda média de leads por mês</div>
                </div>
              </div>
            </div>

            {/* With SENVIA */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-800/30 border border-green-500/30 rounded-3xl p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">Com SENVIA</h3>
                <p className="text-gray-400">A realidade que pode ter hoje</p>
              </div>
              
              <div className="space-y-4">
                {solutionsWithSenvia.map((solution, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{solution}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-green-900/40 rounded-2xl border border-green-500/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">+284%</div>
                  <div className="text-sm text-gray-400">Aumento médio de conversões</div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Features Spotlight */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-full px-6 py-3 mb-6">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Exclusivo Premium</span>
              </div>
              
              <h3 className="text-3xl md:text-5xl font-bold mb-4">
                Porque o <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Premium</span> Vale Cada Euro
              </h3>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Não é apenas "mais recursos". É a diferença entre <strong>ter um negócio</strong> e <strong>ter um império digital</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {premiumFeatures.map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-2xl p-8 group hover:border-yellow-400/50 transition-all duration-500"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-2 text-yellow-400">{item.feature}</h4>
                      <p className="text-gray-300 mb-4">{item.description}</p>
                      
                      <div className="inline-flex items-center gap-2 bg-yellow-900/30 border border-yellow-500/30 rounded-full px-4 py-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold text-sm">{item.impact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROI Calculator */}
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-bold mb-6">Calculadora de ROI Real</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-black/30 rounded-2xl p-6">
                <div className="text-2xl font-bold text-purple-400 mb-2">1.197 €</div>
                <div className="text-gray-300">Investimento Premium</div>
              </div>
              
              <div className="bg-black/30 rounded-2xl p-6">
                <div className="text-2xl font-bold text-green-400 mb-2">+15 leads/mês</div>
                <div className="text-gray-300">Aumento médio</div>
              </div>
              
              <div className="bg-black/30 rounded-2xl p-6">
                <div className="text-2xl font-bold text-yellow-400 mb-2">€500/lead</div>
                <div className="text-gray-300">Valor médio por cliente</div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                +7.500 € / mês
              </div>
              <p className="text-xl text-gray-300">
                <strong>Receita adicional estimada.</strong> O Premium paga-se em 5 dias.
              </p>
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-6 text-xl font-bold rounded-xl"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Quero Começar Agora
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;