
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CreditCard, FileText, TrendingUp } from "lucide-react";
import DashboardStats from "./DashboardStats";
import RecentActivity from "./RecentActivity";
import ActiveSubscriptions from "./ActiveSubscriptions";

const DashboardOverview = () => {
  const { user } = useAuth();

  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['customer-subscriptions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_subscriptions')
        .select(`
          *,
          products:product_id(*),
          product_plans:plan_id(*)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['customer-invoices', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (subscriptionsLoading || invoicesLoading) {
    return <div className="p-6">Carregando dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo à sua área de cliente SENVIA
        </p>
      </div>

      <DashboardStats subscriptions={subscriptions || []} invoices={invoices || []} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActiveSubscriptions subscriptions={subscriptions || []} />
        <RecentActivity invoices={invoices || []} />
      </div>
    </div>
  );
};

export default DashboardOverview;
