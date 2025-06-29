
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminLeads from "@/components/admin/AdminLeads";
import AdminClientes from "@/components/admin/AdminClientes";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminFinanceiro from "@/components/admin/AdminFinanceiro";
import AdminProdutosAssinaturas from "@/components/admin/AdminProdutosAssinaturas";

const SECTION_STORAGE_KEY = 'admin-active-section';
const DEFAULT_SECTION = 'overview';

const AdminDashboard = () => {
  const { user, loading: authLoading, isAdmin, adminLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeSection, setActiveSection] = useState(() => {
    try {
      return localStorage.getItem(SECTION_STORAGE_KEY) || DEFAULT_SECTION;
    } catch (error) {
      console.error('Erro ao recuperar seção ativa:', error);
      return DEFAULT_SECTION;
    }
  });

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    try {
      localStorage.setItem(SECTION_STORAGE_KEY, section);
    } catch (error) {
      console.error('Erro ao salvar seção ativa:', error);
    }
  }, []);

  // Memoize loading states to prevent unnecessary re-renders
  const isLoading = useMemo(() => {
    return authLoading || adminLoading;
  }, [authLoading, adminLoading]);

  const shouldRedirect = useMemo(() => {
    return !authLoading && !adminLoading && (!user || !isAdmin);
  }, [authLoading, adminLoading, user, isAdmin]);

  // Auth check - Only redirect when we're absolutely sure about the auth state
  useEffect(() => {
    if (shouldRedirect) {
      console.log('Redirecting to auth - User:', !!user, 'IsAdmin:', isAdmin);
      navigate('/auth', { replace: true });
    }
  }, [shouldRedirect, navigate]);

  // Set document title only once
  useEffect(() => {
    document.title = "Admin Dashboard | SENVIA";
  }, []);

  // Memoize section renderer to prevent unnecessary re-renders
  const renderActiveSection = useMemo(() => {
    switch (activeSection) {
      case 'overview':
        return <AdminOverview />;
      case 'leads':
        return <AdminLeads />;
      case 'clientes':
        return <AdminClientes />;
      case 'blog':
        return <AdminBlog />;
      case 'financeiro':
        return <AdminFinanceiro />;
      case 'produtos-assinaturas':
        return <AdminProdutosAssinaturas />;
      default:
        return <AdminOverview />;
    }
  }, [activeSection]);

  // Loading states with better UX
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-senvia-500 glow mb-4">SENVIA</div>
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-senvia-500"></div>
            <p className="text-gray-400">
              {authLoading ? 'Verificando autenticação...' : 'Verificando permissões...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (shouldRedirect) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        <AdminSidebar 
          activeSection={activeSection} 
          setActiveSection={handleSectionChange} 
        />
        <main className="flex-1 p-6 lg:p-8 ml-64">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
