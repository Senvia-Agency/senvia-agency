import { Helmet } from 'react-helmet-async';
import SenviaNavbar from '@/components/senvia/SenviaNavbar';
import ChatbotsHeroSection from '@/components/servicos/chatbots/ChatbotsHeroSection';
import ChatbotsTypesSection from '@/components/servicos/chatbots/ChatbotsTypesSection';
import ChatbotsProcessSection from '@/components/servicos/chatbots/ChatbotsProcessSection';
import ChatbotsDifferentialsSection from '@/components/servicos/chatbots/ChatbotsDifferentialsSection';
import ChatbotsCTASection from '@/components/servicos/chatbots/ChatbotsCTASection';
import HomeFooter from '@/components/home/HomeFooter';

const ServicoChatbots = () => {
  return (
    <>
      <Helmet>
        <title>Chatbots com Inteligência Artificial | SENVIA</title>
        <meta name="description" content="Chatbots com IA para atendimento ao cliente, qualificação de leads e automação de vendas. Disponíveis 24/7 no site, WhatsApp e redes sociais. Agende um diagnóstico gratuito." />
        <link rel="canonical" href="https://www.senvia.pt/chatbots" />
        <meta property="og:title" content="Chatbots com Inteligência Artificial | SENVIA" />
        <meta property="og:description" content="Chatbots com IA para atendimento ao cliente, qualificação de leads e automação de vendas. Disponíveis 24/7." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.senvia.pt/chatbots" />
        <meta property="og:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.senvia.pt/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png" />
      </Helmet>
      <SenviaNavbar />
      <main>
        <ChatbotsHeroSection />
        <ChatbotsTypesSection />
        <ChatbotsProcessSection />
        <ChatbotsDifferentialsSection />
        <ChatbotsCTASection />
      </main>
      <HomeFooter hideCTA />
    </>
  );
};

export default ServicoChatbots;
