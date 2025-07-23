
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqItems = [
    {
      question: "A landing page funciona para qualquer tipo de negócio?",
      answer: "Sim! Criamos landing pages + CRM personalizados para consultores, coaches, clínicas, advogados, arquitetos, e-commerce e qualquer negócio que precise captar leads qualificados."
    },
    {
      question: "Preciso saber usar sistemas complicados?",
      answer: "Não! O CRM é super intuitivo e fornecemos treinamento completo. Você vai conseguir gerir leads, enviar e-mails e acompanhar conversões facilmente."
    },
    {
      question: "Em quanto tempo fica pronto?",
      answer: "Landing page + CRM completo fica pronto em até 7 dias úteis, incluindo todas as integrações, automação de e-mails e testes de funcionamento."
    },
    {
      question: "Os e-mails são enviados automaticamente?",
      answer: "Sim! Configuramos e-mails automáticos: você recebe notificação de cada novo lead e o lead recebe boas-vindas personalizadas instantaneamente."
    },
    {
      question: "Posso integrar com meu WhatsApp Business?",
      answer: "Claro! Colocamos botão flutuante conectado ao seu WhatsApp e integramos com o CRM para ter histórico completo de cada conversa."
    },
    {
      question: "Tenho suporte após a entrega?",
      answer: "Sim! Incluímos 30 dias de suporte total e treinamento para você dominar o sistema. Depois oferecemos manutenção mensal opcional."
    }
  ];

  return (
    <section className="py-12 md:py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            <span className="text-gradient">Perguntas Frequentes</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-sm md:text-base">{item.question}</AccordionTrigger>
                <AccordionContent className="text-sm md:text-base">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
