import { motion } from "framer-motion";
import { 
  Code2, 
  Smartphone, 
  Bot, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ModernServicesSection = () => {
  const services = [
    {
      icon: Code2,
      title: "Desenvolvimento Web",
      description: "Aplicações web modernas e responsivas usando React, Next.js e as melhores práticas do mercado.",
      features: ["Progressive Web Apps", "SEO Otimizado", "Performance Superior", "Design Responsivo"],
      color: "from-blue-400 to-cyan-300",
      delay: 0
    },
    {
      icon: Smartphone,
      title: "Apps Mobile",
      description: "Aplicativos nativos e híbridos para iOS e Android com experiência de usuário excepcional.",
      features: ["React Native", "Flutter", "Design Nativo", "Integração Cloud"],
      color: "from-purple-400 to-pink-300",
      delay: 0.1
    },
    {
      icon: Bot,
      title: "Automação & IA",
      description: "Soluções inteligentes que automatizam processos e integram inteligência artificial.",
      features: ["Chatbots IA", "RPA", "Machine Learning", "Análise Preditiva"],
      color: "from-senvia-400 to-primary",
      delay: 0.2
    },
    {
      icon: TrendingUp,
      title: "Marketing Digital",
      description: "Estratégias digitais completas para aumentar sua presença online e gerar mais leads.",
      features: ["SEO/SEM", "Landing Pages", "Analytics", "Automação Marketing"],
      color: "from-green-400 to-emerald-300",
      delay: 0.3
    },
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Proteção completa para seus dados e sistemas com as melhores práticas de segurança.",
      features: ["Penetration Testing", "Compliance", "Monitoramento 24/7", "Backup Seguro"],
      color: "from-red-400 to-orange-300",
      delay: 0.4
    },
    {
      icon: Zap,
      title: "DevOps & Cloud",
      description: "Infraestrutura cloud escalável com deploy automatizado e monitoramento contínuo.",
      features: ["CI/CD", "AWS/Azure", "Kubernetes", "Monitoramento"],
      color: "from-yellow-400 to-orange-300",
      delay: 0.5
    }
  ];

  return (
    <section id="services" className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Nossos{" "}
            <span className="bg-gradient-to-r from-senvia-400 to-primary bg-clip-text text-transparent">
              Serviços
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Oferecemos soluções completas de tecnologia, desde desenvolvimento de software 
            até estratégias digitais avançadas, sempre focando em resultados mensuráveis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: service.delay }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-2xl bg-card/50 border border-muted/20 backdrop-blur-sm hover:border-senvia-400/30 transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Title and Description */}
                <h3 className="text-xl font-bold mb-4 group-hover:text-foreground transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                {/* Features */}
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center gap-3 text-sm"
                    >
                      <CheckCircle2 className={`w-4 h-4 bg-gradient-to-r ${service.color} text-white rounded-full flex-shrink-0`} />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* CTA */}
                <Button 
                  variant="ghost" 
                  className="group/btn w-full justify-between text-senvia-400 hover:text-senvia-300 hover:bg-senvia-400/10 border border-senvia-400/20 hover:border-senvia-400/40"
                >
                  Saiba mais
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
              
              {/* Glow effect */}
              <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-20 blur transition-opacity duration-500 -z-10`}></div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-r from-senvia-500/10 to-primary/10 border border-senvia-400/20 backdrop-blur-sm">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para transformar sua ideia em realidade?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Nossa equipe de especialistas está pronta para criar a solução perfeita para o seu negócio.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 text-black font-semibold px-8 py-3"
            >
              Iniciar conversa
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernServicesSection;