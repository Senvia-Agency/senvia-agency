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
        <title>SENVIA | Landing Pages de Alta Conversão + IA para Qualificação de Leads</title>
        <meta name="description" content="Pare de perder tempo com curiosos. Construímos Landing Pages de Alta Conversão e instalamos o SENVIA OS que diz exatamente quem está pronto para comprar." />
        <link rel="canonical" href="https://www.senvia.pt/" />
        <meta property="og:title" content="SENVIA | Máquinas de Vendas Inteligentes" />
        <meta property="og:description" content="Landing Pages de Alta Conversão + SENVIA OS: IA que qualifica leads automaticamente e entrega apenas quem está pronto para comprar." />
        <meta property="og:url" content="https://www.senvia.pt/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SENVIA | Máquinas de Vendas Inteligentes" />
        <meta name="twitter:description" content="Landing Pages + IA para qualificação de leads. Elimine o ruído, foque no sinal." />
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
