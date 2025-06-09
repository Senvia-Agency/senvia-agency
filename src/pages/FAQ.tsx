import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const faqData = [
  {
    category: "Geral",
    questions: [
      {
        question: "O que é a SENVIA Agency?",
        answer: "A SENVIA Agency é uma agência de marketing digital e tecnologia especializada em criar experiências digitais impactantes. Oferecemos serviços completos desde websites e e-commerce até campanhas de tráfego pago e agentes de IA."
      },
      {
        question: "Quanto tempo demora um projeto?",
        answer: "O tempo varia conforme a complexidade do projeto. Websites simples podem ser entregues em 2-3 semanas, enquanto e-commerce complexos podem levar 6-8 semanas. Sempre definimos prazos claros no início do projeto."
      },
      {
        question: "Oferecem suporte após a entrega?",
        answer: "Sim! Todos os nossos projetos incluem 30 dias de suporte gratuito após a entrega. Também oferecemos planos de manutenção mensais para suporte contínuo e atualizações."
      }
    ]
  },
  {
    category: "Websites & E-commerce",
    questions: [
      {
        question: "Os websites são responsivos?",
        answer: "Absolutamente! Todos os nossos websites são desenvolvidos com design responsivo, garantindo perfeita visualização em computadores, tablets e smartphones."
      },
      {
        question: "Posso gerir o conteúdo do meu website?",
        answer: "Sim, implementamos sistemas de gestão de conteúdo (CMS) fáceis de usar, permitindo que atualize textos, imagens e produtos sem conhecimento técnico."
      },
      {
        question: "O e-commerce inclui pagamentos online?",
        answer: "Sim, integramos múltiplos métodos de pagamento seguros, incluindo cartões de crédito, MB Way, PayPal e transferências bancárias."
      }
    ]
  },
  {
    category: "Marketing Digital",
    questions: [
      {
        question: "Como funciona o tráfego pago?",
        answer: "Criamos e gerimos campanhas no Google Ads, Meta Ads e outras plataformas. Definimos orçamentos, segmentamos audiências e otimizamos continuamente para maximizar o retorno sobre investimento."
      },
      {
        question: "Quanto devo investir em publicidade?",
        answer: "O investimento depende dos seus objetivos e mercado. Recomendamos começar com orçamentos teste e escalar gradualmente conforme os resultados. Analisamos seu caso específico para sugerir valores adequados."
      },
      {
        question: "Gerem redes sociais?",
        answer: "Sim, criamos estratégias de conteúdo, gerimos publicações, interagimos com seguidores e desenvolvemos campanhas para aumentar engagement e conversões nas redes sociais."
      }
    ]
  },
  {
    category: "Agentes de IA",
    questions: [
      {
        question: "O que são agentes de IA?",
        answer: "São chatbots inteligentes que utilizam inteligência artificial para conversar naturalmente com clientes, responder dúvidas, qualificar leads e automatizar processos de atendimento 24/7."
      },
      {
        question: "Como a IA aprende sobre meu negócio?",
        answer: "Treinamos a IA com informações específicas do seu negócio, produtos, serviços e FAQ. Ela aprende continuamente com cada interação, melhorando suas respostas ao longo do tempo."
      },
      {
        question: "A IA substitui completamente humanos?",
        answer: "Não, a IA complementa sua equipe. Ela resolve questões simples automaticamente e encaminha casos complexos para humanos, otimizando o processo de atendimento."
      }
    ]
  },
  {
    category: "Preços & Pagamentos",
    questions: [
      {
        question: "Como funciona o processo de orçamento?",
        answer: "Fazemos uma consulta gratuita para entender suas necessidades, apresentamos uma proposta detalhada com valores fixos e prazos. Sem surpresas ou custos ocultos."
      },
      {
        question: "Aceitam pagamentos parcelados?",
        answer: "Sim, oferecemos opções de pagamento flexíveis, incluindo parcelamento sem juros para projetos de maior valor. Discutimos as melhores condições para cada cliente."
      },
      {
        question: "Há custos de manutenção?",
        answer: "Hosting e domínio têm custos anuais separados. Manutenção é opcional mas recomendada - oferecemos planos mensais que incluem atualizações, backups e suporte técnico."
      }
    ]
  }
];

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("Geral");
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const activeCategoryData = faqData.find(cat => cat.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-background to-senvia-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Perguntas Frequentes</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Encontre respostas para as dúvidas mais comuns sobre nossos serviços. 
              Se não encontrar o que procura, entre em contacto connosco!
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {faqData.map((category) => (
                <button
                  key={category.category}
                  className={`px-6 py-3 rounded-full transition-all duration-300 ${
                    activeCategory === category.category
                      ? "bg-senvia-500 text-white shadow-lg"
                      : "bg-card text-foreground border border-border hover:border-senvia-500"
                  }`}
                  onClick={() => {
                    setActiveCategory(category.category);
                    setActiveQuestion(null);
                  }}
                >
                  {category.category}
                </button>
              ))}
            </div>

            {/* Questions */}
            <div className="max-w-4xl mx-auto">
              {activeCategoryData?.questions.map((item, index) => (
                <div
                  key={index}
                  className="mb-4 bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 hover:border-senvia-500/50 transition-all duration-300"
                >
                  <button
                    className="w-full p-6 text-left flex justify-between items-center"
                    onClick={() => toggleQuestion(index)}
                  >
                    <h3 className="text-lg font-semibold pr-4">{item.question}</h3>
                    {activeQuestion === index ? (
                      <ChevronUp className="w-5 h-5 text-senvia-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  
                  {activeQuestion === index && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-border/50 pt-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-gradient">Ainda tem dúvidas?</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Nossa equipa está pronta para esclarecer todas as suas questões e ajudar a encontrar a solução ideal para o seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+351939135114"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-senvia-500 to-senvia-400 text-white font-medium rounded-xl hover:from-senvia-400 hover:to-senvia-300 transition-all duration-300"
              >
                +351 939 135 114
              </a>
              <a
                href="mailto:geral@senvia.pt"
                className="inline-flex items-center justify-center px-6 py-3 border border-senvia-500 text-senvia-500 font-medium rounded-xl hover:bg-senvia-500 hover:text-white transition-all duration-300"
              >
                geral@senvia.pt
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;