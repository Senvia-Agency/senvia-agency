import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Vou ter de colocar o meu cartão de crédito agora?',
    a: 'Não. Queremos que teste a plataforma com a sua equipa durante 14 dias de forma totalmente gratuita e sem compromisso.',
  },
  {
    q: 'É difícil de implementar na minha agência?',
    a: 'O sistema foi desenhado para ser intuitivo. Em menos de 10 minutos consegue configurar os acessos da sua equipa e começar a submeter os primeiros contratos.',
  },
];

const OSFAQSection = () => {
  return (
    <section id="faq" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          Perguntas Frequentes
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default OSFAQSection;
