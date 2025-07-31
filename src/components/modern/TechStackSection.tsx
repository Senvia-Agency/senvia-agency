import { motion } from "framer-motion";
import { Database, Cloud, Smartphone, Globe, Cpu, Shield } from "lucide-react";

const TechStackSection = () => {
  const technologies = [
    {
      category: "Frontend",
      icon: Globe,
      color: "from-blue-400 to-cyan-300",
      techs: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
    },
    {
      category: "Backend",
      icon: Database,
      color: "from-green-400 to-emerald-300",
      techs: ["Node.js", "Python", "PostgreSQL", "MongoDB"]
    },
    {
      category: "Mobile",
      icon: Smartphone,
      color: "from-purple-400 to-pink-300",
      techs: ["React Native", "Flutter", "iOS", "Android"]
    },
    {
      category: "Cloud",
      icon: Cloud,
      color: "from-orange-400 to-red-300",
      techs: ["AWS", "Google Cloud", "Azure", "Vercel"]
    },
    {
      category: "AI/ML",
      icon: Cpu,
      color: "from-senvia-400 to-primary",
      techs: ["TensorFlow", "OpenAI", "Python", "Computer Vision"]
    },
    {
      category: "Security",
      icon: Shield,
      color: "from-red-400 to-pink-300",
      techs: ["OAuth", "JWT", "SSL/TLS", "Penetration Testing"]
    }
  ];

  return (
    <section id="tech" className="py-32 px-4 bg-gradient-to-b from-muted/10 to-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tight">
            <span className="text-muted-foreground font-extralight">Tecnologia</span>{" "}
            <span className="bg-gradient-to-r from-senvia-400 to-primary bg-clip-text text-transparent font-medium">
              de Ponta
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-light leading-relaxed">
            Utilizamos as ferramentas mais avançadas do mercado para criar Landing Pages,
            Funis de Vendas e Automações que entregam resultados excepcionais.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            {
              title: "Landing Pages",
              description: "Design e desenvolvimento de páginas de alta conversão",
              techs: ["React/Next.js", "Tailwind CSS", "Framer Motion", "Analytics Avançado"]
            },
            {
              title: "Funis de Vendas",
              description: "Estratégias e automações para maximizar conversões",
              techs: ["CRM Integrado", "Email Marketing", "Tracking Avançado", "A/B Testing"]
            },
            {
              title: "Automações",
              description: "Sistemas inteligentes para otimizar processos empresariais",
              techs: ["Zapier/Make", "API Integrations", "Webhooks", "Cloud Functions"]
            }
          ].map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="p-10 rounded-3xl bg-card/30 border border-senvia-500/10 backdrop-blur-sm hover:border-senvia-400/30 transition-all duration-700 h-full">
                <h3 className="text-2xl font-medium mb-6 text-foreground">
                  {tech.title}
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed font-light text-lg">
                  {tech.description}
                </p>
                <div className="space-y-4">
                  {tech.techs.map((techName, techIndex) => (
                    <div
                      key={techIndex}
                      className="flex items-center gap-4"
                    >
                      <div className="w-1.5 h-1.5 bg-senvia-400 rounded-full"></div>
                      <span className="text-muted-foreground font-light">{techName}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-senvia-400/10 to-primary/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 -z-10"></div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { number: "150+", label: "Projetos entregues" },
            { number: "98%", label: "Taxa de satisfação" },
            { number: "3x", label: "Aumento médio em conversões" },
            { number: "24/7", label: "Suporte técnico" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-light text-senvia-400 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground font-light">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;