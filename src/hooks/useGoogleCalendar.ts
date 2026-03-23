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
  connectCalendar: (email: string) => void;
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
      const savedEmail = localStorage.getItem('calendar_email');
      
      if (!user && !savedEmail) return;

      // Check by user_id or email
      let query = (supabase
        .from('customer_calendar_integrations') as any)
        .select('*')
        .eq('provider', 'google');

      if (user?.id) {
        query = query.eq('user_id', user.id);
      } else if (savedEmail) {
        query = query.eq('email', savedEmail);
      }

      const { data, error } = await query.maybeSingle() as any;

      if (!error && data) {
        setIsConnected(true);
        setLastSync(data.last_synced_at ? new Date(data.last_synced_at) : null);
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  const connectCalendar = (email: string) => {
    if (!clientId) {
      toast({
        title: "Erro",
        description: "Configuração do Google não carregada",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Erro",
        description: "Email é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const redirectUri = `${window.location.origin}/calendar`;
    const scope = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=${encodeURIComponent(email)}`;

    window.location.href = authUrl;
  };

  const disconnectCalendar = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const savedEmail = localStorage.getItem('calendar_email');

      if (!user && !savedEmail) throw new Error('No connection found');

      // Delete by user_id or email
      let query = supabase
        .from('customer_calendar_integrations')
        .delete()
        .eq('provider', 'google');

      if (user?.id) {
        query = query.eq('user_id', user.id);
      } else if (savedEmail) {
        query = query.eq('email', savedEmail);
      }

      const { error } = await query;

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
