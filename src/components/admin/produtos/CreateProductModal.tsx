
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BasicProductInfo from "./BasicProductInfo";
import ProductImageUpload from "./ProductImageUpload";
import ProductPlansSection from "./ProductPlansSection";
import OneTimePricing from "./OneTimePricing";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ProductPlan {
  name: string;
  description: string;
  price_monthly: number | null;
  price_yearly: number | null;
  currency: string;
  features: Record<string, any>;
  limits: Record<string, any>;
}

const CreateProductModal = ({ isOpen, onClose, onSuccess }: CreateProductModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'assistant',
    pricing_model: 'subscription'
  });
  const [plans, setPlans] = useState<ProductPlan[]>([
    {
      name: '',
      description: '',
      price_monthly: null,
      price_yearly: null,
      currency: 'eur',
      features: {},
      limits: {}
    }
  ]);
  const [oneTimePrice, setOneTimePrice] = useState<number | null>(null);
  const [oneTimeCurrency, setOneTimeCurrency] = useState('eur');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const requestData = {
        ...formData,
        images: productImages,
        plans: formData.pricing_model === 'subscription' 
          ? plans.filter(plan => plan.name.trim() !== '')
          : [{
              name: `${formData.name} - Pagamento Único`,
              description: `Compre ${formData.name} com pagamento único`,
              price_monthly: oneTimePrice,
              price_yearly: null,
              currency: oneTimeCurrency,
              features: {},
              limits: {}
            }]
      };

      const { data, error } = await supabase.functions.invoke('create-stripe-product', {
        body: requestData
      });

      if (error) throw error;

      toast({
        title: "Produto criado com sucesso!",
        description: "O produto foi criado no Stripe e sincronizado com o banco de dados."
      });

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'assistant',
        pricing_model: 'subscription'
      });
      setPlans([{
        name: '',
        description: '',
        price_monthly: null,
        price_yearly: null,
        currency: 'eur',
        features: {},
        limits: {}
      }]);
      setProductImages([]);
      setOneTimePrice(null);
      setOneTimeCurrency('eur');
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Erro ao criar produto",
        description: "Não foi possível criar o produto. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-600 mx-auto">
        <DialogHeader className="px-3 sm:px-6">
          <DialogTitle className="text-slate-100 text-lg sm:text-xl">Criar Novo Produto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
          <BasicProductInfo 
            formData={formData} 
            onFormDataChange={setFormData} 
          />

          <ProductImageUpload 
            productImages={productImages}
            onImagesChange={setProductImages}
          />

          {formData.pricing_model === 'subscription' ? (
            <ProductPlansSection 
              plans={plans}
              onPlansChange={setPlans}
            />
          ) : (
            <OneTimePricing
              price={oneTimePrice}
              currency={oneTimeCurrency}
              onPriceChange={setOneTimePrice}
              onCurrencyChange={setOneTimeCurrency}
            />
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-senvia-500 hover:bg-senvia-400 text-slate-900 order-1 sm:order-2"
            >
              {isLoading ? 'Criando...' : 'Criar Produto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductModal;
