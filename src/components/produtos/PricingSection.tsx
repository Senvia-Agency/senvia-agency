import { Check, Crown, Zap, ArrowRight, Star } from "lucide-react";
import { Button } from "../ui/button";

const PricingSection = () => {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      subtitle: "Primeiro Passo Profissional",
      setupPrice: "397",
      monthlyPrice: null,
      badge: null,
      color: "from-blue-600 to-blue-700",
      borderColor: "border-blue-500/30",
      bgColor: "from-blue-900/20 to-blue-800/20",
      features: [
        "Página de alta conversão premium",
        "Formulário profissional (leads no e-mail)",
        "Botão flutuante WhatsApp",
        "Google Analytics 4 + Meta Pixel",
        "Hospedagem gerida + SSL",
        "Conformidade total RGPD",
        "Suporte inicial (7 dias)",
        "Online em 7 dias úteis"
      ],
      highlight: "Ideal para começar a captar clientes de forma séria",
      ctaText: "Começar Agora"
    },
    {
      id: "pro",
      name: "Pro",
      subtitle: "Automação + CRM Integrado",
      setupPrice: "697",
      monthlyPrice: "50",
      badge: "Mais Popular",
      color: "from-purple-600 to-purple-700",
      borderColor: "border-purple-500/30",
      bgColor: "from-purple-900/20 to-purple-800/20",
      features: [
        "Tudo do Starter +",
        "CRM personalizado completo",
        "E-mail automático de boas-vindas",
        "Organização automática de leads",
        "Histórico completo de contactos",
        "Exportação CSV ilimitada",
        "Manutenção contínua",
        "Suporte técnico 48h úteis"
      ],
      highlight: "Zero planilhas, zero caos: leads organizados desde o primeiro dia",
      ctaText: "Quero Automatizar"
    },
    {
      id: "premium",
      name: "Premium",
      subtitle: "Automação Avançada + IA",
      setupPrice: "1.197",
      monthlyPrice: "100",
      badge: "Mais Resultados",
      color: "from-yellow-500 to-orange-500",
      borderColor: "border-yellow-500/40",
      bgColor: "from-yellow-900/20 to-orange-900/20",
      features: [
        "Tudo do Pro +",
        "Sequência de 3 e-mails automáticos",
        "Integrações externas (até 3)",
        "Fluxo pós-venda inteligente",
        "Suporte prioritário VIP (24h)",
        "Automação com n8n",
        "Canal dedicado de atendimento",
        "ROI garantido ou dinheiro de volta"
      ],
      highlight: "A evolução para quem quer vender mais com zero trabalho manual",
      ctaText: "Revolucionar Agora",
      popular: true
    }
  ];

  const comparisonFeatures = [
    { feature: "Página de Alta Conversão", starter: true, pro: true, premium: true },
    { feature: "Formulário → E-mail", starter: true, pro: true, premium: true },
    { feature: "Botão WhatsApp", starter: true, pro: true, premium: true },
    { feature: "GA4 + Meta Pixel", starter: true, pro: true, premium: true },
    { feature: "CRM Personalizado", starter: false, pro: true, premium: true },
    { feature: "E-mail Automático", starter: false, pro: true, premium: true },
    { feature: "Sequência de 3 E-mails", starter: false, pro: false, premium: true },
    { feature: "Integrações Externas", starter: false, pro: false, premium: true },
    { feature: "Suporte Prioritário", starter: false, pro: false, premium: true },
    { feature: "Manutenção Contínua", starter: false, pro: true, premium: true }
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-full px-6 py-3 mb-6">
              <Star className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Escolha Seu Nível de Sucesso</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Invista no
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent block">
                Futuro do Seu Negócio
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Não é um custo. É o <strong>melhor investimento</strong> que pode fazer. 
              Cada plano paga-se sozinho em menos de 30 dias.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Sem contratos de permanência</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Garantia de 30 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Suporte em português</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative bg-gradient-to-br ${plan.bgColor} border ${plan.borderColor} rounded-3xl p-8 ${
                  plan.popular ? 'scale-105 ring-2 ring-yellow-400/50' : ''
                } transition-all duration-500 hover:transform hover:scale-105`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r ${plan.color} rounded-full text-sm font-bold text-white`}>
                    {plan.popular && <Crown className="w-4 h-4 inline mr-1" />}
                    {plan.badge}
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.subtitle}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold">{plan.setupPrice} €</span>
                      <span className="text-gray-400">setup</span>
                    </div>
                    {plan.monthlyPrice && (
                      <div className="flex items-baseline justify-center gap-2 mt-2">
                        <span className="text-2xl font-semibold text-gray-300">+ {plan.monthlyPrice} €</span>
                        <span className="text-gray-400">/mês</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-300 italic">{plan.highlight}</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  className={`w-full bg-gradient-to-r ${plan.color} hover:shadow-2xl text-white py-6 text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105`}
                >
                  {plan.ctaText}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                {/* Special indicator for Premium */}
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-3xl animate-pulse pointer-events-none" />
                )}
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-3xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-center mb-8">Comparação Detalhada</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4">Funcionalidade</th>
                    <th className="text-center py-4 px-4">Starter</th>
                    <th className="text-center py-4 px-4">Pro</th>
                    <th className="text-center py-4 px-4 bg-yellow-900/20 rounded-lg">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, index) => (
                    <tr key={index} className="border-b border-gray-800/50">
                      <td className="py-4 px-4 text-gray-300">{item.feature}</td>
                      <td className="text-center py-4 px-4">
                        {item.starter ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {item.pro ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4 bg-yellow-900/10">
                        {item.premium ? (
                          <Check className="w-5 h-5 text-yellow-400 mx-auto" />
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Guarantee Section */}
          <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-3xl p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold mb-6">Garantia de Resultados ou Dinheiro de Volta</h3>
              
              <p className="text-xl text-gray-300 mb-8">
                Estamos tão confiantes que vai <strong>triplicar suas conversões</strong> que oferecemos 
                garantia total de 30 dias. Se não ficar completamente satisfeito, devolvemos 100% do seu investimento.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl mb-2">⚡</div>
                  <div className="font-semibold">Resultados em 7 dias</div>
                  <div className="text-sm text-gray-400">ou devolvemos o dinheiro</div>
                </div>
                <div>
                  <div className="text-4xl mb-2">🛡️</div>
                  <div className="font-semibold">Suporte garantido</div>
                  <div className="text-sm text-gray-400">Nunca fica sozinho</div>
                </div>
                <div>
                  <div className="text-4xl mb-2">💰</div>
                  <div className="font-semibold">ROI comprovado</div>
                  <div className="text-sm text-gray-400">Investimento que se paga</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;