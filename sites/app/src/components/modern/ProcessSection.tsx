import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Zap, 
  Rocket, 
  TrendingUp,
  ArrowRight
} from "lucide-react";

const ProcessSection = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: "Consultoria Gratuita",
      description: "Analisamos seu negócio e identificamos oportunidades de conversão",
      duration: "30 min",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Implementação Rápida",
      description: "Criamos e configuramos seu sistema de conversão em menos de 24h",
      duration: "24 horas",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Rocket,
      title: "Lançamento",
      description: "Seu sistema vai ao ar com testes A/B e otimizações ativas",
      duration: "Imediato",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: TrendingUp,
      title: "Resultados",
      description: "Acompanhamento contínuo e otimizações para máximo ROI",
      duration: "Contínuo",
      color: "from-pink-500 to-red-600"
    }
  ];

  return (
    <section id="processo" className="py-20 px-6 bg-gradient-to-b from-black to-gray-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              PROCESSO SIMPLES
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Do primeiro contato aos resultados em apenas 4 passos otimizados
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-black font-bold text-sm z-10">
                  {index + 1}
                </div>

                <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-500/20 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300 text-center mt-4">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto mb-6`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Duration Badge */}
                  <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-sm font-mono mb-4">
                    {step.duration}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>

                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow (except last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-6 h-6 text-cyan-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 backdrop-blur-sm max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-3">
              Simples, rápido e eficaz
            </h3>
            <p className="text-gray-300 mb-6">
              Não perca mais tempo com sistemas complexos. Comece hoje mesmo.
            </p>
            <div className="text-cyan-400 font-mono text-sm uppercase tracking-widest">
              PRÓXIMO PASSO: CONSULTORIA GRATUITA
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;