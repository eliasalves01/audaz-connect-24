import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  X, 
  Plus,
  ShoppingCart,
  User,
  Package,
  DollarSign,
  Minus
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  size: string;
  price: string;
}

interface Reseller {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
}

interface OrderModalProps {
  onClose: () => void;
  onSave: (order: {
    id: string;
    reseller: string;
    items: number;
    value: string;
    date: string;
  }) => void;
}

export const OrderModal = ({ onClose, onSave }: OrderModalProps) => {
  const [selectedReseller, setSelectedReseller] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const { toast } = useToast();

  // Mock data - em produção viria de um contexto/API
  const products: Product[] = [
    {
      id: "SH001",
      name: "Camiseta Short Básica",
      category: "short",
      size: "M",
      price: "R$ 89,90"
    },
    {
      id: "OV002", 
      name: "Moletom Oversized",
      category: "oversized",
      size: "G",
      price: "R$ 159,90"
    },
    {
      id: "LO003",
      name: "Blusa Longline Listrada",
      category: "longline",
      size: "P",
      price: "R$ 199,90"
    }
  ];

  const resellers: Reseller[] = [
    {
      id: "R001",
      name: "Maria Silva",
      email: "maria@email.com",
      phone: "(11) 99999-9999",
      city: "São Paulo"
    },
    {
      id: "R002",
      name: "João Santos",
      email: "joao@email.com", 
      phone: "(11) 88888-8888",
      city: "Rio de Janeiro"
    }
  ];

  // Calcular valor total sempre que os itens mudarem
  useEffect(() => {
    const total = orderItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const price = parseFloat(product.price.replace('R$ ', '').replace(',', '.'));
        return sum + (price * item.quantity);
      }
      return sum;
    }, 0);
    setTotalValue(total);
  }, [orderItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReseller || orderItems.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um revendedor e adicione pelo menos um produto",
        variant: "destructive"
      });
      return;
    }

    const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const selectedResellerData = resellers.find(r => r.id === selectedReseller);

    const newOrder = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      reseller: selectedResellerData?.name || "",
      items: totalItems,
      value: `R$ ${totalValue.toFixed(2).replace('.', ',')}`,
      date: new Date().toISOString().split('T')[0]
    };

    onSave(newOrder);
    toast({
      title: "Pedido criado!",
      description: `Pedido #${newOrder.id} foi criado com sucesso`
    });
    onClose();
  };

  const addProduct = (productId: string) => {
    setOrderItems(prev => {
      const existingItem = prev.find(item => item.productId === productId);
      if (existingItem) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { productId, quantity: 1 }];
      }
    });
  };

  const removeProduct = (productId: string) => {
    setOrderItems(prev => {
      const existingItem = prev.find(item => item.productId === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prev.filter(item => item.productId !== productId);
      }
    });
  };

  const getProductQuantity = (productId: string) => {
    const item = orderItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
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
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Revendedor *
              </Label>
              <Select value={selectedReseller} onValueChange={setSelectedReseller}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione um revendedor" />
                </SelectTrigger>
                <SelectContent>
                  {resellers.map((reseller) => (
                    <SelectItem key={reseller.id} value={reseller.id}>
                      {reseller.name} - {reseller.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Produtos */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Produtos *
              </Label>
              <div className="space-y-3">
                {products.map((product) => {
                  const quantity = getProductQuantity(product.id);
                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.category} - {product.size} - {product.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {quantity > 0 && (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeProduct(product.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{quantity}</span>
                          </>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addProduct(product.id)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resumo do Pedido */}
            {orderItems.length > 0 && (
              <div className="p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4" />
                  <Label>Resumo do Pedido</Label>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Total de itens:</span>
                    <span>{orderItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Valor total:</span>
                    <span>R$ {totalValue.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="button-gradient flex-1"
                disabled={!selectedReseller || orderItems.length === 0}
              >
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