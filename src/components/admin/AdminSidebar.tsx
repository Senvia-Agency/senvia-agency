
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Package, 
  LogOut,
  BarChart3
} from "lucide-react";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AdminSidebar = ({ activeSection, setActiveSection }: AdminSidebarProps) => {
  const { signOut } = useAuth();

  const menuItems = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: LayoutDashboard
    },
    {
      id: 'leads',
      label: 'Gestão de Leads',
      icon: Users
    },
    {
      id: 'financeiro',
      label: 'Módulo Financeiro',
      icon: BarChart3
    },
    {
      id: 'produtos-assinaturas',
      label: 'Produtos & Assinaturas',
      icon: Package
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="text-2xl font-bold text-senvia-500 glow">SENVIA</div>
        <div className="text-sm text-gray-400">Admin Dashboard</div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            onClick={() => setActiveSection(item.id)}
            className={`w-full justify-start gap-3 ${
              activeSection === item.id 
                ? 'bg-senvia-500 text-black hover:bg-senvia-400' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
