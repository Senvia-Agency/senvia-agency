
import React, { useState } from "react";
import {
  BarChart,
  Users,
  DollarSign,
  Settings,
  UserCheck,
  TrendingUp,
  User,
  LogOut,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminSidebar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }: AdminSidebarProps) => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: "overview", label: "Visão Geral", icon: BarChart },
    { id: "leads", label: "Leads", icon: Users },
    { id: "vendas", label: "Vendas", icon: TrendingUp },
    { id: "clientes", label: "Clientes", icon: UserCheck },
    { id: "meus-projetos", label: "Meus Projetos", icon: FolderOpen },
    { id: "financeiro", label: "Financeiro", icon: DollarSign },
    { id: "configuracoes", label: "Configurações", icon: Settings }
  ];

  const handleNavigation = (sectionId: string) => {
    // Se estamos em uma página admin separada, navegar para o dashboard com a seção
    if (window.location.pathname !== '/admin') {
      navigate(`/admin?tab=${sectionId}`);
    } else {
      setActiveSection(sectionId);
    }
    setSidebarOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Sessão encerrada com sucesso.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Não foi possível encerrar a sessão.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Mobile Menu */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 bg-gray-800 border-gray-700">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-senvia-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-lg text-white">SENVIA</span>
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <div className="grid gap-2 py-4">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start text-white hover:bg-gray-700 ${
                  activeSection === item.id ? 'bg-senvia-500 hover:bg-senvia-600 font-semibold' : ''
                }`}
                onClick={() => handleNavigation(item.id)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
          <Separator className="bg-gray-700" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start w-full mt-4 text-white hover:bg-gray-700">
                <Avatar className="mr-3 h-6 w-6">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@admin" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <span>Minha Conta</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SheetContent>
      </Sheet>

      {/* Desktop Menu */}
      <div className="hidden lg:flex flex-col w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
        <div className="flex items-center gap-2 p-6 border-b border-gray-700">
          <div className="w-8 h-8 bg-senvia-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-lg text-white">SENVIA</span>
        </div>
        
        <div className="flex-1 flex flex-col gap-2 p-4">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start text-white hover:bg-gray-700 ${
                activeSection === item.id ? 'bg-senvia-500 hover:bg-senvia-600 font-semibold' : ''
              }`}
              onClick={() => handleNavigation(item.id)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
        
        <div className="border-t border-gray-700 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start w-full text-white hover:bg-gray-700">
                <Avatar className="mr-3 h-6 w-6">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@admin" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <span>Minha Conta</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
