
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import Websites from "./pages/Websites";
import Ecommerce from "./pages/Ecommerce";
import SocialMedia from "./pages/SocialMedia";
import TrafegoPago from "./pages/TrafegoPago";
import AgentesIA from "./pages/AgentesIA";
import Projetos from "./pages/Projetos";
import Ferramentas from "./pages/Ferramentas";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import TermosServico from "./pages/TermosServico";
import MetaPixel from "./components/MetaPixel";
import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MetaPixel />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTopOnRouteChange />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/websites" element={<Websites />} />
          <Route path="/ecommerce" element={<Ecommerce />} />
          <Route path="/social-media" element={<SocialMedia />} />
          <Route path="/trafego-pago" element={<TrafegoPago />} />
          <Route path="/agentes-ia" element={<AgentesIA />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/ferramentas" element={<Ferramentas />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/termos-servico" element={<TermosServico />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
