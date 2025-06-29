
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Package, 
  LogOut,
  BarChart3,
  UserCheck,
  FileText,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AdminSidebar = ({ activeSection, setActiveSection }: AdminSidebarProps) => {
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      id: 'clientes',
      label: 'Clientes',
      icon: UserCheck
    },
    {
      id: 'blog',
      label: 'Gestão de Blog',
      icon: FileText
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

  const handleMenuItemClick = (itemId: string) => {
    setActiveSection(itemId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-700 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-auto`}>
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-700">
          <div className="text-xl sm:text-2xl font-bold text-senvia-500 glow">SENVIA</div>
          <div className="text-xs sm:text-sm text-gray-400">Admin Dashboard</div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-2 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              onClick={() => handleMenuItemClick(item.id)}
              className={`w-full justify-start gap-2 sm:gap-3 text-xs sm:text-sm p-2 sm:p-3 h-auto ${
                activeSection === item.id 
                  ? 'bg-senvia-500 text-black hover:bg-senvia-400' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 sm:p-4 border-t border-gray-700">
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full justify-start gap-2 sm:gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs sm:text-sm p-2 sm:p-3 h-auto"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
