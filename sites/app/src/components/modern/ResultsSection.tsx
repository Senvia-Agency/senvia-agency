import { motion } from "framer-motion";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock,
  Star,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ResultsSection = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    {
      icon: TrendingUp,
      value: "300%",
      label: "Aumento em Conversões",
      description: "Média de melhoria nos nossos clientes"
    },
    {
      icon: DollarSign,
      value: "€150k+",
      label: "Receita Gerada",
      description: "Por sistema implementado"
    },
    {
      icon: Users,
      value: "50+",
      label: "Empresas Transformadas",
      description: "Em toda a Europa"
    },
    {
      icon: Clock,
      value: "24h",
      label: "Tempo de Implementação",
      description: "Do conceito ao resultado"
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      company: "TechStartup Lisboa",
      text: "A SENVIA triplicou nossas conversões em apenas uma semana. O ROI foi imediato.",
      rating: 5
    },
    {
      name: "Ana Costa",
      company: "E-commerce Porto",
      text: "Sistema incrível! Automações que economizam 20h/semana e aumentaram vendas em 250%.",
      rating: 5
    },
    {
      name: "Miguel Santos",
      company: "Consultoria Coimbra",
      text: "Profissionais excepcionais. Entregaram exatamente o que prometeram, no prazo.",
      rating: 5
    }
  ];

  return (
    <section id="resultados" className="py-20 px-6 bg-gradient-to-b from-gray-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl animate-pulse delay-1000"></div>
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
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              RESULTADOS COMPROVADOS
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Números reais de clientes reais que transformaram seus negócios
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-green-500/20 backdrop-blur-sm hover:border-green-400/40 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-green-400 mb-2">{stat.value}</div>
              <div className="text-white font-semibold mb-1">{stat.label}</div>
              <div className="text-gray-400 text-sm">{stat.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            O que dizem nossos clientes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-500/20 backdrop-blur-sm"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>

                {/* Author */}
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-cyan-400 text-sm">{testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 backdrop-blur-sm max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Seu negócio pode ser o próximo caso de sucesso
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Junta-se aos empresários que já transformaram seus resultados com nossos sistemas
            </p>
            <Button
              onClick={scrollToContact}
              className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black font-bold px-8 py-4 text-lg rounded-xl"
            >
              QUERO ESTES RESULTADOS
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <div className="text-green-400 font-mono text-sm mt-4 uppercase tracking-widest">
              CONSULTORIA GRATUITA • RESULTADOS GARANTIDOS
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsSection;