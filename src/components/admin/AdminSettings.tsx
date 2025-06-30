import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Settings, Shield, Key, Bell, User } from "lucide-react";
import WebhookSetup from "./WebhookSetup";

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    companyName: "SENVIA",
    email: "admin@senvia.pt",
    notifications: true,
    webhookUrl: ""
  });

  const handleSave = () => {
    // Aqui você salvaria as configurações
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso."
    });
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white leading-tight break-words">
          Configurações<br className="sm:hidden" /> do Sistema
        </h1>
        <p className="text-gray-400 text-sm md:text-base break-words">
          Gerencie as configurações<br className="sm:hidden" /> gerais da plataforma
        </p>
      </div>

      {/* General Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="companyName" className="text-gray-300">Nome da Empresa</Label>
              <Input id="companyName" defaultValue={settings.companyName} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input id="email" type="email" defaultValue={settings.email} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Button onClick={handleSave} className="bg-senvia-500 hover:bg-senvia-600">Salvar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="password" className="text-gray-300">Alterar Senha</Label>
              <Input id="password" type="password" placeholder="Nova senha" className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Senha</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirmar nova senha" className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Button onClick={handleSave} className="bg-senvia-500 hover:bg-senvia-600">Salvar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="notifications" className="text-gray-300">Receber notificações por email</Label>
              {/* Implementar um switch ou checkbox aqui */}
            </div>
            <div>
              <Button onClick={handleSave} className="bg-senvia-500 hover:bg-senvia-600">Salvar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="w-4 h-4" />
            API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="apiKey" className="text-gray-300">Chave da API</Label>
              <Input id="apiKey" type="text" readOnly value="xxxxxxxxxxxxxxxxxxxxx" className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Button onClick={handleSave} className="bg-senvia-500 hover:bg-senvia-600">Gerar nova chave</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Settings */}
      <WebhookSetup />
    </div>
  );
};

export default AdminSettings;
