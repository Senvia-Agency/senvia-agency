
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
  FileText
} from "lucide-react";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminSidebar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }: AdminSidebarProps) => {
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

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-700 flex-col">
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

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-700 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-senvia-500 glow">SENVIA</div>
            <div className="text-xs text-gray-400">Admin Dashboard</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              onClick={() => setActiveSection(item.id)}
              className={`w-full justify-start gap-3 text-sm ${
                activeSection === item.id 
                  ? 'bg-senvia-500 text-black hover:bg-senvia-400' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-700">
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full justify-start gap-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
