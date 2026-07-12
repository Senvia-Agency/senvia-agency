import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, X } from 'lucide-react';

const QualificationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const isFor = [
    "Já vendem um produto/serviço validado e querem escalar",
    "Têm tickets médios ou altos (Imobiliário, Clínicas, Serviços B2B, Consultorias)",
    "Estão cansadas de leads desqualificados",
    "Valorizam qualidade sobre quantidade"
  ];

  const notFor = [
    "Quem quer apenas um \"site institucional\" para dizer que tem",
    "Quem procura a solução mais barata do mercado",
    "Quem ainda não tem um produto/serviço para vender"
  ];

  const industries = ['Imobiliário', 'Clínicas de Saúde', 'Serviços B2B', 'Consultorias', 'Educação', 'Serviços Premium'];

  const checkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { type: "spring", stiffness: 200, damping: 15 }
    },
  };

  return (
    <section id="para-quem" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Animated background grid */}
      <motion.div 
        className="absolute inset-0 opacity-[0.02]"
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            A SENVIA é para
            <br />
            <span className="gradient-text-animated">empresas que:</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Is For */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: -10 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            whileHover={{ y: -5 }}
            className="bg-primary/5 border border-primary/20 rounded-2xl p-8 relative overflow-hidden group"
          >
            {/* Glow effect */}
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            {/* Shimmer */}
            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <motion.div 
                className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center glow-pulse"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Check className="h-5 w-5 text-primary" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground">É para si</h3>
            </div>

            <ul className="space-y-4 relative z-10">
              {isFor.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  className="flex items-start gap-3 group/item"
                >
                  <motion.div 
                    className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5"
                    variants={checkVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    transition={{ delay: 0.6 + index * 0.15 }}
                    whileHover={{ scale: 1.2, backgroundColor: 'hsl(var(--primary) / 0.4)' }}
                  >
                    <Check className="h-3 w-3 text-primary" />
                  </motion.div>
                  <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Not For */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 10 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            whileHover={{ y: -5 }}
            className="bg-muted/30 border border-border rounded-2xl p-8 relative overflow-hidden group"
          >
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <motion.div 
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
                whileHover={{ rotate: -90 }}
                transition={{ duration: 0.3 }}
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground">Não é para si</h3>
            </div>

            <ul className="space-y-4 relative z-10">
              {notFor.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  className="flex items-start gap-3 group/item"
                >
                  <motion.div 
                    className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.6 + index * 0.15, type: "spring" }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </motion.div>
                  <span className="text-muted-foreground group-hover/item:text-foreground/80 transition-colors">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Industries */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">Setores onde entregamos resultados:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 1.2 + index * 0.1, type: "spring" }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  borderColor: 'hsl(var(--primary) / 0.3)',
                }}
                className="px-4 py-2 rounded-full bg-muted/50 border border-border text-sm text-muted-foreground cursor-default transition-all hover:text-foreground"
              >
                {industry}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QualificationSection;
