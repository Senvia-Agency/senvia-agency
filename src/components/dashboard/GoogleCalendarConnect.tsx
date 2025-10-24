import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar, RefreshCw, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const GoogleCalendarConnect = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState<string>("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  
  const {
    isConnected,
    isLoading,
    lastSync,
    events,
    connectCalendar,
    disconnectCalendar,
    syncNow,
  } = useGoogleCalendar();

  // Check localStorage for saved email
  useEffect(() => {
    const savedEmail = localStorage.getItem('calendar_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setEmailSubmitted(true);
    }
  }, []);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state'); // Email from OAuth state
      
      if (!code) return;

      try {
        const emailToUse = state || email || localStorage.getItem('calendar_email');
        
        if (!emailToUse) {
          toast({
            title: "Email necessário",
            description: "Por favor, forneça seu email antes de conectar.",
            variant: "destructive",
          });
          return;
        }

        const response = await supabase.functions.invoke('google-calendar-oauth', {
          body: { code, email: emailToUse, action: 'connect' }
        });

        if (response.error) {
          throw new Error(response.error.message || 'Failed to connect calendar');
        }

        const data = response.data as { success?: boolean; error?: string; details?: string; email?: string };
        
        if (!data.success || data.error) {
          throw new Error(data.details || data.error || 'Failed to connect calendar');
        }

        // Verify the connection was saved in the database
        const { data: integrationCheck } = await supabase
          .from('customer_calendar_integrations')
          .select('id')
          .eq('email', emailToUse)
          .eq('provider', 'google')
          .maybeSingle();

        if (!integrationCheck) {
          throw new Error('Connection was not saved properly. Please try again.');
        }

        toast({
          title: "Conectado!",
          description: "Google Calendar conectado com sucesso",
        });

        // Save email in localStorage
        localStorage.setItem('calendar_email', emailToUse);
        setEmail(emailToUse);
        setEmailSubmitted(true);

        // Remove code from URL
        searchParams.delete('code');
        searchParams.delete('scope');
        searchParams.delete('state');
        setSearchParams(searchParams);

        // Trigger initial sync
        await syncNow();
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message || "Falha ao conectar calendário",
          variant: "destructive",
        });
      }
    };

    handleOAuthCallback();
  }, [searchParams, email, syncNow, toast]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle>Google Calendar</CardTitle>
          </div>
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
        </div>
        <CardDescription>
          {isConnected 
            ? 'Sua agenda está conectada' 
            : 'Conecte seu calendário para melhorar a experiência'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            {!emailSubmitted ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                  toast({
                    title: "Email inválido",
                    description: "Por favor, insira um email válido.",
                    variant: "destructive",
                  });
                  return;
                }
                localStorage.setItem('calendar_email', email);
                setEmailSubmitted(true);
                toast({
                  title: "Email salvo",
                  description: "Agora você pode conectar seu calendário.",
                });
              }} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Para conectar seu Google Calendar, primeiro precisamos do seu email.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Continuar
                </Button>
              </form>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Email: <strong>{email}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Conecte seu Google Calendar para sincronizar seus eventos.
                </p>
                <Button 
                  onClick={() => connectCalendar(email)} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Conectar Google Calendar
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => {
                    setEmailSubmitted(false);
                    localStorage.removeItem('calendar_email');
                  }}
                  className="w-full"
                >
                  Usar outro email
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            {lastSync && (
              <p className="text-sm text-muted-foreground">
                Última sincronização: {format(lastSync, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={syncNow} 
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Sincronizar
              </Button>
              <Button 
                onClick={async () => {
                  await disconnectCalendar();
                  localStorage.removeItem('calendar_email');
                  setEmail("");
                  setEmailSubmitted(false);
                }} 
                disabled={isLoading}
                variant="destructive"
                className="flex-1"
              >
                <Unplug className="w-4 h-4 mr-2" />
                Desconectar
              </Button>
            </div>

            {events.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Próximos Eventos</h3>
                <div className="space-y-2">
                  {events.slice(0, 5).map((event) => (
                    <div key={event.id} className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.start), "dd/MM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
