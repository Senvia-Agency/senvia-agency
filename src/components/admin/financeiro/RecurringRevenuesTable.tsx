import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { RecurringService } from "@/hooks/useRecurringServices";
import { EditRecurringServiceModal } from "./EditRecurringServiceModal";

interface RecurringRevenuesTableProps {
  revenues: RecurringService[];
}

const RecurringRevenuesTable = ({ revenues }: RecurringRevenuesTableProps) => {
  const [editingService, setEditingService] = useState<RecurringService | null>(null);

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serviço</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor Mensal</TableHead>
              <TableHead>Dia de Cobrança</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Início</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {revenues.map((revenue) => (
              <TableRow key={revenue.id}>
                <TableCell className="font-medium">{revenue.service_name}</TableCell>
                <TableCell>{revenue.customers?.full_name || '-'}</TableCell>
                <TableCell className="text-green-500 font-semibold">
                  €{Number(revenue.amount).toFixed(2)}
                </TableCell>
                <TableCell>Dia {revenue.billing_day}</TableCell>
                <TableCell>
                  <Badge variant={revenue.status === 'active' ? 'default' : 'secondary'}>
                    {revenue.status === 'active' ? 'Ativo' : revenue.status === 'paused' ? 'Pausado' : 'Cancelado'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(revenue.start_date).toLocaleDateString('pt-PT')}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingService(revenue)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <EditRecurringServiceModal
        service={editingService}
        open={!!editingService}
        onOpenChange={(open) => !open && setEditingService(null)}
      />
    </>
  );
};

export default RecurringRevenuesTable;
