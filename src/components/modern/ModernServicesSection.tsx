import { motion } from "framer-motion";
import { 
  Globe, 
  TrendingUp, 
  Zap,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ModernServicesSection = () => {
  const services = [
    {
      icon: Globe,
      title: "Landing Pages Premium",
      description: "Páginas de alta conversão projetadas com foco em resultados. Design premium que converte visitantes em clientes.",
      features: ["Design Responsivo", "Otimização de Conversão", "SEO Avançado", "Analytics Integrado"],
      delay: 0
    },
    {
      icon: TrendingUp,
      title: "Funis de Vendas",
      description: "Estratégias completas de funil desde a captação até a conversão. Maximizamos cada etapa do processo de venda.",
      features: ["Estratégia de Captação", "Nutrição de Leads", "Automação de Follow-up", "Análise de Performance"],
      delay: 0.1
    },
    {
      icon: Zap,
      title: "Automações Empresariais",
      description: "Sistemas inteligentes que automatizam processos, reduzem custos e aumentam a eficiência operacional.",
      features: ["Integração de Sistemas", "Fluxos Automatizados", "Relatórios Inteligentes", "Suporte Contínuo"],
      delay: 0.2
    }
  ];

  return (
    <section id="services" className="py-32 px-4 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tight">
            <span className="text-muted-foreground font-extralight">Nossos</span>{" "}
            <span className="bg-gradient-to-r from-senvia-400 to-primary bg-clip-text text-transparent font-medium">
              Serviços Premium
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-light leading-relaxed">
            Soluções digitais de alta performance projetadas para empresas que buscam excelência. 
            Cada projeto é desenvolvido com foco em resultados e tecnologia de ponta.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: service.delay }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="p-10 rounded-3xl bg-card/30 border border-senvia-500/10 backdrop-blur-sm hover:border-senvia-400/30 transition-all duration-700 h-full">
                {/* Icon */}
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-senvia-400/20 to-primary/20 mb-8 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-10 h-10 text-senvia-400" />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-medium mb-6 text-foreground">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed font-light text-lg">
                  {service.description}
                </p>
                
                {/* Features */}
                <div className="space-y-4 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center gap-4"
                    >
                      <div className="w-1.5 h-1.5 bg-senvia-400 rounded-full"></div>
                      <span className="text-muted-foreground font-light">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* CTA */}
                <Button 
                  variant="ghost" 
                  className="group/btn w-full justify-between text-senvia-400 hover:text-senvia-300 hover:bg-senvia-400/5 border border-senvia-400/20 hover:border-senvia-400/40 font-light"
                >
                  Saiba mais
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
              
              {/* Subtle glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-senvia-400/10 to-primary/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 -z-10"></div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-gradient-to-r from-senvia-500/5 to-primary/5 border border-senvia-400/10 backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-light mb-6 tracking-tight">
              Pronto para elevar seu negócio?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              Agende uma consultoria gratuita e descubra como nossas soluções podem transformar seus resultados.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-senvia-500 to-senvia-400 hover:from-senvia-400 hover:to-senvia-300 text-black font-medium px-10 py-4 text-lg"
            >
              Agendar Consultoria
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernServicesSection;