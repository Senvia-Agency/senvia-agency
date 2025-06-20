
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import SenviaAssistant from "./pages/SenviaAssistant";
import LandingPages from "./pages/LandingPages";
import CRM from "./pages/CRM";
import Auth from "./pages/Auth";
import MetaPixel from "./components/MetaPixel";
import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
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
            <Route path="/senvia-assistant" element={<SenviaAssistant />} />
            <Route path="/landing-pages" element={<LandingPages />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/crm" 
              element={
                <ProtectedRoute>
                  <CRM />
                </ProtectedRoute>
              } 
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
