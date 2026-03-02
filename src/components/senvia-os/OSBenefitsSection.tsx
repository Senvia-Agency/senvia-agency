import { Users, Shield } from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: 'Sem Limites',
    desc: 'Não pague por cabeça. No SENVIA OS, tem utilizadores e formulários ilimitados. Cresça a sua equipa de 10 para 100 comerciais sem pagar mais um cêntimo por isso.',
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    desc: 'Perfis restritos e estanques. O comercial apenas tem acesso aos seus próprios contratos. Os dados da sua empresa ficam protegidos e visíveis apenas para a administração.',
  },
];

const OSBenefitsSection = () => {
  return (
    <section id="beneficios" className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Uma operação blindada,{' '}
            <span className="text-primary">desenhada para escalar</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="p-8 md:p-10 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <b.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{b.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OSBenefitsSection;
