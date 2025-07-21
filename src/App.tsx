
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import ScrollToTopOnRouteChange from "@/components/ScrollToTopOnRouteChange";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Projetos = lazy(() => import("./pages/Projetos"));
const Ferramentas = lazy(() => import("./pages/Ferramentas"));
const AgentesIA = lazy(() => import("./pages/AgentesIA"));
const SenviaAssistant = lazy(() => import("./pages/SenviaAssistant"));
const LandingPages = lazy(() => import("./pages/LandingPages"));

const Websites = lazy(() => import("./pages/Websites"));
const Ecommerce = lazy(() => import("./pages/Ecommerce"));
const SocialMedia = lazy(() => import("./pages/SocialMedia"));
const TrafegoPago = lazy(() => import("./pages/TrafegoPago"));
const CampaignPresentation = lazy(() => import("./pages/CampaignPresentation"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardProfile = lazy(() => import("./pages/DashboardProfile"));
const DashboardProducts = lazy(() => import("./pages/DashboardProducts"));
const DashboardSettings = lazy(() => import("./pages/DashboardSettings"));
const CRM = lazy(() => import("./pages/CRM"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminContasReceber = lazy(() => import("./pages/AdminContasReceber"));
const AdminReceitasTotal = lazy(() => import("./pages/AdminReceitasTotal"));
const AdminDespesasTotal = lazy(() => import("./pages/AdminDespesasTotal"));
const AdminContasAtraso = lazy(() => import("./pages/AdminContasAtraso"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Blog = lazy(() => import("./pages/Blog"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermosServico = lazy(() => import("./pages/TermosServico"));
const Produtos = lazy(() => import("./pages/Produtos"));
const Starter = lazy(() => import("./pages/Starter"));
const Pro = lazy(() => import("./pages/Pro"));
const Premium = lazy(() => import("./pages/Premium"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <ScrollToTopOnRouteChange />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/projetos" element={<Projetos />} />
                <Route path="/ferramentas" element={<Ferramentas />} />
                <Route path="/agentes-ia" element={<AgentesIA />} />
                <Route path="/senvia-assistant" element={<SenviaAssistant />} />
                <Route path="/landing-pages" element={<LandingPages />} />
                
                <Route path="/websites" element={<Websites />} />
                <Route path="/ecommerce" element={<Ecommerce />} />
                <Route path="/social-media" element={<SocialMedia />} />
                <Route path="/trafego-pago" element={<TrafegoPago />} />
                <Route path="/campaign-presentation" element={<CampaignPresentation />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/obrigado" element={<ThankYou />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/termos-servico" element={<TermosServico />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/starter" element={<Starter />} />
                <Route path="/pro" element={<Pro />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected Routes for Customers */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/profile" element={
                  <ProtectedRoute>
                    <DashboardProfile />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/products" element={
                  <ProtectedRoute>
                    <DashboardProducts />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/settings" element={
                  <ProtectedRoute>
                    <DashboardSettings />
                  </ProtectedRoute>
                } />
                
                {/* Admin Only Routes */}
                <Route path="/crm" element={
                  <AdminRoute>
                    <CRM />
                  </AdminRoute>
                } />
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/admin/contas-receber" element={
                  <AdminRoute>
                    <AdminContasReceber />
                  </AdminRoute>
                } />
                <Route path="/admin/receitas-total" element={
                  <AdminRoute>
                    <AdminReceitasTotal />
                  </AdminRoute>
                } />
                <Route path="/admin/despesas-total" element={
                  <AdminRoute>
                    <AdminDespesasTotal />
                  </AdminRoute>
                } />
                <Route path="/admin/contas-atraso" element={
                  <AdminRoute>
                    <AdminContasAtraso />
                  </AdminRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
