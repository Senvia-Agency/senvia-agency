import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import ScrollToTopOnRouteChange from "@/components/ScrollToTopOnRouteChange";
import GTMPageView from "@/components/GTMPageView";
import CookieConsent from "@/components/CookieConsent";

// Lazy load crítico primeiro
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Lazy load demais páginas
const LandingPages = lazy(() => import("./pages/LandingPages"));
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
const ExemplosIAAtendimento = lazy(() => import("./pages/ExemplosIAAtendimento"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading ultra-rápido
const QuickLoader = () => (
  <div className="fixed inset-0 bg-background flex items-center justify-center">
    <div className="w-4 h-4 border border-senvia-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  useEffect(() => {
    // Initialize dataLayer if not present
    if (typeof window !== 'undefined') {
      if (!(window as any).dataLayer) {
        (window as any).dataLayer = [];
      }
      
      // Push initial event to ensure GTM is working
      (window as any).dataLayer.push({
        'event': 'gtm_initialized',
        'gtm_container_id': 'GTM-KL72LGGS'
      });
      
      console.log('GTM Debug - dataLayer exists:', !!(window as any).dataLayer);
      console.log('GTM Debug - script loaded:', !!document.querySelector('script[src*="gtm.js"]'));
    }
  }, []);

  return (
    <TooltipProvider>
      <AuthProvider>
        <Router>
          <ScrollToTopOnRouteChange />
          <GTMPageView />
          <Suspense fallback={<QuickLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/landing-pages" element={<LandingPages />} />
              <Route path="/obrigado" element={<ThankYou />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/termos-servico" element={<TermosServico />} />
              <Route path="/exemplos-ia-atendimento" element={<ExemplosIAAtendimento />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/calendar" element={<CalendarConnect />} />
              
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
              <Route path="/admin/receitas-mensais" element={
                <AdminRoute>
                  <AdminReceitasMensais />
                </AdminRoute>
              } />
              <Route path="/admin/despesas-mensais" element={
                <AdminRoute>
                  <AdminDespesasMensais />
                </AdminRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CookieConsent />
          <Toaster />
        </Router>
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;