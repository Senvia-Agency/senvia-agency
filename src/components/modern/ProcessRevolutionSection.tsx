import { motion } from "framer-motion";
import { Target, Zap, TrendingUp, CheckCircle } from "lucide-react";

const ProcessRevolutionSection = () => {
  const steps = [
    {
      icon: Target,
      number: "01",
      title: "ANÁLISE LASER",
      description: "Mapeamos seu mercado, concorrência e oportunidades em 2 horas",
      features: ["Auditoria completa", "Identificação de gaps", "Estratégia personalizada"],
      color: "text-primary"
    },
    {
      icon: Zap,
      number: "02", 
      title: "CONSTRUÇÃO RELÂMPAGO",
      description: "Criamos sua máquina de vendas em 24 horas",
      features: ["Landing pages", "Funis automatizados", "Integrações completas"],
      color: "text-accent"
    },
    {
      icon: TrendingUp,
      number: "03",
      title: "OTIMIZAÇÃO CONTÍNUA",
      description: "Melhoramos constantemente para maximizar resultados",
      features: ["A/B testing", "Análise de dados", "Ajustes estratégicos"],
      color: "text-primary"
    }
  ];

  return (
    <section id="processo" className="py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-8">
            <span className="text-foreground">PROCESSO</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              REVOLUCIONÁRIO
            </span>
          </h2>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Transformamos seu negócio em uma <span className="text-primary font-bold">máquina de gerar clientes</span> 
            em apenas 3 etapas simples e comprovadas
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-6 mb-8">
                  <div className={`text-6xl font-black ${step.color} opacity-20`}>
                    {step.number}
                  </div>
                  <step.icon className={`w-16 h-16 ${step.color}`} />
                </div>
                
                <h3 className="text-4xl md:text-5xl font-black text-foreground mb-6">
                  {step.title}
                </h3>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {step.description}
                </p>

                <div className="space-y-4">
                  {step.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + featureIndex * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <CheckCircle className="w-6 h-6 text-primary" />
                      <span className="text-lg font-medium text-foreground">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative p-12 rounded-3xl bg-gradient-to-br from-card to-muted border border-border"
                >
                  <div className="text-center">
                    <div className={`text-8xl font-black ${step.color} mb-6`}>
                      {step.number}
                    </div>
                    <step.icon className={`w-24 h-24 ${step.color} mx-auto mb-6`} />
                    <div className="text-2xl font-bold text-foreground">
                      {step.title}
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-4 h-4 bg-primary/20 rounded-full" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 bg-accent/20 rounded-full" />
                  <div className="absolute top-1/2 left-4 w-2 h-2 bg-primary/30 rounded-full" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center gap-8 bg-card p-8 rounded-2xl border border-border">
            <div className="text-center">
              <div className="text-3xl font-black text-primary mb-2">2h</div>
              <div className="text-sm text-muted-foreground">ANÁLISE</div>
            </div>
            <div className="w-12 h-px bg-border" />
            <div className="text-center">
              <div className="text-3xl font-black text-accent mb-2">24h</div>
              <div className="text-sm text-muted-foreground">CONSTRUÇÃO</div>
            </div>
            <div className="w-12 h-px bg-border" />
            <div className="text-center">
              <div className="text-3xl font-black text-primary mb-2">∞</div>
              <div className="text-sm text-muted-foreground">OTIMIZAÇÃO</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessRevolutionSection;