import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const AIFAQSection = () => {
  const faqs = [
    {
      question: "O que a SENVIA oferece?",
      answer: "Soluções de IA para automação de vendas, atendimento e análise de dados, tudo sob medida para o seu negócio. As nossas ferramentas incluem chatbots inteligentes, CRM automatizado, análise preditiva e muito mais."
    },
    {
      question: "Quanto custa?",
      answer: "Os nossos planos começam em 800€ (implementação) + 200€/mês (manutenção). Entre em contacto connosco para um orçamento exacto baseado nas suas necessidades específicas."
    },
    {
      question: "É difícil de usar?",
      answer: "Não! A IA é configurada por nós e depois funciona automaticamente. Além disso, oferecemos suporte completo para o guiar em todo o processo e garantir que aproveita ao máximo a tecnologia."
    },
    {
      question: "Funciona para o meu sector?",
      answer: "Sim, adaptamos as nossas soluções para e-commerce, marketing, consultoria, saúde, educação e muito mais. A nossa IA é flexível e personalizada para cada tipo de negócio."
    },
    {
      question: "Quanto tempo para ver resultados?",
      answer: "Em 30 dias, já sente a diferença com ajustes contínuos. Muitos clientes veem melhorias nas primeiras semanas, com optimizações constantes baseadas nos dados do seu negócio."
    },
    {
      question: "Como é feita a integração?",
      answer: "Integramos com as suas ferramentas existentes (WhatsApp, e-mail, website, CRM). O processo é simples e não interfere com as suas operações actuais."
    },
    {
      question: "Há garantias?",
      answer: "Sim! Oferecemos garantia de resultados nos primeiros 90 dias. Se não ficar satisfeito com o desempenho, devolvemos o investimento inicial."
    },
    {
      question: "Preciso de conhecimentos técnicos?",
      answer: "Absolutamente não. Tratamos de toda a parte técnica. Só precisa de focar no seu negócio enquanto a nossa IA trabalha para si 24/7."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Perguntas
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Frequentes
            </span>
          </h2>
          <p className="text-xl text-slate-300">
            Tudo o que precisa de saber sobre as nossas soluções de IA
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm rounded-lg px-6"
            >
              <AccordionTrigger className="text-left text-white hover:text-cyan-400 transition-colors duration-300 py-6 text-lg font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 pb-6 text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-400 mb-4">
            Ainda tem dúvidas?
          </p>
          <a 
            href="#contact" 
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Fale Connosco Agora
          </a>
        </div>
      </div>
    </section>
  );
};

export default AIFAQSection;