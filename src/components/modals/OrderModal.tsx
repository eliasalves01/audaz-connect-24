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
import { useProdutos } from "@/hooks/useProdutos";
import { useRevendedores } from "@/hooks/useRevendedores";
import { usePedidos } from "@/hooks/usePedidos";

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

  const { produtos } = useProdutos();
  const { revendedores } = useRevendedores();
  const { criarPedido, loading: criandoPedido } = usePedidos();
  
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

// Os dados virão dos hooks - remover mocks


// Calcular valor total sempre que os itens mudarem (usando dados reais)
useEffect(() => {
  const total = orderItems.reduce((sum, item) => {
    const product = produtos.find(p => p.id === item.productId);
    if (product) {
      return sum + (product.preco * item.quantity);
    }
    return sum;
  }, 0);
  setTotalValue(total);
}, [orderItems, produtos]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!selectedReseller || orderItems.length === 0) {
    toast({
      title: "Campos obrigatórios",
      description: "Selecione um revendedor e adicione pelo menos um produto",
      variant: "destructive"
    });
    return;
  }

  try {
    const itens = orderItems.map((item) => {
      const product = produtos.find(p => p.id === item.productId);
      if (!product) throw new Error('Produto inválido');
      return {
        produto_id: product.id,
        codigo: product.codigo,
        quantidade: item.quantity,
        preco_unitario: product.preco,
      };
    });

    const pedido = await criarPedido(selectedReseller, itens);

    const totalItems = orderItems.reduce((sum, i) => sum + i.quantity, 0);
    const selectedResellerData = revendedores.find(r => r.id === selectedReseller);

    onSave({
      id: pedido.id,
      reseller: selectedResellerData?.nome || "",
      items: totalItems,
      value: `R$ ${totalValue.toFixed(2).replace('.', ',')}`,
      date: pedido.data_pedido,
    });

    onClose();
  } catch (error) {
    // Erro já tosteado no hook
  }
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
  {revendedores.map((r) => (
    <SelectItem key={r.id} value={r.id}>
      {r.nome} - {r.email}
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
{produtos.map((product) => {
  const quantity = getProductQuantity(product.id);
  return (
    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium">{product.nome}</h4>
        <p className="text-sm text-muted-foreground">
          {product.categoria}{product.tamanho ? ` • ${product.tamanho}` : ''} • R$ {product.preco.toFixed(2).replace('.', ',')}
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
  disabled={!selectedReseller || orderItems.length === 0 || criandoPedido}
>
  <Plus className="h-4 w-4 mr-2" />
  {criandoPedido ? 'Criando...' : 'Criar Pedido'}
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