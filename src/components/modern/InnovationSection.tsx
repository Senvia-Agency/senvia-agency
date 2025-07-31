import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Users, Award } from "lucide-react";

const InnovationSection = () => {
  return (
    <section id="about" className="py-32 px-4 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tight">
            <span className="text-muted-foreground font-extralight">Por que escolher a</span>{" "}
            <span className="bg-gradient-to-r from-senvia-400 to-primary bg-clip-text text-transparent font-medium">
              SENVIA
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-light leading-relaxed">
            Somos especialistas em transformar visitantes em clientes através de Landing Pages otimizadas,
            Funis de Vendas estratégicos e Automações inteligentes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {[
            {
              icon: TrendingUp,
              title: "Resultados Comprovados",
              description: "Aumento médio de 300% na conversão de leads através de nossas Landing Pages otimizadas.",
              benefits: [
                "Taxa de conversão superior a 15%",
                "ROI médio de 400% em 6 meses",
                "Redução de 60% no custo por lead"
              ]
            },
            {
              icon: Users,
              title: "Experiência Especializada",
              description: "Equipa dedicada com anos de experiência em marketing digital e desenvolvimento premium.",
              benefits: [
                "Mais de 150 projetos entregues",
                "Especialistas certificados",
                "Metodologia própria testada"
              ]
            },
            {
              icon: Award,
              title: "Suporte Premium",
              description: "Acompanhamento contínuo e otimizações constantes para garantir o máximo desempenho.",
              benefits: [
                "Suporte técnico 24/7",
                "Relatórios mensais detalhados",
                "Otimizações sem custo adicional"
              ]
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="p-10 rounded-3xl bg-card/30 border border-senvia-500/10 backdrop-blur-sm hover:border-senvia-400/30 transition-all duration-700 h-full">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-senvia-400/20 to-primary/20 mb-8 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-10 h-10 text-senvia-400" />
                </div>
                
                <h3 className="text-2xl font-medium mb-6 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed font-light text-lg">
                  {feature.description}
                </p>
                
                <div className="space-y-4">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div
                      key={benefitIndex}
                      className="flex items-center gap-4"
                    >
                      <CheckCircle2 className="w-5 h-5 text-senvia-400 flex-shrink-0" />
                      <span className="text-muted-foreground font-light">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-senvia-400/10 to-primary/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 -z-10"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InnovationSection;