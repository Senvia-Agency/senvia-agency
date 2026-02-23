import { Helmet } from 'react-helmet-async';
import SenviaNavbar from '@/components/senvia/SenviaNavbar';
import SenviaHeroSection from '@/components/senvia/SenviaHeroSection';
import SenviaServicesSection from '@/components/senvia/SenviaServicesSection';
import SenviaWhyUsSection from '@/components/senvia/SenviaWhyUsSection';

import StatsSection from '@/components/home2/StatsSection';
import GoogleReviewsSection from '@/components/home/GoogleReviewsSection';
import HomeFooter from '@/components/home/HomeFooter';

const SenviaHome = () => {
  return (
    <>
      <Helmet>
        <title>SENVIA — AI Software House | Software à Medida, Automação & CRM</title>
        <meta name="description" content="SENVIA é uma AI Software House. Desenvolvimento de software à medida, sites, e-commerces, automações com IA e o nosso CRM proprietário SENVIA OS." />
        <link rel="canonical" href="https://senvia-agency.lovable.app/" />
      </Helmet>
      <SenviaNavbar />
      <main>
        <SenviaHeroSection />
        <SenviaServicesSection />
        <SenviaWhyUsSection />
        
        <StatsSection />
        <GoogleReviewsSection />
      </main>
      <HomeFooter />
    </>
  );
};

export default SenviaHome;
