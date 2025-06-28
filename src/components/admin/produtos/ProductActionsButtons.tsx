
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
    setIsDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-stripe-product', {
        body: { product_id: product.id }
      });

      if (error) throw error;

      toast({
        title: "Produto excluído com sucesso!",
        description: "O produto foi desativado no Stripe e removido do banco de dados."
      });

      onUpdate();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro ao excluir produto",
        description: "Não foi possível excluir o produto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditModalOpen(true)}
          className="border-slate-600 text-slate-300 hover:bg-slate-600/50"
        >
          <Edit className="h-4 w-4" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              className="border-red-600 text-red-400 hover:bg-red-600/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-slate-800 border-slate-600">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-slate-100 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                Confirmar Exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400">
                Tem certeza que deseja excluir o produto "{product.name}"? 
                Esta ação irá desativar o produto no Stripe e removê-lo do banco de dados.
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
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
