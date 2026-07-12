import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RecurringService } from "@/hooks/useRecurringServices";

interface RecurringExpensesTableProps {
  expenses: RecurringService[];
}

const RecurringExpensesTable = ({ expenses }: RecurringExpensesTableProps) => {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome da Despesa</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor Mensal</TableHead>
            <TableHead>Dia de Cobrança</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Início</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.service_name}</TableCell>
              <TableCell>{expense.service_description || '-'}</TableCell>
              <TableCell className="text-red-500 font-semibold">
                €{Number(expense.amount).toFixed(2)}
              </TableCell>
              <TableCell>Dia {expense.billing_day}</TableCell>
              <TableCell>
                <Badge variant={expense.status === 'active' ? 'default' : 'secondary'}>
                  {expense.status === 'active' ? 'Ativo' : expense.status === 'paused' ? 'Pausado' : 'Cancelado'}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(expense.start_date).toLocaleDateString('pt-PT')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default RecurringExpensesTable;
