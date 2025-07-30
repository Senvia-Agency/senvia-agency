import { motion } from "framer-motion";
import { 
  Brain, 
  Rocket, 
  Eye, 
  Lightbulb,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const InnovationSection = () => {
  const innovations = [
    {
      icon: Brain,
      title: "Inteligência Artificial",
      description: "Implementamos IA para otimizar processos, prever tendências e personalizar experiências do usuário.",
      metrics: "95% de precisão",
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: Eye,
      title: "Computer Vision",
      description: "Soluções de visão computacional para automação industrial e análise de imagens em tempo real.",
      metrics: "99.7% de acurácia",
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: Rocket,
      title: "Performance Extrema",
      description: "Aplicações otimizadas que carregam 3x mais rápido que a média do mercado.",
      metrics: "<1s tempo de carregamento",
      color: "from-orange-400 to-red-400"
    },
    {
      icon: Lightbulb,
      title: "Inovação Contínua",
      description: "Sempre na vanguarda da tecnologia, implementando as últimas tendências e frameworks.",
      metrics: "100+ tecnologias dominadas",
      color: "from-senvia-400 to-primary"
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-senvia-900/5"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-senvia-400 rounded-full opacity-30"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-senvia-400/10 border border-senvia-400/20 mb-6">
            <Sparkles className="w-4 h-4 text-senvia-400" />
            <span className="text-sm text-senvia-400 font-medium">Inovação em cada projeto</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Liderando a{" "}
            <span className="bg-gradient-to-r from-senvia-400 via-primary to-accent bg-clip-text text-transparent">
              Revolução Digital
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Não seguimos tendências, nós as criamos. Nossa equipe está sempre explorando 
            novas fronteiras tecnológicas para entregar soluções que colocam nossos clientes 
            anos à frente da concorrência.
          </p>
        </motion.div>

        {/* Innovation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {innovations.map((innovation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-3xl bg-card/30 border border-muted/20 backdrop-blur-sm hover:border-senvia-400/30 transition-all duration-500"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${innovation.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${innovation.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <innovation.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{innovation.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {innovation.description}
                </p>
                
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${innovation.color} bg-opacity-10 border border-opacity-20`}>
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${innovation.color}`}></div>
                  <span className="text-sm font-semibold">{innovation.metrics}</span>
                </div>
              </div>
              
              {/* Glow effect */}
              <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${innovation.color} opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500 -z-10`}></div>
            </motion.div>
          ))}
        </div>

        {/* Case Study Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-senvia-500/10 to-primary/10 border border-senvia-400/20 backdrop-blur-sm p-8 md:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Transformação Digital Comprovada
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Nossos projetos geram resultados mensuráveis: aumento médio de 300% na eficiência 
                operacional e 250% no ROI dos nossos clientes nos primeiros 6 meses.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-3xl font-bold text-senvia-400 mb-1">300%</div>
                  <div className="text-sm text-muted-foreground">Aumento de eficiência</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">250%</div>
                  <div className="text-sm text-muted-foreground">ROI médio</div>
                </div>
              </div>
              
              <Button 
                variant="outline"
                className="border-senvia-400/30 text-senvia-400 hover:bg-senvia-400/10 group"
              >
                Ver casos de sucesso
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-senvia-400/20 to-primary/20 backdrop-blur-sm border border-senvia-400/20 flex items-center justify-center">
                <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-senvia-400 to-primary bg-clip-text text-transparent">
                  AI
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-senvia-400 to-primary opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent opacity-60 animate-pulse delay-1000"></div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-senvia-400/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default InnovationSection;