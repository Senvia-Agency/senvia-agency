import { MessageCircle, Mail, Instagram, Users } from 'lucide-react';

const channels = [
  {
    icon: MessageCircle,
    title: 'WhatsApp dentro do CRM',
    desc: 'Receba e responda às mensagens dos seus clientes sem abrir o telemóvel. Cada conversa fica ligada ao lead, ao contrato e à comissão.',
  },
  {
    icon: Mail,
    title: 'Email integrado',
    desc: 'A sua caixa de email completa dentro do sistema — receber, responder, anexos e pastas. Sem trocar de separador.',
  },
  {
    icon: Instagram,
    title: 'Instagram & Messenger',
    desc: 'Centralize também as mensagens das redes sociais. Todos os canais numa única caixa de entrada partilhada.',
  },
  {
    icon: Users,
    title: 'A equipa alinhada',
    desc: 'Atribua conversas, veja o histórico completo do cliente e responda mais rápido. Nenhum lead fica sem resposta.',
  },
];

const OSMulticanalSection = () => {
  return (
    <section id="multicanal" className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
            Atendimento Multicanal
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            WhatsApp, email e redes sociais —{' '}
            <span className="text-primary">tudo dentro do CRM</span>.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Pare de saltar entre o telemóvel, o email e mil separadores. Fale com os seus
            clientes onde eles estão — sem nunca sair do sistema, ao lado do lead, da venda e da comissão.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {channels.map((c) => (
            <div
              key={c.title}
              className="p-8 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <c.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{c.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-base text-muted-foreground max-w-2xl mx-auto mt-12">
          O resultado: a sua agência responde mais depressa, não perde nenhuma oportunidade e
          tem todo o histórico do cliente — da primeira mensagem ao contrato fechado — num só lugar.
        </p>
      </div>
    </section>
  );
};

export default OSMulticanalSection;
