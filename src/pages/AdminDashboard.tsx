
import { useEffect, useState, useCallback } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminLeads from "@/components/admin/AdminLeads";
import AdminClientes from "@/components/admin/AdminClientes";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminFinanceiro from "@/components/admin/AdminFinanceiro";
import AdminProdutosAssinaturas from "@/components/admin/AdminProdutosAssinaturas";
import AdminVendas from "@/components/admin/AdminVendas";
import AdminPayments from "@/components/admin/AdminPayments";
import AdminSubscriptions from "@/components/admin/AdminSubscriptions";
import AdminSettings from "@/components/admin/AdminSettings";

const SECTION_STORAGE_KEY = 'admin-active-section';
const DEFAULT_SECTION = 'overview';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverview />;
      case "leads":
        return <AdminLeads />;
      case "vendas":
        return <AdminVendas />;
      case "clientes":
        return <AdminClientes />;
      case "financeiro":
        return <AdminFinanceiro />;
      case "produtos":
        return <AdminProdutosAssinaturas />;
      case "pagamentos":
        return <AdminPayments />;
      case "assinaturas":
        return <AdminSubscriptions />;
      case "blog":
        return <AdminBlog />;
      case "configuracoes":
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSectionChange = useCallback((section: string) => {
    console.log('AdminDashboard: Changing section from', activeSection, 'to', section);
    setActiveSection(section);
    setSidebarOpen(false); // Fechar sidebar no mobile após seleção
    try {
      localStorage.setItem(SECTION_STORAGE_KEY, section);
    } catch (error) {
      console.error('Erro ao salvar seção ativa:', error);
    }
  }, [activeSection]);

  useEffect(() => {
    document.title = "Admin Dashboard | SENVIA";
    console.log('AdminDashboard: Component mounted');
    
    return () => {
      console.log('AdminDashboard: Component will unmount');
    };
  }, []);

  useEffect(() => {
    console.log('AdminDashboard: Active section changed to:', activeSection);
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        <AdminSidebar 
          activeSection={activeSection} 
          setActiveSection={handleSectionChange}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1 min-w-0 p-4 lg:p-6">
          {/* Header mobile com hambúrguer */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <div className="max-w-full mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
