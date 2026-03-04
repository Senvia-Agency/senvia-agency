import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, X, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAppUrl } from '@/utils/getSignupUrl';

interface Feature {
  name: string;
  starter: boolean;
  pro: boolean;
  elite: boolean;
}

const features: Feature[] = [
  { name: "CRM Base (Leads + Clientes)", starter: true, pro: true, elite: true },
  { name: "Calendário & Propostas", starter: true, pro: true, elite: true },
  { name: "Formulários", starter: true, pro: true, elite: true },
  { name: "Meta Pixels", starter: true, pro: true, elite: true },
  { name: "Módulo Marketing", starter: false, pro: true, elite: true },
  { name: "Integração WhatsApp", starter: false, pro: true, elite: true },
  { name: "Módulo Vendas", starter: false, pro: true, elite: true },
  { name: "Módulo Financeiro", starter: false, pro: true, elite: true },
  { name: "Módulo E-commerce", starter: false, pro: false, elite: true },
  { name: "Faturação (InvoiceXpress)", starter: false, pro: false, elite: true },
  { name: "Stripe (Pagamentos)", starter: false, pro: false, elite: true },
];

const plans = [
  {
    name: "Starter",
    price: "49",
    users: "Até 10 utilizadores",
    forms: "2 formulários",
    popular: false,
    key: "starter" as const,
  },
  {
    name: "Pro",
    price: "99",
    users: "Até 15 utilizadores",
    forms: "5 formulários",
    popular: true,
    key: "pro" as const,
  },
  {
    name: "Elite",
    price: "147",
    users: "Utilizadores ilimitados",
    forms: "Formulários ilimitados",
    popular: false,
    key: "elite" as const,
  },
];

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-24 md:py-32 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 aurora-bg" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Planos <span className="gradient-text-animated">simples e transparentes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para o seu negócio. Sem surpresas. Cancele a qualquer momento.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                plan.popular
                  ? 'bg-card border-primary/50 shadow-[0_0_40px_hsl(var(--primary)/0.15)]'
                  : 'bg-card border-border hover:border-primary/30'
              } glass-premium`}
            >
              {plan.popular && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.5 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5">
                  <Star className="w-3 h-3" /> Mais Popular
                </motion.div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-lg text-muted-foreground">€/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.users}</p>
                <p className="text-sm text-muted-foreground">{plan.forms}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {features.map((f) => {
                  const included = f[plan.key];
                  return (
                    <li key={f.name} className={`flex items-center gap-3 text-sm ${included ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                      {included ? (
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/30 flex-shrink-0" />
                      )}
                      {f.name}
                    </li>
                  );
                })}
              </ul>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={() => window.open(getAppUrl('/'), '_blank')}
                  className={`w-full py-6 text-base font-semibold ${
                    plan.popular
                      ? 'bg-primary hover:bg-primary/90 glow-pulse'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Começar Teste Grátis
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
