
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import EditProductModal from "./EditProductModal";

interface ProductActionsButtonsProps {
  product: any;
  onUpdate: () => void;
}

const ProductActionsButtons = ({ product, onUpdate }: ProductActionsButtonsProps) => {
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!product?.id) {
      toast({
        title: "Erro",
        description: "ID do produto não encontrado.",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);
    
    try {
      console.log('Tentando deletar produto:', product.id);
      
      const { data, error } = await supabase.functions.invoke('delete-stripe-product', {
        body: { product_id: product.id }
      });

      console.log('Resposta da função delete:', { data, error });

      if (error) {
        console.error('Erro na função delete:', error);
        throw new Error(error.message || 'Erro na comunicação com o servidor');
      }

      if (data && !data.success) {
        console.error('Função retornou erro:', data);
        throw new Error(data.error || 'Erro desconhecido na exclusão');
      }

      toast({
        title: "Produto excluído com sucesso!",
        description: data?.message || "O produto foi removido e desativado no Stripe."
      });

      // Aguardar um pouco antes de atualizar para garantir que a exclusão foi processada
      setTimeout(() => {
        onUpdate();
      }, 1000);

    } catch (error) {
      console.error('Erro completo ao deletar produto:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast({
        title: "Erro ao excluir produto",
        description: `Não foi possível excluir o produto: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex gap-1 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditModalOpen(true)}
          className="border-slate-500 text-slate-300 hover:bg-slate-600 hover:text-slate-100 hover:border-slate-400 px-2 sm:px-3"
          disabled={isDeleting}
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-400 px-2 sm:px-3"
            >
              {isDeleting ? (
                <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
              ) : (
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-slate-800 border-slate-600 max-w-[95vw] sm:max-w-lg mx-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-slate-100 flex items-center gap-2 text-base sm:text-lg">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                Confirmar Exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400 text-sm">
                Tem certeza que deseja excluir o produto "{product?.name || 'Este produto'}"? 
                <br /><br />
                Esta ação irá:
                <ul className="list-disc list-inside mt-2 space-y-1 text-xs sm:text-sm">
                  <li>Desativar o produto no Stripe (se existir)</li>
                  <li>Remover o produto e seus planos do banco de dados</li>
                  <li>Esta ação não pode ser desfeita</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <AlertDialogCancel 
                className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-slate-100 text-sm order-2 sm:order-1"
                disabled={isDeleting}
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white text-sm order-1 sm:order-2"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir Produto'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={onUpdate}
        product={product}
      />
    </>
  );
};

export default ProductActionsButtons;
