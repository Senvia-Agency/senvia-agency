
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProductDetailModalProps {
  selectedItem: any;
}

const ProductDetailModal = ({ selectedItem }: ProductDetailModalProps) => {
  if (!selectedItem) return null;

  return (
    <DialogContent className="max-w-2xl bg-slate-800 border-slate-600">
      <DialogHeader>
        <DialogTitle className="text-slate-100">Detalhes do Produto</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-300">Nome</label>
            <p className="text-sm text-slate-400">{selectedItem.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Categoria</label>
            <p className="text-sm text-slate-400 capitalize">
              {selectedItem.category.replace('_', ' ')}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Status</label>
            <p className="text-sm text-slate-400">
              {selectedItem.status === 'active' && selectedItem.active ? 'Ativo' : 'Inativo'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Modelo de Preços</label>
            <p className="text-sm text-slate-400 capitalize">
              {selectedItem.pricing_model}
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Descrição</label>
          <p className="text-sm text-slate-400 mt-1">
            {selectedItem.description || 'Sem descrição disponível'}
          </p>
        </div>

        {selectedItem.features && (
          <div>
            <label className="text-sm font-medium text-slate-300">Funcionalidades</label>
            <div className="mt-2 space-y-1">
              {Object.entries(selectedItem.features).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-slate-400 capitalize">{key.replace('_', ' ')}</span>
                  <span className="text-slate-300">
                    {typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-slate-300">Planos</label>
          <div className="mt-2 space-y-2">
            {selectedItem.product_plans?.map((plan: any) => (
              <Card key={plan.id} className="bg-slate-700 border-slate-600">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">{plan.name}</h4>
                      <p className="text-xs text-slate-400">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-senvia-500">
                        €{plan.price_monthly}/mês
                      </div>
                      {plan.price_yearly && (
                        <div className="text-xs text-slate-400">
                          €{plan.price_yearly}/ano
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-600">
          <div>
            <label className="text-sm font-medium text-slate-300">Data de Criação</label>
            <p className="text-sm text-slate-400">
              {format(new Date(selectedItem.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Última Atualização</label>
            <p className="text-sm text-slate-400">
              {format(new Date(selectedItem.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
            </p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default ProductDetailModal;
