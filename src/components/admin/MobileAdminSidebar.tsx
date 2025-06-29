
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  LogOut,
  BarChart3,
  UserCheck,
  FileText,
  Menu,
  X
} from "lucide-react";

interface MobileAdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MobileAdminSidebar = ({ activeSection, setActiveSection }: MobileAdminSidebarProps) => {
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: LayoutDashboard
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: Users
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: UserCheck
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: FileText
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: BarChart3
    },
    {
      id: 'produtos-assinaturas',
      label: 'Produtos',
      icon: Package
    }
  ];

  const handleMenuClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-700 flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="text-2xl font-bold text-senvia-500 glow">SENVIA</div>
          <div className="text-sm text-slate-400">Admin Dashboard</div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              onClick={() => setActiveSection(item.id)}
              className={`w-full justify-start gap-3 text-sm ${
                activeSection === item.id 
                  ? 'bg-senvia-500 text-slate-900 font-semibold hover:bg-senvia-400' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
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

      {/* Mobile Header with Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-xl font-bold text-senvia-500">SENVIA</div>
            <div className="text-xs text-slate-400 hidden sm:block">Admin</div>
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-slate-900 border-l-slate-700 p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-senvia-500">SENVIA</div>
                      <div className="text-sm text-slate-400">Admin Dashboard</div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-4 space-y-3">
                  {menuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full justify-start gap-4 h-12 text-base ${
                        activeSection === item.id 
                          ? 'bg-senvia-500 text-slate-900 font-semibold' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-700">
                  <Button
                    variant="ghost"
                    onClick={signOut}
                    className="w-full justify-start gap-4 h-12 text-base text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut className="h-5 w-5" />
                    Sair da Conta
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Active Section Indicator */}
        <div className="mt-2">
          <div className="text-sm font-medium text-white">
            {menuItems.find(item => item.id === activeSection)?.label}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileAdminSidebar;
