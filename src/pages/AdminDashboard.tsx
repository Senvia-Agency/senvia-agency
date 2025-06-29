
import { useEffect, useState, useCallback } from "react";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminLeads from "@/components/admin/AdminLeads";
import AdminClientes from "@/components/admin/AdminClientes";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminFinanceiro from "@/components/admin/AdminFinanceiro";
import AdminProdutosAssinaturas from "@/components/admin/AdminProdutosAssinaturas";
import MobileAdminSidebar from "@/components/admin/MobileAdminSidebar";

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

  const handleSectionChange = useCallback((section: string) => {
    console.log('AdminDashboard: Changing section from', activeSection, 'to', section);
    setActiveSection(section);
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
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      <MobileAdminSidebar 
        activeSection={activeSection} 
        setActiveSection={handleSectionChange} 
      />
      
      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-0 w-full max-w-full overflow-x-hidden">
        <div className="w-full max-w-full">
          <div className="max-w-7xl mx-auto w-full">
            {renderActiveSection()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
