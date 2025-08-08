import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  X, 
  Plus,
  ShoppingCart,
  User,
  Package,
  DollarSign
} from "lucide-react";

interface OrderModalProps {
  onClose: () => void;
  onSave: (order: {
    id: string;
    reseller: string;
    items: number;
    value: string;
    date: string;
    description?: string;
  }) => void;
}

export const OrderModal = ({ onClose, onSave }: OrderModalProps) => {
  const [formData, setFormData] = useState({
    reseller: "",
    items: "",
    value: "",
    description: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reseller || !formData.items || !formData.value) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newOrder = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      reseller: formData.reseller,
      items: parseInt(formData.items),
      value: formData.value.includes('R$') ? formData.value : `R$ ${formData.value}`,
      date: new Date().toISOString().split('T')[0],
      description: formData.description
    };

    onSave(newOrder);
    toast({
      title: "Pedido criado!",
      description: `Pedido #${newOrder.id} foi criado com sucesso`
    });
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 bg-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-heading-2">Novo Pedido</CardTitle>
                <p className="text-body-small text-muted-foreground">
                  Criar um novo pedido no sistema
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Revendedor */}
            <div className="space-y-2">
              <Label htmlFor="reseller" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Revendedor *
              </Label>
              <Input
                id="reseller"
                type="text"
                placeholder="Nome do revendedor"
                value={formData.reseller}
                onChange={(e) => handleChange('reseller', e.target.value)}
                className="h-12"
                required
              />
            </div>

            {/* Quantidade de Itens */}
            <div className="space-y-2">
              <Label htmlFor="items" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Quantidade de Itens *
              </Label>
              <Input
                id="items"
                type="number"
                placeholder="Ex: 15"
                value={formData.items}
                onChange={(e) => handleChange('items', e.target.value)}
                className="h-12"
                min="1"
                required
              />
            </div>

            {/* Valor Total */}
            <div className="space-y-2">
              <Label htmlFor="value" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Valor Total *
              </Label>
              <Input
                id="value"
                type="text"
                placeholder="Ex: 2.340,00 ou R$ 2.340,00"
                value={formData.value}
                onChange={(e) => handleChange('value', e.target.value)}
                className="h-12"
                required
              />
            </div>

            {/* Descrição (Opcional) */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Observações (Opcional)
              </Label>
              <Textarea
                id="description"
                placeholder="Adicione observações sobre o pedido..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="button-gradient flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Criar Pedido
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};