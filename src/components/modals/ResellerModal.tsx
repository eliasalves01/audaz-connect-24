import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Reseller {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  totalPurchases: string;
  lastOrder: string;
  status: string;
  ordersCount: number;
  joinDate: string;
}

interface ResellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  reseller?: Reseller;
  onSave: (reseller: Reseller) => void;
}

export const ResellerModal = ({ isOpen, onClose, reseller, onSave }: ResellerModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Reseller>(
    reseller || {
      id: 0,
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      totalPurchases: 'R$ 0,00',
      lastOrder: new Date().toISOString().split('T')[0],
      status: 'Ativo',
      ordersCount: 0,
      joinDate: new Date().toISOString().split('T')[0]
    }
  );

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Generate ID if new reseller
    if (!formData.id) {
      formData.id = Date.now();
    }

    onSave(formData);
    toast({
      title: "Sucesso",
      description: reseller ? "Revendedor atualizado com sucesso!" : "Revendedor adicionado com sucesso!"
    });
    onClose();
  };

  const handleChange = (field: keyof Reseller, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{reseller ? 'Editar Revendedor' : 'Novo Revendedor'}</DialogTitle>
          <DialogDescription>
            {reseller ? 'Edite as informações do revendedor' : 'Adicione um novo revendedor ao sistema'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Maria Silva"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="maria@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(11) 98765-4321"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Suspenso">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="São Paulo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Select value={formData.state} onValueChange={(value) => handleChange('state', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {reseller && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalPurchases">Total de Compras</Label>
                <Input
                  id="totalPurchases"
                  value={formData.totalPurchases}
                  onChange={(e) => handleChange('totalPurchases', e.target.value)}
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ordersCount">Número de Pedidos</Label>
                <Input
                  id="ordersCount"
                  type="number"
                  value={formData.ordersCount}
                  onChange={(e) => handleChange('ordersCount', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="button-gradient">
              {reseller ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};