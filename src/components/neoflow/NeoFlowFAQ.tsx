import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const NeoFlowFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Por que a manutenção de €100/mês é obrigatória?",
      answer: "Garantimos uptime, backups e updates de segurança do n8n & Supabase. A manutenção inclui monitorização 24/7, updates automáticos de segurança, suporte técnico prioritário e backups diários. Sem esta manutenção, não podemos garantir o funcionamento correcto do sistema."
    },
    {
      question: "Posso usar outro CRM?",
      answer: "Sim, via Webhook (orçamento adicional). Podemos integrar com a maioria dos CRMs populares como HubSpot, Salesforce, Pipedrive, entre outros. O custo adicional varia entre €200-500 dependendo da complexidade da integração."
    },
    {
      question: "Isto viola RGPD?",
      answer: "Não—armazenamos dados na UE, registamos consentimento e disponibilizamos função apagar/exportar em 1-clique. Todo o sistema foi desenhado desde o início para estar 100% conforme com o RGPD, incluindo logs de auditoria e direitos dos utilizadores."
    },
    {
      question: "E se não tiver WhatsApp Business?",
      answer: "Implementamos sequência de e-mail até sua conta ser aprovada. O processo de aprovação do WhatsApp Business API demora normalmente 1-3 dias. Enquanto isso, todas as automações funcionam via e-mail, garantindo que não perde nenhum lead."
    },
    {
      question: "Quanto tempo até ver resultados?",
      answer: "Clientes típicos obtêm pay-back em 14-30 dias. Os primeiros resultados são visíveis imediatamente após o go-live, com otimizações contínuas nas primeiras semanas. A maioria dos clientes vê um aumento significativo na conversão logo na primeira semana."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            FAQ Essencial
          </h2>
          <p className="text-xl text-gray-600">
            Respostas às perguntas mais frequentes
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-primary/20 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-lg text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-6 h-6 text-primary" />
                  ) : (
                    <Plus className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-primary/5 rounded-2xl p-8 text-center border border-primary/20">
          <h3 className="font-bold text-xl mb-4">Ainda tem dúvidas?</h3>
          <p className="text-gray-600 mb-6">
            Fale connosco directamente para esclarecimentos adicionais
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:info@senvia.pt" 
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              info@senvia.pt
            </a>
            <a 
              href="tel:+351912345678" 
              className="bg-white text-primary border-2 border-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary/5 transition-colors"
            >
              +351 91 234 5678
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeoFlowFAQ;