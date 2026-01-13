import { Helmet } from "react-helmet-async";
import HomeNavbar from '@/components/home/HomeNavbar';
import HeroSection from '@/components/home/HeroSection';
import ProblemSection from '@/components/home/ProblemSection';
import SolutionSection from '@/components/home/SolutionSection';
import TechnologySection from '@/components/home/TechnologySection';
import QualificationSection from '@/components/home/QualificationSection';
import ProofSection from '@/components/home/ProofSection';
import HomeFooter from '@/components/home/HomeFooter';
import ScrollToTop from "../components/ScrollToTop";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>SENVIA | Só Fale Com Quem Quer Comprar - Funis de Vendas + IA</title>
        <meta name="description" content="Chega de leads frios. A SENVIA cria o seu funil de vendas e integra inteligência artificial para filtrar os curiosos. A sua equipa só recebe oportunidades reais." />
        <link rel="canonical" href="https://www.senvia.pt/" />
        <meta property="og:title" content="SENVIA | Só Fale Com Quem Quer Comprar" />
        <meta property="og:description" content="A SENVIA cria o seu funil de vendas e integra IA para filtrar curiosos. A sua equipa só recebe oportunidades reais." />
        <meta property="og:url" content="https://www.senvia.pt/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SENVIA | Só Fale Com Quem Quer Comprar" />
        <meta name="twitter:description" content="Funis de Vendas + IA para qualificação de leads. Elimine o ruído, foque no sinal." />
        <meta name="twitter:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HomeNavbar />
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <TechnologySection />
        <QualificationSection />
        <ProofSection />
        <HomeFooter />
        <ScrollToTop />
      </div>
    </>
  );
};

export default Index;
