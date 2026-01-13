import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, HeartPulse, TrendingUp } from 'lucide-react';

const ProofSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const proofs = [
    {
      icon: HeartPulse,
      title: "Setor da Saúde",
      description: "Onde a confiança e precisão são inegociáveis."
    },
    {
      icon: Shield,
      title: "Dados Seguros",
      description: "Infraestrutura robusta e RGPD compliant."
    },
    {
      icon: TrendingUp,
      title: "Escalabilidade",
      description: "Do primeiro lead a milhares, sem perder qualidade."
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 aurora-bg" />
      
      {/* Animated gradient mesh */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[120px]"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.span 
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 shimmer"
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                '0 0 0 0 hsl(var(--primary) / 0.4)',
                '0 0 0 10px hsl(var(--primary) / 0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Prova Social
          </motion.span>

          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Tecnologia validada em
            <br />
            <span className="gradient-text-animated">nichos exigentes</span>
          </motion.h2>

          <motion.p 
            className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            O núcleo da nossa tecnologia (SENVIA OS) já processa leads e agendamentos para o setor da saúde, onde a confiança é inegociável. Trazemos agora essa mesma robustez para o seu negócio.
          </motion.p>

          {/* Proof cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {proofs.map((proof, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, rotateX: -20 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.2, duration: 0.6, type: "spring" }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.03,
                  boxShadow: '0 20px 40px hsl(var(--primary) / 0.15)',
                }}
                className="bg-card border border-border rounded-xl p-6 text-center relative overflow-hidden group cursor-default glass-premium"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Glow on hover */}
                <motion.div
                  className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                
                <motion.div 
                  className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative z-10"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 0 0 hsl(var(--primary) / 0.3)',
                        '0 0 0 15px hsl(var(--primary) / 0)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className="rounded-xl"
                  >
                    <proof.icon className="h-7 w-7 text-primary" />
                  </motion.div>
                </motion.div>
                <h3 className="font-semibold text-foreground mb-2 relative z-10 group-hover:text-primary transition-colors">
                  {proof.title}
                </h3>
                <p className="text-sm text-muted-foreground relative z-10">{proof.description}</p>
                
                {/* Corner accent */}
                <motion.div
                  className="absolute -bottom-2 -right-2 w-16 h-16 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default ProofSection;
