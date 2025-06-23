
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqItems = [
    {
      question: "Este serviço serve para qualquer tipo de negócio?",
      answer: "Sim! Criamos estruturas personalizadas para consultores, coaches, clínicas, e-commerce, serviços locais e qualquer negócio que precise captar leads online."
    },
    {
      question: "Eu preciso saber programar ou usar ferramentas complicadas?",
      answer: "Não! Criamos tudo para você e fornecemos treinamento simples. A gestão é feita através de painéis intuitivos que qualquer pessoa consegue usar."
    },
    {
      question: "Quanto tempo leva para entregar?",
      answer: "O projeto completo fica pronto em até 7 dias úteis, incluindo todas as integrações, automações e testes."
    },
    {
      question: "Posso conectar com o WhatsApp do meu negócio?",
      answer: "Sim! Integramos com o seu número de WhatsApp Business e configuramos botão flutuante + automações inteligentes."
    },
    {
      question: "Tenho suporte caso precise de ajuda depois?",
      answer: "Claro! Incluímos 30 dias de suporte gratuito e depois disso oferecemos planos de manutenção acessíveis."
    }
  ];

  return (
    <section className="py-20 px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-gradient">Perguntas Frequentes</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
