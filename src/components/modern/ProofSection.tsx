import { motion } from "framer-motion";
import { Star, TrendingUp, DollarSign, Users, Clock } from "lucide-react";

const ProofSection = () => {
  const testimonials = [
    {
      name: "Carlos Silva",
      company: "TechStart Lisboa",
      text: "Em 30 dias, nossos leads aumentaram 340%. A máquina da SENVIA é simplesmente revolucionária.",
      rating: 5,
      results: "+340% leads",
      avatar: "CS"
    },
    {
      name: "Maria Santos",
      company: "Boutique Digital",
      text: "ROI de 750% no primeiro trimestre. Nunca vi nada igual no mercado português.",
      rating: 5,
      results: "750% ROI",
      avatar: "MS"
    },
    {
      name: "João Ferreira",
      company: "Consultoria Porto",
      text: "24 horas para implementar e já estamos vendo resultados. Inacreditável!",
      rating: 5,
      results: "Resultados em 24h",
      avatar: "JF"
    }
  ];

  const metrics = [
    {
      icon: TrendingUp,
      value: "847%",
      label: "ROI MÉDIO",
      description: "Retorno sobre investimento comprovado"
    },
    {
      icon: DollarSign,
      value: "€2.4M",
      label: "RECEITA GERADA",
      description: "Para nossos clientes em 2024"
    },
    {
      icon: Users,
      value: "50K+",
      label: "LEADS QUALIFICADOS",
      description: "Gerados mensalmente"
    },
    {
      icon: Clock,
      value: "24h",
      label: "TEMPO SETUP",
      description: "Do zero ao primeiro lead"
    }
  ];

  return (
    <section id="provas" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-8">
            <span className="text-foreground">PROVAS</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              IRREFUTÁVEIS
            </span>
          </h2>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">
            Mais de <span className="text-primary font-bold">2.400 empresas</span> já revolucionaram 
            seus resultados com nossa tecnologia
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105"
            >
              <metric.icon className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl md:text-5xl font-black text-foreground mb-2">
                {metric.value}
              </div>
              <div className="text-primary font-bold mb-2 text-sm tracking-wide">
                {metric.label}
              </div>
              <div className="text-muted-foreground text-sm">
                {metric.description}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-20"
        >
          <h3 className="text-4xl font-black text-center mb-16 text-foreground">
            O QUE DIZEM NOSSOS CLIENTES
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-foreground text-lg mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                {/* Results Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6">
                  <TrendingUp className="w-4 h-4" />
                  {testimonial.results}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{testimonial.name}</div>
                    <div className="text-muted-foreground text-sm">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Case Study Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 text-center overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-black text-foreground mb-6">
              CASO DE SUCESSO DESTAQUE
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-5xl font-black text-primary mb-2">R$ 180K</div>
                <div className="text-muted-foreground">Receita em 90 dias</div>
              </div>
              <div>
                <div className="text-5xl font-black text-accent mb-2">1.200%</div>
                <div className="text-muted-foreground">ROI alcançado</div>
              </div>
              <div>
                <div className="text-5xl font-black text-primary mb-2">15 dias</div>
                <div className="text-muted-foreground">Para recuperar investimento</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProofSection;