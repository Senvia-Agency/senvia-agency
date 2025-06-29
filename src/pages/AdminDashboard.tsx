
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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col lg:flex-row">
        <AdminSidebar 
          activeSection={activeSection} 
          setActiveSection={handleSectionChange} 
        />
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:ml-64 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
