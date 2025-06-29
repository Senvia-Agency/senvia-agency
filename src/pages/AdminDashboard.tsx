
import { useEffect, useState, useCallback } from "react";
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
  const [activeSection, setActiveSection] = useState(() => {
    try {
      return localStorage.getItem(SECTION_STORAGE_KEY) || DEFAULT_SECTION;
    } catch (error) {
      console.error('Erro ao recuperar seção ativa:', error);
      return DEFAULT_SECTION;
    }
  });

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

  const renderActiveSection = () => {
    console.log('AdminDashboard: Rendering section:', activeSection);
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
  };

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
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64">
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
          
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
