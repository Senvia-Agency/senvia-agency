import { Helmet } from 'react-helmet-async';
import SenviaNavbar from '@/components/senvia/SenviaNavbar';
import SoftwaresHeroSection from '@/components/servicos/softwares/SoftwaresHeroSection';
import SoftwaresTypesSection from '@/components/servicos/softwares/SoftwaresTypesSection';
import SoftwaresProcessSection from '@/components/servicos/softwares/SoftwaresProcessSection';
import SoftwaresDifferentialsSection from '@/components/servicos/softwares/SoftwaresDifferentialsSection';
import SoftwaresCTASection from '@/components/servicos/softwares/SoftwaresCTASection';
import HomeFooter from '@/components/home/HomeFooter';

const ServicoSoftwares = () => {
  return (
    <>
      <Helmet>
        <title>Desenvolvimento de Software à Medida | SENVIA</title>
        <meta name="description" content="Desenvolvemos sistemas de gestão, portais, APIs e aplicações web complexas à medida do seu negócio. Tecnologias modernas, código limpo e suporte dedicado." />
        <link rel="canonical" href="https://www.senvia.pt/softwares" />
        <meta property="og:title" content="Desenvolvimento de Software à Medida | SENVIA" />
        <meta property="og:description" content="Desenvolvemos sistemas de gestão, portais, APIs e aplicações web complexas à medida do seu negócio." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.senvia.pt/softwares" />
        <meta property="og:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
      </Helmet>
      <SenviaNavbar />
      <main>
        <SoftwaresHeroSection />
        <SoftwaresTypesSection />
        <SoftwaresProcessSection />
        <SoftwaresDifferentialsSection />
        <SoftwaresCTASection />
      </main>
      <HomeFooter hideCTA />
    </>
  );
};

export default ServicoSoftwares;
