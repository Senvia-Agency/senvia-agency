import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecurringService } from "@/hooks/useRecurringServices";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, User } from "lucide-react";

interface RecurringRevenuesTableGroupedProps {
  revenues: RecurringService[];
}

interface CustomerGroup {
  customerId: string | null;
  customerName: string;
  services: RecurringService[];
  totalMonthly: number;
}

const RecurringRevenuesTableGrouped = ({ revenues }: RecurringRevenuesTableGroupedProps) => {
  // Agrupar por cliente
  const groupedByCustomer = useMemo(() => {
    const groups = new Map<string | null, CustomerGroup>();
    
    revenues.forEach(revenue => {
      const customerId = revenue.customer_id;
      const customerName = revenue.customers?.full_name || 'Sem Cliente Associado';
      
      if (!groups.has(customerId)) {
        groups.set(customerId, {
          customerId,
          customerName,
          services: [],
          totalMonthly: 0
        });
      }
      
      const group = groups.get(customerId)!;
      group.services.push(revenue);
      group.totalMonthly += Number(revenue.amount);
    });
    
    // Converter para array e ordenar por valor total (maior primeiro)
    return Array.from(groups.values()).sort((a, b) => b.totalMonthly - a.totalMonthly);
  }, [revenues]);

  return (
    <div className="space-y-2">
      {groupedByCustomer.map((group) => (
        <CustomerGroupCard key={group.customerId || 'no-customer'} group={group} />
      ))}
      
      {groupedByCustomer.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          Nenhuma receita mensal recorrente encontrada.
        </div>
      )}
    </div>
  );
};

// Componente individual de grupo de cliente
const CustomerGroupCard = ({ group }: { group: CustomerGroup }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              {isOpen ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
              <User className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-base">{group.customerName}</div>
                <div className="text-sm text-muted-foreground">
                  {group.services.length} serviço{group.services.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-lg font-bold">
                €{group.totalMonthly.toFixed(2)}/mês
              </Badge>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="border-t">
            <div className="p-4 space-y-3">
              {group.services.map((service) => (
                <div 
                  key={service.id} 
                  className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{service.service_name}</div>
                    {service.service_description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {service.service_description}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Dia {service.billing_day}</span>
                      <span>Início: {new Date(service.start_date).toLocaleDateString('pt-PT')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                      {service.status === 'active' ? 'Ativo' : service.status === 'paused' ? 'Pausado' : 'Cancelado'}
                    </Badge>
                    <div className="text-green-500 font-bold text-lg">
                      €{Number(service.amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default RecurringRevenuesTableGrouped;
