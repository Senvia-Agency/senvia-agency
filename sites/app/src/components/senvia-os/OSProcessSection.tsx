import { Smartphone, Cpu, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Smartphone,
    step: '01',
    title: 'O Comercial Submete',
    desc: 'Esqueça os contratos perdidos no WhatsApp. A sua equipa insere os dados diretamente no sistema, a partir de qualquer telemóvel.',
  },
  {
    icon: Cpu,
    step: '02',
    title: 'A Matriz Calcula',
    desc: 'O SENVIA OS cruza instantaneamente as regras do contrato e calcula a receita ponderada, o escalão e os estornos.',
  },
  {
    icon: CheckCircle,
    step: '03',
    title: 'O Gestor Aprova',
    desc: 'Você tem controlo absoluto de cima. Vê a margem de lucro exata e a comissão a pagar, pronta a validar num clique.',
  },
];

const OSProcessSection = () => {
  return (
    <section id="como-funciona" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Do terreno para a sua conta bancária em{' '}
            <span className="text-primary">3 passos lógicos</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((s) => (
            <div
              key={s.step}
              className="relative p-8 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors duration-300"
            >
              <span className="text-5xl font-black text-primary/10 absolute top-4 right-6 select-none">
                {s.step}
              </span>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OSProcessSection;
