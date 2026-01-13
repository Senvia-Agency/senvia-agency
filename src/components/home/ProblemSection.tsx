import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
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

  return (
    <section id="problema" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            O problema não é a falta de leads.
            <br />
            <span className="text-primary">É a falta de qualidade.</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            A maioria das agências entrega-lhe leads "frios". Você liga, eles não atendem, ou dizem "estava só a ver". A sua equipa comercial perde horas a filtrar listas inúteis.
          </p>

          {/* Problem icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-destructive/5 border border-destructive/10"
              >
                <problem.icon className="h-8 w-8 text-destructive/70" />
                <span className="text-sm font-medium text-muted-foreground">{problem.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* The enemy vs The signal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative"
          >
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* The Enemy - Noise */}
              <div className="bg-card border border-border rounded-2xl p-8 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium mb-4">
                    O INIMIGO
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mb-3">O Ruído</h3>
                  <p className="text-muted-foreground">
                    Centenas de leads que nunca vão comprar. Formulários preenchidos por curiosos. Tempo e dinheiro desperdiçados.
                  </p>
                </div>
              </div>

              {/* The Signal - Money */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-4">
                    A SOLUÇÃO
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mb-3">O Sinal</h3>
                  <p className="text-muted-foreground">
                    A SENVIA existe para eliminar o ruído e deixar passar apenas o sinal — <span className="text-primary font-semibold">dinheiro</span>.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
