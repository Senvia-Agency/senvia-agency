
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqItems = [
    {
      question: "Isto funciona para o meu nicho (B2B/Serviços/Infoprodutos)?",
      answer: "A psicologia humana é universal. Se o seu negócio precisa de explicar valor para fechar uma venda ou capturar um contacto (lead), este sistema é obrigatório. Adaptamos a \"roupagem\", mas o motor de conversão funciona para qualquer setor que venda online."
    },
    {
      question: "Eu preciso de pagar softwares caros de CRM à parte?",
      answer: "Nós configuramos a estrutura para se adaptar à sua realidade. Podemos integrar com ferramentas que já usa ou implementar soluções cost-effective que recomendamos. O objetivo é eficiência, não aumentar os seus custos fixos desnecessariamente."
    },
    {
      question: "Quanto tempo demora até ter a estrutura no ar?",
      answer: "Ao contrário de agências tradicionais que demoram meses, o nosso foco é velocidade de implementação. Uma estrutura padrão de alta performance costuma estar pronta para receber tráfego entre 7 a 14 dias após a reunião de Kick-off."
    }
  ];

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Perguntas Frequentes sobre{" "}
            <span className="text-gradient">Estruturas de Alta Conversão</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 md:px-6"
              >
                <AccordionTrigger className="text-left text-sm md:text-base font-semibold hover:text-senvia-400 transition-colors py-4 md:py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-base text-muted-foreground pb-4 md:pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
