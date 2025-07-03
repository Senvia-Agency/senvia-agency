
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ProductDetailModal from "./ProductDetailModal";
import ProductActionsButtons from "./ProductActionsButtons";

interface ProductsTableProps {
  products: any[];
  onUpdate: () => void;
}

const ProductsTable = ({ products, onUpdate }: ProductsTableProps) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const getProductIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      'assistant': '👥',
      'landing_pages': '📄',
      'websites': '🌐',
      'ecommerce': '🛒'
    };
    return iconMap[category] || '📦';
  };

  return (
    <div className="border border-slate-600/50 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-600/50 bg-slate-700/50">
            <TableHead className="text-slate-300">Produto</TableHead>
            <TableHead className="text-slate-300">Categoria</TableHead>
            <TableHead className="text-slate-300">Planos</TableHead>
            <TableHead className="text-slate-300">Status</TableHead>
            <TableHead className="text-slate-300">Criado em</TableHead>
            <TableHead className="text-slate-300">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="border-slate-600/50 hover:bg-slate-700/30">
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getProductIcon(product.category)}</span>
                  <div>
                    <div className="font-medium text-slate-100">{product.name}</div>
                    <div className="text-sm text-slate-400 truncate max-w-xs">
                      {product.description || 'Sem descrição'}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-slate-300 capitalize">
                  {product.category.replace('_', ' ')}
                </span>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {product.product_plans?.length > 0 ? (
                    <span className="text-slate-300">
                      {product.product_plans.length} plano(s)
                    </span>
                  ) : (
                    <span className="text-slate-500">Sem planos</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={product.active ? "default" : "secondary"} 
                  className={product.active ? "bg-green-500/20 text-green-400 border-green-500/50" : ""}
                >
                  {product.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-slate-400 text-sm">
                  {format(new Date(product.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-slate-600 text-slate-300 hover:bg-slate-600/50"
                        onClick={() => setSelectedItem(product)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <ProductDetailModal selectedItem={selectedItem} />
                  </Dialog>
                  
                  <ProductActionsButtons 
                    product={product} 
                    onUpdate={onUpdate}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
