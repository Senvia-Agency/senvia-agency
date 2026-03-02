import { Helmet } from 'react-helmet-async';
import Home2Navbar from '@/components/home2/Home2Navbar';
import OSHeroSection from '@/components/senvia-os/OSHeroSection';
import OSProcessSection from '@/components/senvia-os/OSProcessSection';
import OSBenefitsSection from '@/components/senvia-os/OSBenefitsSection';
import OSFAQSection from '@/components/senvia-os/OSFAQSection';
import OSFinalCTASection from '@/components/senvia-os/OSFinalCTASection';
import HomeFooter from '@/components/home/HomeFooter';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>SENVIA OS — Sistema para Agências de Telecomunicações e Energia</title>
        <meta name="description" content="Calcule comissões, múltiplos e estornos de forma 100% automática. O sistema definitivo para agências de telecomunicações e energia." />
        <link rel="canonical" href="https://www.senvia.pt/senvia-os" />
        <meta property="og:title" content="SENVIA OS — Sistema para Agências de Telecomunicações e Energia" />
        <meta property="og:description" content="Calcule comissões, múltiplos e estornos de forma 100% automática. Tranque a sua margem de lucro sem erros humanos." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.senvia.pt/senvia-os" />
        <meta property="og:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
      </Helmet>
      <Home2Navbar />
      <main>
        <OSHeroSection />
        <OSProcessSection />
        <OSBenefitsSection />
        <OSFAQSection />
        <OSFinalCTASection />
      </main>
      <HomeFooter hideCTA />
    </>
  );
};

export default Home;
