
import React, { useState } from "react";
import {
  BarChart,
  Users,
  DollarSign,
  Package,
  CreditCard,
  RefreshCw,
  FileText,
  Settings,
  UserCheck,
  TrendingUp,
  Menu,
  User,
  LogOut
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
    { id: "financeiro", label: "Financeiro", icon: DollarSign },
    { id: "produtos", label: "Produtos & Assinaturas", icon: Package },
    { id: "pagamentos", label: "Pagamentos", icon: CreditCard },
    { id: "assinaturas", label: "Assinaturas", icon: RefreshCw },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "configuracoes", label: "Configurações", icon: Settings }
  ];

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId);
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
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="flex items-center justify-between py-2">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </div>
          <Separator />
          <div className="grid gap-4 py-4">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start ${activeSection === item.id ? 'font-semibold' : ''}`}
                onClick={() => handleNavigation(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
          <Separator />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start w-full mt-2">
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
      <div className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 h-screen py-4">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        </div>
        <Separator className="my-4" />
        <div className="flex-grow flex flex-col gap-4 px-4">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start ${activeSection === item.id ? 'font-semibold' : ''}`}
              onClick={() => handleNavigation(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
        <Separator />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="justify-start w-full mt-2">
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
    </>
  );
};

export default AdminSidebar;
