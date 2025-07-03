
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomService } from "@/hooks/useCustomServices";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit } from "lucide-react";

interface CustomServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: CustomService | null;
  onEdit: () => void;
}

const CustomServiceDetailModal = ({ isOpen, onClose, service, onEdit }: CustomServiceDetailModalProps) => {
  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-600">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-slate-100">Detalhes do Serviço</DialogTitle>
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="border-senvia-500 text-senvia-500 hover:bg-senvia-500/10"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Nome</label>
              <p className="text-sm text-slate-100 mt-1">{service.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Categoria</label>
              <p className="text-sm text-slate-400 capitalize mt-1">
                {service.category.replace('_', ' ')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Status</label>
              <div className="mt-1">
                <Badge variant={service.status === 'active' ? "default" : "secondary"} 
                       className={service.status === 'active' ? "bg-green-500/20 text-green-400 border-green-500/50" : ""}>
                  {service.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Preço Base</label>
              <p className="text-sm text-senvia-400 font-medium mt-1">€{service.base_price}</p>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-sm font-medium text-slate-300">Descrição</label>
            <p className="text-sm text-slate-400 mt-1">
              {service.description || 'Sem descrição disponível'}
            </p>
          </div>

          {/* Configurações do Serviço */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Tipo de Serviço</label>
              <p className="text-sm text-slate-400 capitalize mt-1">
                {service.service_type.replace('_', ' ')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Modelo de Preços</label>
              <p className="text-sm text-slate-400 capitalize mt-1">
                {service.pricing_model.replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Horas Estimadas (se aplicável) */}
          {service.estimated_hours && (
            <div>
              <label className="text-sm font-medium text-slate-300">Horas Estimadas</label>
              <p className="text-sm text-slate-400 mt-1">{service.estimated_hours} horas</p>
            </div>
          )}

          {/* Funcionalidades Incluídas */}
          {service.includes_features && service.includes_features.length > 0 && (
            <div>
              <label className="text-sm font-medium text-slate-300">Funcionalidades Incluídas</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {service.includes_features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="border-slate-600 text-slate-400">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-600">
            <div>
              <label className="text-sm font-medium text-slate-300">Data de Criação</label>
              <p className="text-sm text-slate-400 mt-1">
                {format(new Date(service.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Última Atualização</label>
              <p className="text-sm text-slate-400 mt-1">
                {format(new Date(service.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomServiceDetailModal;
