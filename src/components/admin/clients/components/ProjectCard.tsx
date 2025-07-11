
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Euro, Package, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProjectAssigneeField } from "./ProjectAssigneeField";
import { Badge } from "@/components/ui/badge";

type SaleStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue';

interface Sale {
  id: string;
  sale_number: string;
  service_name: string;
  service_description?: string;
  total_value: number;
  paid_amount: number;
  sale_status: SaleStatus;
  payment_status: PaymentStatus;
  sale_date: string;
  expected_delivery_date?: string;
  delivered_at?: string;
  created_at: string;
  assigned_to?: string;
}

interface ProjectCardProps {
  sale: Sale;
  onStatusUpdate: (saleId: string, newStatus: SaleStatus) => void;
  onAssigneeUpdate: (saleId: string, newAssignee: string) => void;
}

const calculateProgress = (sale: Sale) => {
  if (sale.sale_status === 'completed') return 100;
  if (sale.sale_status === 'cancelled') return 0;
  if (sale.sale_status === 'in_progress') return 50;
  if (sale.sale_status === 'confirmed') return 25;
  return 10; // pending
};

const calculatePaymentProgress = (sale: Sale) => {
  if (sale.total_value === 0) return 0;
  return Math.round((sale.paid_amount / sale.total_value) * 100);
};

const getPaymentStatusColor = (status: PaymentStatus) => {
  const colorMap: { [key in PaymentStatus]: string } = {
    'pending': 'bg-yellow-500',
    'partial': 'bg-orange-500',
    'paid': 'bg-green-500',
    'overdue': 'bg-red-500'
  };
  return colorMap[status];
};

const getPaymentStatusLabel = (status: PaymentStatus) => {
  const statusMap: { [key in PaymentStatus]: string } = {
    'pending': 'Pendente',
    'partial': 'Parcial', 
    'paid': 'Pago',
    'overdue': 'Em Atraso'
  };
  return statusMap[status];
};

export const ProjectCard = ({ sale, onStatusUpdate, onAssigneeUpdate }: ProjectCardProps) => {
  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-white text-base truncate">{sale.service_name}</CardTitle>
            <p className="text-xs text-gray-400 mt-1">#{sale.sale_number}</p>
          </div>
          <ProjectStatusBadge 
            status={sale.sale_status}
            saleId={sale.id}
            onStatusUpdate={onStatusUpdate}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0">
        <ProjectAssigneeField
          saleId={sale.id}
          assignedTo={sale.assigned_to}
          onAssigneeUpdate={onAssigneeUpdate}
        />

        {/* Progresso compacto */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-300">Projeto</span>
              <span className="text-xs text-gray-300">{calculateProgress(sale)}%</span>
            </div>
            <Progress value={calculateProgress(sale)} className="h-1.5" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-300">Pagamento</span>
              <span className="text-xs text-gray-300">{calculatePaymentProgress(sale)}%</span>
            </div>
            <Progress value={calculatePaymentProgress(sale)} className="h-1.5" />
          </div>
        </div>

        {/* Informações compactas */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Euro className="h-3 w-3 text-gray-400" />
            <div>
              <span className="text-gray-400">Total: </span>
              <span className="text-white font-medium">€{Number(sale.total_value).toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Euro className="h-3 w-3 text-green-400" />
            <div>
              <span className="text-gray-400">Pago: </span>
              <span className="text-green-400 font-medium">€{Number(sale.paid_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Datas compactas */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-blue-400" />
            <div>
              <span className="text-gray-400">Início: </span>
              <span className="text-white">
                {format(new Date(sale.sale_date), 'dd/MM/yy', { locale: ptBR })}
              </span>
            </div>
          </div>
          
          {sale.expected_delivery_date && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-orange-400" />
              <div>
                <span className="text-gray-400">Entrega: </span>
                <span className="text-white">
                  {format(new Date(sale.expected_delivery_date), 'dd/MM/yy', { locale: ptBR })}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
