import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { type Revendedor } from "@/hooks/useRevendedores";

interface ResellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  reseller?: Revendedor;
  onSave: (reseller: Partial<Revendedor>) => void;
}

export const ResellerModal = ({ isOpen, onClose, reseller, onSave }: ResellerModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: reseller?.nome || '',
    email: reseller?.email || '',
    telefone: reseller?.telefone || '',
    endereco: reseller?.endereco || '',
    ativo: reseller?.ativo ?? true,
    senha: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (!reseller && !formData.senha) {
      toast({
        title: "Erro",
        description: "Senha é obrigatória para novos revendedores",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleChange = (field: string, value: string | boolean) => {
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
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
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
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                placeholder="(11) 98765-4321"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ativo">Status</Label>
              <Select value={formData.ativo ? "true" : "false"} onValueChange={(value) => handleChange('ativo', value === "true")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleChange('endereco', e.target.value)}
              placeholder="Rua, Cidade, Estado"
            />
          </div>

          {!reseller && (
            <div className="space-y-2">
              <Label htmlFor="senha">Senha de Acesso *</Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => handleChange('senha', e.target.value)}
                placeholder="Senha para acesso do revendedor"
                minLength={6}
              />
              <p className="text-sm text-muted-foreground">
                Esta senha será usada pelo revendedor para acessar o sistema
              </p>
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