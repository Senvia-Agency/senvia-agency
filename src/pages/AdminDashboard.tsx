
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminLeads from "@/components/admin/AdminLeads";
import AdminClientes from "@/components/admin/AdminClientes";
import AdminFinanceiro from "@/components/admin/AdminFinanceiro";
import AdminProdutosAssinaturas from "@/components/admin/AdminProdutosAssinaturas";

const AdminDashboard = () => {
  const { user, loading: authLoading, isAdmin, adminLoading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (!authLoading && !adminLoading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  useEffect(() => {
    document.title = "Admin Dashboard | SENVIA";
  }, []);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-senvia-500 glow mb-4">SENVIA</div>
          <p className="text-gray-400">Carregando dashboard administrativo...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminOverview />;
      case 'leads':
        return <AdminLeads />;
      case 'clientes':
        return <AdminClientes />;
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
          setActiveSection={setActiveSection} 
        />
        <main className="flex-1 p-6 lg:p-8 ml-64">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
