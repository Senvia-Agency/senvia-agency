
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

interface ProductImageUploadProps {
  productImages: string[];
  onImagesChange: (images: string[]) => void;
}

const ProductImageUpload = ({ productImages, onImagesChange }: ProductImageUploadProps) => {
  const { toast } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);

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
      onImagesChange([...productImages, randomImage]);
      
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
    onImagesChange(productImages.filter((_, i) => i !== index));
  };

  return (
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
  );
};

export default ProductImageUpload;
