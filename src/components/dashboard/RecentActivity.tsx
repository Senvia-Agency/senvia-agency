
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentActivityProps {
  invoices: any[];
}

const RecentActivity = ({ invoices }: RecentActivityProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: "Paga", variant: "default" as const },
      pending: { label: "Pendente", variant: "secondary" as const },
      failed: { label: "Falhada", variant: "destructive" as const },
      refunded: { label: "Reembolsada", variant: "outline" as const },
    };

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Atividade Recente
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/dashboard/invoices')}
        >
          Ver todas <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma atividade recente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => {
              const statusConfig = getStatusBadge(invoice.status);
              
              return (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">Fatura #{invoice.invoice_number}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(invoice.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={statusConfig.variant} className="mb-1">
                      {statusConfig.label}
                    </Badge>
                    <p className="text-sm font-medium">
                      €{parseFloat(invoice.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
