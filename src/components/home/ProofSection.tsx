import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
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
      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Prova Social
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Tecnologia validada em
            <br />
            <span className="text-primary">nichos exigentes</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            O núcleo da nossa tecnologia (SENVIA OS) já processa leads e agendamentos para o setor da saúde, onde a confiança é inegociável. Trazemos agora essa mesma robustez para o seu negócio.
          </p>

          {/* Proof cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {proofs.map((proof, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
                className="bg-card border border-border rounded-xl p-6 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <proof.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{proof.title}</h3>
                <p className="text-sm text-muted-foreground">{proof.description}</p>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default ProofSection;
