import { Helmet } from 'react-helmet-async';
import SenviaNavbar from '@/components/senvia/SenviaNavbar';
import SitesHeroSection from '@/components/servicos/sites/SitesHeroSection';
import SitesTypesSection from '@/components/servicos/sites/SitesTypesSection';
import SitesProcessSection from '@/components/servicos/sites/SitesProcessSection';
import SitesDifferentialsSection from '@/components/servicos/sites/SitesDifferentialsSection';
import SitesCTASection from '@/components/servicos/sites/SitesCTASection';
import HomeFooter from '@/components/home/HomeFooter';

const ServicoSites = () => {
  return (
    <>
      <Helmet>
        <title>Criação de Sites, Landing Pages & E-commerces | SENVIA</title>
        <meta name="description" content="Criamos sites institucionais, landing pages de alta conversão e lojas online com design premium, performance de topo e SEO otimizado. Peça orçamento gratuito." />
        <link rel="canonical" href="https://www.senvia.pt/sites" />
        <meta property="og:title" content="Criação de Sites, Landing Pages & E-commerces | SENVIA" />
        <meta property="og:description" content="Criamos sites institucionais, landing pages de alta conversão e lojas online com design premium, performance de topo e SEO otimizado." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.senvia.pt/sites" />
        <meta property="og:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
      </Helmet>
      <SenviaNavbar />
      <main>
        <SitesHeroSection />
        <SitesTypesSection />
        <SitesProcessSection />
        <SitesDifferentialsSection />
        <SitesCTASection />
      </main>
      <HomeFooter hideCTA />
    </>
  );
};

export default ServicoSites;
