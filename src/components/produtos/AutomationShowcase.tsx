import { useState } from "react";
import { Play, Pause, RotateCcw, ArrowRight, Check } from "lucide-react";
import { Button } from "../ui/button";

const AutomationShowcase = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const automationSteps = [
    {
      id: 1,
      title: "Lead Entra na Página",
      description: "Visitante acede à sua landing page otimizada",
      color: "from-blue-500 to-blue-600",
      icon: "👤"
    },
    {
      id: 2,
      title: "Formulário Inteligente",
      description: "Sistema capta dados automaticamente",
      color: "from-purple-500 to-purple-600",
      icon: "📝"
    },
    {
      id: 3,
      title: "CRM Organiza Tudo",
      description: "Lead classificado e armazenado instantaneamente",
      color: "from-green-500 to-green-600",
      icon: "🗂️"
    },
    {
      id: 4,
      title: "E-mail Automático",
      description: "Resposta profissional enviada em segundos",
      color: "from-orange-500 to-orange-600",
      icon: "📧"
    },
    {
      id: 5,
      title: "Integrações Ativas",
      description: "Dados sincronizados com todas as ferramentas",
      color: "from-pink-500 to-pink-600",
      icon: "🔗"
    },
    {
      id: 6,
      title: "Vendas Automáticas",
      description: "Pipeline de vendas funciona 24/7",
      color: "from-indigo-500 to-indigo-600",
      icon: "💰"
    }
  ];

  const startAnimation = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= automationSteps.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <section id="automation" className="py-24 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full px-6 py-3 mb-6">
              <span className="text-blue-400 font-medium">🤖 Automação Inteligente</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Veja a <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Mágica</span> Acontecer
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Em <strong>6 passos automáticos</strong>, transformamos visitantes em clientes. 
              Sem esforço manual. Sem perder tempo. Sem perder vendas.
            </p>

            {/* Control Buttons */}
            <div className="flex justify-center gap-4 mb-16">
              <Button
                onClick={startAnimation}
                disabled={isPlaying}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-4 text-lg"
              >
                {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                {isPlaying ? "A Processar..." : "Ver Automação"}
              </Button>
              
              <Button
                onClick={resetAnimation}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reiniciar
              </Button>
            </div>
          </div>

          {/* Automation Flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {automationSteps.map((step, index) => (
              <div
                key={step.id}
                className={`relative transition-all duration-1000 transform ${
                  currentStep >= index 
                    ? 'scale-105 opacity-100' 
                    : 'scale-95 opacity-60'
                } ${
                  currentStep === index ? 'ring-2 ring-blue-400 ring-opacity-60' : ''
                }`}
              >
                {/* Connection Line */}
                {index < automationSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-600 to-gray-800 z-0">
                    <ArrowRight className="absolute -top-2 -right-2 w-4 h-4 text-gray-600" />
                  </div>
                )}

                <div className={`relative bg-gradient-to-br ${step.color} p-8 rounded-2xl shadow-2xl h-full`}>
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm">
                    {currentStep >= index ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* Icon */}
                  <div className="text-4xl mb-4">{step.icon}</div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-white/90 leading-relaxed">{step.description}</p>

                  {/* Active Indicator */}
                  {currentStep === index && (
                    <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Results Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold mb-6 text-green-400">Resultado Final</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-white mb-2">85%</div>
                  <div className="text-green-300">Menos Trabalho Manual</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">3x</div>
                  <div className="text-green-300">Mais Conversões</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">24/7</div>
                  <div className="text-green-300">Vendas Automáticas</div>
                </div>
              </div>
              
              <p className="text-lg text-gray-300 mt-6">
                <strong>Enquanto você dorme, o sistema trabalha.</strong> Enquanto você atende clientes, o sistema vende. 
                Enquanto você cresce, o sistema escala junto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutomationShowcase;