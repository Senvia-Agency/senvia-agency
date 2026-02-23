import { Helmet } from 'react-helmet-async';
import Home2Navbar from '@/components/home2/Home2Navbar';
import Hero2Section from '@/components/home2/Hero2Section';
import SenviaOSSection from '@/components/home2/SenviaOSSection';
import PricingSection from '@/components/home2/PricingSection';
import NichosSection from '@/components/home2/NichosSection';
import SoftwareHouseSection from '@/components/home2/SoftwareHouseSection';
import StatsSection from '@/components/home2/StatsSection';
import HomeFooter from '@/components/home/HomeFooter';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>SENVIA — AI Software House | CRM Inteligente & Desenvolvimento à Medida</title>
        <meta name="description" content="Software inteligente com resultados reais. SENVIA OS: CRM com IA, automações e módulos completos. Desenvolvimento de software, sites e e-commerces." />
        <link rel="canonical" href="https://senvia-agency.lovable.app/" />
      </Helmet>
      <Home2Navbar />
      <main>
        <Hero2Section />
        <SenviaOSSection />
        <PricingSection />
        <NichosSection />
        <SoftwareHouseSection />
        <StatsSection />
      </main>
      <HomeFooter />
    </>
  );
};

export default Home;
