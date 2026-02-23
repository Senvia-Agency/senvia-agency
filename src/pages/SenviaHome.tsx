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
        <link rel="canonical" href="https://www.senvia.pt/" />
        <meta property="og:title" content="SENVIA — AI Software House | Software à Medida, Automação & CRM" />
        <meta property="og:description" content="SENVIA é uma AI Software House. Desenvolvimento de software à medida, sites, e-commerces, automações com IA e o nosso CRM proprietário SENVIA OS." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.senvia.pt/" />
        <meta property="og:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
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
