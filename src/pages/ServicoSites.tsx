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
        <link rel="canonical" href="https://senvia-agency.lovable.app/sites" />
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
