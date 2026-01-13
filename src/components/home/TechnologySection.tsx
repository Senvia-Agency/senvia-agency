import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { BarChart3, Eye, LayoutDashboard, CheckCircle2 } from 'lucide-react';

// Animated number component
const AnimatedNumber = ({ value, delay = 0 }: { value: number; delay?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [isInView, value, delay]);

  return <span ref={ref}>{displayValue}</span>;
};

const TechnologySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: BarChart3,
      title: "Lead Scoring Automático",
      description: "Pontuação de leads baseada em IA que analisa intenção de compra em tempo real."
    },
    {
      icon: Eye,
      title: "Sem Chatbots Irritantes",
      description: "A análise é silenciosa e invisível para o cliente. Sem fricção, máxima conversão."
    },
    {
      icon: LayoutDashboard,
      title: "Dashboard Simples",
      description: "Saiba a temperatura do seu funil numa única tela. Sem complicações."
    }
  ];

  return (
    <section id="tecnologia" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Aurora background effect */}
      <div className="absolute inset-0 aurora-bg" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.span 
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 shimmer"
              whileHover={{ scale: 1.05 }}
            >
              SENVIA OS
            </motion.span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              <span>Inteligência</span>
              <br />
              <span className="gradient-text-animated">nos Bastidores</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Enquanto outras agências entregam uma planilha de Excel, nós entregamos um <strong className="text-foreground">Sistema Operacional de Vendas</strong>.
            </p>

            {/* Features list */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.2, duration: 0.5 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="flex items-start gap-4 p-4 rounded-xl transition-all cursor-default hover:bg-card/50"
                >
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="relative"
            style={{ perspective: 1000 }}
          >
            <motion.div 
              className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden glass-premium"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Dashboard Header */}
              <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-red-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-yellow-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Painel SENVIA OS</span>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 space-y-6">
                {/* Temperature Gauge */}
                <motion.div 
                  className="bg-muted/30 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">Temperatura do Funil</h4>
                  <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: '78%' } : {}}
                      transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-yellow-500 to-orange-500 rounded-full"
                    >
                      {/* Shimmer effect on progress bar */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                    </motion.div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Frio</span>
                    <motion.span 
                      className="text-orange-400 font-medium"
                      animate={{ textShadow: ['0 0 0px', '0 0 8px hsl(var(--primary))', '0 0 0px'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      78°C Médio
                    </motion.span>
                    <span>Quente</span>
                  </div>
                </motion.div>

                {/* Lead Classification with animated numbers */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 12, label: "Quentes", bgClass: "bg-orange-500/10 border-orange-500/20", textClass: "text-orange-400", delay: 800 },
                    { value: 8, label: "Mornos", bgClass: "bg-yellow-500/10 border-yellow-500/20", textClass: "text-yellow-400", delay: 1000 },
                    { value: 3, label: "Frios", bgClass: "bg-blue-500/10 border-blue-500/20", textClass: "text-blue-400", delay: 1200 },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.8 + index * 0.15 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`${item.bgClass} border rounded-lg p-4 text-center cursor-default`}
                    >
                      <p className={`text-2xl font-bold ${item.textClass}`}>
                        <AnimatedNumber value={item.value} delay={item.delay} />
                      </p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 1.2 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </motion.div>
                      <span className="text-sm text-foreground">Leads prontos para contacto</span>
                    </div>
                    <motion.span 
                      className="text-sm font-bold text-green-500"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <AnimatedNumber value={12} delay={1400} />
                    </motion.span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 1.4 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Em automação de nutrição</span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      <AnimatedNumber value={11} delay={1600} />
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Decorative elements with animation */}
            <motion.div 
              className="absolute -top-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/20 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            
            {/* Floating orb */}
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                boxShadow: [
                  '0 0 10px hsl(var(--primary))',
                  '0 0 30px hsl(var(--primary))',
                  '0 0 10px hsl(var(--primary))',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
