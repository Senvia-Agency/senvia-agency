import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PhoneOff, UserX, Clock, Ban } from 'lucide-react';

const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    {
      icon: PhoneOff,
      text: "Liga, não atendem"
    },
    {
      icon: UserX,
      text: '"Estava só a ver..."'
    },
    {
      icon: Clock,
      text: "Horas a filtrar listas"
    },
    {
      icon: Ban,
      text: "Zero vendas fechadas"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section id="problema" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Animated background texture */}
      <motion.div 
        className="absolute inset-0 opacity-[0.02]" 
        animate={{
          backgroundPosition: ['0px 0px', '40px 40px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Spotlight effect */}
      <div className="absolute inset-0 spotlight" />

      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
                O problema não é a falta de leads.
            <br />
            <motion.span 
              className="text-primary gradient-text-animated"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              É a falta de qualidade.
            </motion.span>
          </motion.h2>

          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A maioria das agências entrega-lhe leads "frios". Você liga, eles não atendem, ou dizem "estava só a ver". A sua equipa comercial perde horas a filtrar listas inúteis.
          </motion.p>

          {/* Problem icons */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-destructive/5 border border-destructive/10 transition-all duration-300 hover:bg-destructive/10 hover:border-destructive/30 cursor-default"
              >
                <motion.div
                  animate={isInView ? {
                    rotate: [0, -5, 5, -5, 0],
                  } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.8 + index * 0.1,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <problem.icon className="h-8 w-8 text-destructive/70 group-hover:text-destructive transition-colors" />
                  </motion.div>
                </motion.div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {problem.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* The enemy vs The signal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative"
          >
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* The Enemy - Noise */}
              <motion.div 
                className="bg-card border border-border rounded-2xl p-8 text-left relative overflow-hidden group"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated background glow */}
                <motion.div 
                  className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="relative z-10">
                  <motion.span 
                    className="inline-block px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    O INIMIGO
                  </motion.span>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-destructive/90 transition-colors">O Ruído</h3>
                  <p className="text-muted-foreground">
                    Centenas de leads que nunca vão comprar. Formulários preenchidos por curiosos. Tempo e dinheiro desperdiçados.
                  </p>
                </div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>

              {/* The Signal - Money */}
              <motion.div 
                className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-left relative overflow-hidden group glow-pulse"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated background glow */}
                <motion.div 
                  className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative z-10">
                  <motion.span 
                    className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-4"
                    animate={{ 
                      boxShadow: [
                        '0 0 0 0 hsl(var(--primary) / 0.4)',
                        '0 0 0 8px hsl(var(--primary) / 0)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    A SOLUÇÃO
                  </motion.span>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">O Sinal</h3>
                  <p className="text-muted-foreground">
                    A SENVIA existe para eliminar o ruído e deixar passar apenas o sinal — <motion.span 
                      className="text-primary font-semibold"
                      animate={{ textShadow: ['0 0 0px hsl(var(--primary))', '0 0 10px hsl(var(--primary))', '0 0 0px hsl(var(--primary))'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >dinheiro</motion.span>.
                  </p>
                </div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 shimmer" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
