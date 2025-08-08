import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Palette, Ruler, Package, Calendar } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  size: string;
  price: string;
  image?: string;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
}

export const ProductDetailModal = ({ isOpen, onClose, product, onEdit }: ProductDetailModalProps) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Produto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex gap-6">
            <div className="w-32 h-32 bg-accent/50 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={product.image || "/placeholder.svg"} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-heading-2 mb-2">{product.name}</h3>
                  <Badge variant="secondary" className="text-caption mb-2">
                    {product.id}
                  </Badge>
                </div>
              </div>
              
              <div className="text-2xl font-bold text-primary">{product.price}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-body">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Categoria:</span>
                <span>{product.category}</span>
              </div>
              
              <div className="flex items-center gap-2 text-body">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Tamanho:</span>
                <span>{product.size}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-body">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Código:</span>
                <span>{product.id}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button 
              onClick={() => onEdit(product)}
              className="button-gradient flex-1"
            >
              Editar Produto
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};