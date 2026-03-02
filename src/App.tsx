import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTopOnRouteChange from "@/components/ScrollToTopOnRouteChange";
import GTMPageView from "@/components/GTMPageView";
const CookieConsent = lazy(() => import("@/components/CookieConsent"));
const Toaster = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));

// Lazy load crítico primeiro
const SenviaHome = lazy(() => import("./pages/SenviaHome"));
const Home = lazy(() => import("./pages/Home"));
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Lazy load demais páginas
const DashboardProfile = lazy(() => import("./pages/DashboardProfile"));
const DashboardProducts = lazy(() => import("./pages/DashboardProducts"));
const DashboardSettings = lazy(() => import("./pages/DashboardSettings"));
const CalendarConnect = lazy(() => import("./pages/CalendarConnect"));

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminContasReceber = lazy(() => import("./pages/AdminContasReceber"));
const AdminReceitasTotal = lazy(() => import("./pages/AdminReceitasTotal"));
const AdminDespesasTotal = lazy(() => import("./pages/AdminDespesasTotal"));
const AdminContasAtraso = lazy(() => import("./pages/AdminContasAtraso"));
const AdminReceitasMensais = lazy(() => import("./pages/AdminReceitasMensais"));
const AdminDespesasMensais = lazy(() => import("./pages/AdminDespesasMensais"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermosServico = lazy(() => import("./pages/TermosServico"));
const PoliticaCookies = lazy(() => import("./pages/PoliticaCookies"));
const SobreNos = lazy(() => import("./pages/SobreNos"));
const ServicoSites = lazy(() => import("./pages/ServicoSites"));
const ServicoChatbots = lazy(() => import("./pages/ServicoChatbots"));
const ServicoSoftwares = lazy(() => import("./pages/ServicoSoftwares"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load auth-related wrappers
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const AdminRoute = lazy(() => import("./components/AdminRoute"));
const AuthProvider = lazy(() => import("./components/AuthProviderWrapper"));

// Loading ultra-rápido
const QuickLoader = () => (
  <div className="fixed inset-0 bg-background flex items-center justify-center">
    <div className="w-4 h-4 border border-senvia-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!(window as any).dataLayer) {
        (window as any).dataLayer = [];
      }
      (window as any).dataLayer.push({
        'event': 'gtm_initialized',
        'gtm_container_id': 'GTM-KL72LGGS'
      });
    }
  }, []);

  return (
    <Router>
      <ScrollToTopOnRouteChange />
      <GTMPageView />
      <Suspense fallback={<QuickLoader />}>
        <Routes>
            {/* Public routes - no AuthProvider needed */}
            <Route path="/" element={<SenviaHome />} />
            <Route path="/senvia-os" element={<Home />} />
            <Route path="/funis" element={<Index />} />
            <Route path="/obrigado" element={<ThankYou />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
            <Route path="/termos-servico" element={<TermosServico />} />
            <Route path="/politica-cookies" element={<PoliticaCookies />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/sites" element={<ServicoSites />} />
            <Route path="/chatbots" element={<ServicoChatbots />} />
            <Route path="/softwares" element={<ServicoSoftwares />} />
            <Route path="/auth" element={
              <Suspense fallback={<QuickLoader />}>
                <AuthProvider><Auth /></AuthProvider>
              </Suspense>
            } />
            <Route path="/calendar" element={<CalendarConnect />} />
            
            {/* Protected Routes - wrapped in AuthProvider */}
            <Route path="/dashboard" element={
              <Suspense fallback={<QuickLoader />}>
                <AuthProvider><ProtectedRoute><Dashboard /></ProtectedRoute></AuthProvider>
              </Suspense>
            } />
            <Route path="/dashboard/profile" element={
              <Suspense fallback={<QuickLoader />}>
                <AuthProvider><ProtectedRoute><DashboardProfile /></ProtectedRoute></AuthProvider>
              </Suspense>
            } />
            <Route path="/dashboard/products" element={
              <Suspense fallback={<QuickLoader />}>
                <AuthProvider><ProtectedRoute><DashboardProducts /></ProtectedRoute></AuthProvider>
              </Suspense>
            } />
            <Route path="/dashboard/settings" element={
              <Suspense fallback={<QuickLoader />}>
                <AuthProvider><ProtectedRoute><DashboardSettings /></ProtectedRoute></AuthProvider>
              </Suspense>
            } />
            
            {/* Admin Only Routes */}
            <Route path="/admin" element={
              <Suspense fallback={<QuickLoader />}>
                <AuthProvider><AdminRoute><AdminDashboard /></AdminRoute></AuthProvider>
              </Suspense>
            } />
            <Route path="/admin/contas-receber" element={
              <Suspense fallback={<QuickLoader />}>
                <AuthProvider><AdminRoute><AdminContasReceber /></AdminRoute></AuthProvider>
              </Suspense>
            } />
            <Route path="/admin/receitas-total" element={
              <Suspense fallback={<QuickLoader />}>
                <AuthProvider><AdminRoute><AdminReceitasTotal /></AdminRoute></AuthProvider>
              </Suspense>
            } />
            <Route path="/admin/despesas-total" element={
              <Suspense fallback={<QuickLoader />}>
                <AuthProvider><AdminRoute><AdminDespesasTotal /></AdminRoute></AuthProvider>
              </Suspense>
            } />
            <Route path="/admin/contas-atraso" element={
              <Suspense fallback={<QuickLoader />}>
                <AuthProvider><AdminRoute><AdminContasAtraso /></AdminRoute></AuthProvider>
              </Suspense>
            } />
            <Route path="/admin/receitas-mensais" element={
              <Suspense fallback={<QuickLoader />}>
                <AuthProvider><AdminRoute><AdminReceitasMensais /></AdminRoute></AuthProvider>
              </Suspense>
            } />
            <Route path="/admin/despesas-mensais" element={
              <Suspense fallback={<QuickLoader />}>
                <AuthProvider><AdminRoute><AdminDespesasMensais /></AdminRoute></AuthProvider>
              </Suspense>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      <Suspense fallback={null}><CookieConsent /></Suspense>
      <Suspense fallback={null}><Toaster /></Suspense>
    </Router>
  );
}

export default App;
