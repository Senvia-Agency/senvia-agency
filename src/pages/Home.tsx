import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Home2Navbar from '@/components/home2/Home2Navbar';
import OSHeroSection from '@/components/senvia-os/OSHeroSection';

const OSProcessSection = lazy(() => import('@/components/senvia-os/OSProcessSection'));
const OSBenefitsSection = lazy(() => import('@/components/senvia-os/OSBenefitsSection'));
const OSFAQSection = lazy(() => import('@/components/senvia-os/OSFAQSection'));
const OSFinalCTASection = lazy(() => import('@/components/senvia-os/OSFinalCTASection'));
const HomeFooter = lazy(() => import('@/components/home/HomeFooter'));

const Home = () => {
  return (
    <>
      <Helmet>
        <title>SENVIA OS — Sistema para Agências de Telecomunicações e Energia</title>
        <meta name="description" content="Calcule comissões, múltiplos e estornos de forma 100% automática. O sistema definitivo para agências de telecomunicações e energia." />
        <link rel="canonical" href="https://www.senvia.pt/senvia-os" />
        <link rel="preload" as="image" href="/images/mockup-senvia-os.svg" />
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
        <Suspense fallback={null}>
          <OSProcessSection />
          <OSBenefitsSection />
          <OSFAQSection />
          <OSFinalCTASection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <HomeFooter hideCTA />
      </Suspense>
    </>
  );
};

export default Home;
