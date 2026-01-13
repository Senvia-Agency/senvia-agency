import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { BarChart3, Eye, LayoutDashboard, CheckCircle2 } from 'lucide-react';

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
      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              SENVIA OS
            </span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Inteligência
              <br />
              <span className="text-primary">nos Bastidores</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Enquanto outras agências entregam uma planilha de Excel, nós entregamos um <strong className="text-foreground">Sistema Operacional de Vendas</strong>.
            </p>

            {/* Features list */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
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
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Painel SENVIA OS</span>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 space-y-6">
                {/* Temperature Gauge */}
                <div className="bg-muted/30 rounded-xl p-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">Temperatura do Funil</h4>
                  <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: '78%' } : {}}
                      transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-yellow-500 to-orange-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Frio</span>
                    <span className="text-orange-400 font-medium">78°C Médio</span>
                    <span>Quente</span>
                  </div>
                </div>

                {/* Lead Classification */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-orange-400">12</p>
                    <p className="text-xs text-muted-foreground">Quentes</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-400">8</p>
                    <p className="text-xs text-muted-foreground">Mornos</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-400">3</p>
                    <p className="text-xs text-muted-foreground">Frios</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-foreground">Leads prontos para contacto</span>
                    </div>
                    <span className="text-sm font-bold text-green-500">12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Em automação de nutrição</span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">11</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
