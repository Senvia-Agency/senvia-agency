
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText } from "lucide-react";

interface RecentActivityProps {
  invoices: any[];
}

const RecentActivity = ({ invoices }: RecentActivityProps) => {
  return (
    <Card className="bg-card/50 border-senvia-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Nenhuma atividade recente encontrada.
            </p>
            <Button 
              onClick={() => window.location.href = '/dashboard/products'}
              className="bg-white text-black hover:bg-gray-200"
            >
              Explorar Produtos
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between border-b border-senvia-500/20 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-senvia-500/20 rounded-lg">
                    <FileText className="w-4 h-4 text-senvia-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      Fatura #{invoice.invoice_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">
                    €{parseFloat(invoice.amount).toFixed(2)}
                  </p>
                  <span className={`text-sm px-2 py-1 rounded ${
                    invoice.status === 'paid' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {invoice.status === 'paid' ? 'Paga' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
