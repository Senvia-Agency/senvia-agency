
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Package, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  UserCheck
} from "lucide-react";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AdminSidebar = ({ activeSection, setActiveSection }: AdminSidebarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'leads', label: 'Gestão de Leads', icon: Users },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'subscriptions', label: 'Assinaturas', icon: UserCheck },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 z-50 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="text-xl font-bold text-senvia-500 glow">
              SENVIA ADMIN
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive 
                    ? 'bg-senvia-500 text-black hover:bg-senvia-400' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon className="h-5 w-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={() => navigate('/dashboard')}
        >
          <Home className="h-5 w-5" />
          {!isCollapsed && <span>Dashboard Cliente</span>}
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 mt-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
