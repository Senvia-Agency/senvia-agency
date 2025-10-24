import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar, RefreshCw, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const GoogleCalendarConnect = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const {
    isConnected,
    isLoading,
    lastSync,
    events,
    connectCalendar,
    disconnectCalendar,
    syncNow,
  } = useGoogleCalendar();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code');
      if (!code) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const response = await supabase.functions.invoke('google-calendar-oauth', {
          body: { code, action: 'connect' },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.error) throw response.error;

        toast({
          title: "Conectado!",
          description: "Google Calendar conectado com sucesso",
        });

        // Remove code from URL
        searchParams.delete('code');
        searchParams.delete('scope');
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
  }, [searchParams]);

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
            <p className="text-sm text-muted-foreground">
              Ao conectar, você permite que a Senvia acesse seus eventos para fornecer um atendimento mais personalizado.
            </p>
            <Button 
              onClick={connectCalendar} 
              disabled={isLoading}
              className="w-full"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Conectar Google Calendar
            </Button>
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
                onClick={disconnectCalendar} 
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
