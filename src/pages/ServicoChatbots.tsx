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
        <link rel="canonical" href="https://senvia-agency.lovable.app/chatbots" />
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
