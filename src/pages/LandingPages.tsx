import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import HeroSection from "../components/landing/HeroSection";
import ProblemSection from "../components/landing/ProblemSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import ProcessSection from "../components/landing/ProcessSection";
import FAQSection from "../components/landing/FAQSection";
import ContactFormSection from "../components/landing/ContactFormSection";

// FAQ data for Schema.org
const faqSchemaData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Isto funciona para o meu nicho (B2B/Serviços/Infoprodutos)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A psicologia humana é universal. Se o seu negócio precisa de explicar valor para fechar uma venda ou capturar um contacto (lead), este sistema é obrigatório. Adaptamos a 'roupagem', mas o motor de conversão funciona para qualquer setor que venda online."
      }
    },
    {
      "@type": "Question",
      "name": "Eu preciso de pagar softwares caros de CRM à parte?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nós configuramos a estrutura para se adaptar à sua realidade. Podemos integrar com ferramentas que já usa ou implementar soluções cost-effective que recomendamos. O objetivo é eficiência, não aumentar os seus custos fixos desnecessariamente."
      }
    },
    {
      "@type": "Question",
      "name": "Quanto tempo demora até ter a estrutura no ar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ao contrário de agências tradicionais que demoram meses, o nosso foco é velocidade de implementação. Uma estrutura padrão de alta performance costuma estar pronta para receber tráfego entre 7 a 14 dias após a reunião de Kick-off."
      }
    }
  ]
};

const LandingPages = () => {
  useEffect(() => {
    // Fallback for document title
    document.title = "Landing Pages Inteligentes | SENVIA - Ecossistemas de Vendas";
  }, []);

  return (
    <>
      <Helmet>
        <title>Landing Pages Inteligentes | SENVIA - Ecossistemas de Vendas</title>
        <meta name="description" content="Implementamos Ecossistemas de Vendas que transformam tráfego pago em receita previsível. Landing Pages Inteligentes com IA, CRM e Automação de elite." />
        <link rel="canonical" href="https://www.senvia.pt/landing-pages" />
        <meta property="og:title" content="Landing Pages Inteligentes | SENVIA - Ecossistemas de Vendas" />
        <meta property="og:description" content="Implementamos Ecossistemas de Vendas que transformam tráfego pago em receita previsível. Landing Pages Inteligentes com IA, CRM e Automação de elite." />
        <meta property="og:url" content="https://www.senvia.pt/landing-pages" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Landing Pages Inteligentes | SENVIA" />
        <meta name="twitter:description" content="Transforme tráfego pago em receita previsível com Landing Pages Inteligentes." />
        <script type="application/ld+json">
          {JSON.stringify(faqSchemaData)}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <ProcessSection />
        <FAQSection />
        <ContactFormSection />
        <Footer />
      </div>
    </>
  );
};

export default LandingPages;
