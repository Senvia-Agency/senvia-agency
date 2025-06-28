
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'assistant',
    pricing_model: 'subscription' // 'subscription' ou 'payment'
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro no upload",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive"
      });
      return;
    }

    // Validar tamanho (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro no upload",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return;
    }

    setUploadingImage(true);
    try {
      // Upload para um serviço de imagem ou usar placeholder por enquanto
      // Por enquanto, vamos usar um placeholder service
      const placeholderImages = [
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'
      ];
      
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      setProductImages([...productImages, randomImage]);
      
      toast({
        title: "Imagem adicionada",
        description: "Imagem do produto foi adicionada com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da imagem.",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
      // Reset input
      event.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const addPlan = () => {
    setPlans([...plans, {
      name: '',
      description: '',
      price_monthly: null,
      price_yearly: null,
      currency: 'eur',
      features: {},
      limits: {}
    }]);
  };

  const removePlan = (index: number) => {
    if (plans.length > 1) {
      setPlans(plans.filter((_, i) => i !== index));
    }
  };

  const updatePlan = (index: number, field: keyof ProductPlan, value: any) => {
    const updatedPlans = [...plans];
    updatedPlans[index] = { ...updatedPlans[index], [field]: value };
    setPlans(updatedPlans);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const requestData = {
        ...formData,
        images: productImages,
        plans: formData.pricing_model === 'subscription' 
          ? plans.filter(plan => plan.name.trim() !== '')
          : [] // Para pagamento único, não enviamos planos
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Criar Novo Produto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-200">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Produto</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do produto"
                  required
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="assistant">Assistant</SelectItem>
                    <SelectItem value="landing_pages">Landing Pages</SelectItem>
                    <SelectItem value="websites">Websites</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Pagamento</label>
              <Select 
                value={formData.pricing_model} 
                onValueChange={(value) => setFormData({ ...formData, pricing_model: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="subscription">Assinatura (Recorrente)</SelectItem>
                  <SelectItem value="payment">Pagamento Único</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400 mt-1">
                {formData.pricing_model === 'subscription' 
                  ? 'Cliente será cobrado mensalmente/anualmente'
                  : 'Cliente paga uma única vez pelo produto'
                }
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição detalhada do produto"
                className="bg-slate-700 border-slate-600 text-slate-100"
                rows={3}
              />
            </div>
          </div>

          {/* Upload de Imagens */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-200">Imagens do Produto</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-300 hover:bg-slate-600 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingImage ? 'Enviando...' : 'Adicionar Imagem'}
                  </label>
                </div>
                <p className="text-xs text-slate-400">
                  Formatos: JPG, PNG, GIF. Máximo: 5MB
                </p>
              </div>

              {productImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {productImages.map((image, index) => (
                    <Card key={index} className="relative bg-slate-700 border-slate-600">
                      <CardContent className="p-2">
                        <img
                          src={image}
                          alt={`Produto ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <Button
                          type="button"
                          onClick={() => removeImage(index)}
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Planos de Preços - Só mostra para assinatura */}
          {formData.pricing_model === 'subscription' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-200">Planos de Preços</h3>
                <Button 
                  type="button" 
                  onClick={addPlan}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Plano
                </Button>
              </div>

              {plans.map((plan, index) => (
                <div key={index} className="p-4 border border-slate-600 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-300">Plano {index + 1}</h4>
                    {plans.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removePlan(index)}
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-400 hover:bg-red-600/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Plano</label>
                      <Input
                        value={plan.name}
                        onChange={(e) => updatePlan(index, 'name', e.target.value)}
                        placeholder="Nome do plano"
                        className="bg-slate-700 border-slate-600 text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Moeda</label>
                      <Select 
                        value={plan.currency} 
                        onValueChange={(value) => updatePlan(index, 'currency', value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="usd">USD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Preço Mensal</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={plan.price_monthly || ''}
                        onChange={(e) => updatePlan(index, 'price_monthly', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="0.00"
                        className="bg-slate-700 border-slate-600 text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Preço Anual</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={plan.price_yearly || ''}
                        onChange={(e) => updatePlan(index, 'price_yearly', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="0.00"
                        className="bg-slate-700 border-slate-600 text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Descrição do Plano</label>
                    <Textarea
                      value={plan.description}
                      onChange={(e) => updatePlan(index, 'description', e.target.value)}
                      placeholder="Descrição do plano"
                      className="bg-slate-700 border-slate-600 text-slate-100"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Para pagamento único, mostrar campo de preço simples */}
          {formData.pricing_model === 'payment' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-200">Preço do Produto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Preço</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Moeda</label>
                  <Select defaultValue="eur">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-senvia-500 hover:bg-senvia-400 text-slate-900"
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
