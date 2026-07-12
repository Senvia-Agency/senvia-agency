import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  Cog, 
  TrendingUp,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SystemsSection = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const systems = [
    {
      icon: Target,
      title: "Landing Pages de Alta Conversão",
      description: "Páginas otimizadas que convertem visitantes em clientes pagantes",
      features: [
        "Design psicológico persuasivo",
        "Otimização para mobile",
        "Testes A/B integrados",
        "Analytics avançados"
      ],
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Funis de Vendas Automatizados",
      description: "Sistemas completos que nutrem leads até a conversão final",
      features: [
        "Sequências de email automatizadas",
        "Segmentação inteligente",
        "Follow-up personalizado",
        "CRM integrado"
      ],
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Cog,
      title: "Automações Empresariais",
      description: "Processos automatizados que economizam tempo e aumentam eficiência",
      features: [
        "Integração com ferramentas existentes",
        "Workflows personalizados",
        "Relatórios automáticos",
        "Escalabilidade garantida"
      ],
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section id="sistemas" className="py-20 px-6 bg-gradient-to-b from-gray-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse delay-1000"></div>
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
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SISTEMAS PREMIUM
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Tecnologia de ponta que transforma seu negócio em uma máquina de conversão automatizada
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {systems.map((system, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-500/20 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300 h-full">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${system.color} flex items-center justify-center mb-6`}>
                  <system.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4">{system.title}</h3>

                {/* Description */}
                <p className="text-gray-300 mb-6">{system.description}</p>

                {/* Features */}
                <div className="space-y-3">
                  {system.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 backdrop-blur-sm max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Pronto para 3x mais conversões?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Implemente um sistema completo em 24 horas e veja resultados imediatos
            </p>
            <Button
              onClick={scrollToContact}
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-8 py-4 text-lg rounded-xl"
            >
              COMEÇAR AGORA - GRÁTIS
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SystemsSection;