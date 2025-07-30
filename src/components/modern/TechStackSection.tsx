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
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Stack Tecnológico{" "}
            <span className="bg-gradient-to-r from-senvia-400 to-primary bg-clip-text text-transparent">
              Moderno
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Utilizamos as tecnologias mais avançadas e confiáveis do mercado para 
            entregar soluções robustas, escaláveis e de alta performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-2xl bg-card/50 border border-muted/20 backdrop-blur-sm hover:border-senvia-400/30 transition-all duration-300"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${tech.color} mb-6`}>
                  <tech.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-foreground transition-colors">
                  {tech.category}
                </h3>
                
                <div className="space-y-2">
                  {tech.techs.map((techName, techIndex) => (
                    <div
                      key={techIndex}
                      className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tech.color}`}></div>
                      <span className="text-sm">{techName}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Glow effect */}
              <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-20 blur transition-opacity duration-300 -z-10`}></div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "200+", label: "Projetos entregues" },
            { number: "50+", label: "Clientes satisfeitos" },
            { number: "99.9%", label: "Uptime garantido" },
            { number: "24/7", label: "Suporte técnico" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-senvia-400 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
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