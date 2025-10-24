import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  location: string;
  attendees: string[];
  status: string;
  link: string;
}

interface UseGoogleCalendar {
  isConnected: boolean;
  isLoading: boolean;
  lastSync: Date | null;
  events: CalendarEvent[];
  connectCalendar: () => void;
  disconnectCalendar: () => Promise<void>;
  syncNow: () => Promise<void>;
  error: string | null;
}

export const useGoogleCalendar = (): UseGoogleCalendar => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
    fetchGoogleConfig();
  }, []);

  const fetchGoogleConfig = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-google-config');
      if (!error && data) {
        setClientId(data.clientId);
      }
    } catch (err) {
      console.error('Error fetching Google config:', err);
    }
  };

  const checkConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('customer_calendar_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .single();

      if (!error && data) {
        setIsConnected(true);
        setLastSync(data.last_synced_at ? new Date(data.last_synced_at) : null);
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  const connectCalendar = () => {
    if (!clientId) {
      toast({
        title: "Erro",
        description: "Configuração do Google não carregada",
        variant: "destructive",
      });
      return;
    }

    const redirectUri = `${window.location.origin}/dashboard/calendar`;
    const scope = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent`;

    window.location.href = authUrl;
  };

  const disconnectCalendar = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('customer_calendar_integrations')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', 'google');

      if (error) throw error;

      setIsConnected(false);
      setEvents([]);
      setLastSync(null);

      toast({
        title: "Desconectado",
        description: "Google Calendar desconectado com sucesso",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Falha ao desconectar calendário",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncNow = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('sync-google-calendar', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      setEvents(response.data.events || []);
      setLastSync(new Date(response.data.synced_at));

      toast({
        title: "Sincronizado",
        description: `${response.data.count} eventos encontrados`,
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro",
        description: "Falha ao sincronizar calendário",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    isLoading,
    lastSync,
    events,
    connectCalendar,
    disconnectCalendar,
    syncNow,
    error,
  };
};
