
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
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          {/* Informações principais */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm truncate">{sale.service_name}</div>
              <div className="text-xs text-gray-400">#{sale.sale_number}</div>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Euro className="h-3 w-3 text-gray-400" />
                <span className="text-white">€{Number(sale.total_value).toFixed(2)}</span>
              </div>
              <span className="text-gray-500">|</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-blue-400" />
                <span className="text-white">
                  {format(new Date(sale.sale_date), 'dd/MM/yy', { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>

          {/* Progresso compacto */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <div className="text-xs text-gray-300">Projeto</div>
              <Progress value={calculateProgress(sale)} className="h-1.5 w-12" />
              <span className="text-xs text-gray-300">{calculateProgress(sale)}%</span>
            </div>
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <div className="text-xs text-gray-300">Pagamento</div>
              <Progress value={calculatePaymentProgress(sale)} className="h-1.5 w-12" />
              <span className="text-xs text-gray-300">{calculatePaymentProgress(sale)}%</span>
            </div>
          </div>

          {/* Status e responsável */}
          <div className="flex items-center gap-2">
            <ProjectAssigneeField
              saleId={sale.id}
              assignedTo={sale.assigned_to}
              onAssigneeUpdate={onAssigneeUpdate}
            />
            <ProjectStatusBadge 
              status={sale.sale_status}
              saleId={sale.id}
              onStatusUpdate={onStatusUpdate}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
