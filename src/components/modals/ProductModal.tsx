import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { type Produto } from "@/hooks/useProdutos";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Produto;
  onSave: (product: Omit<Produto, 'id' | 'created_at' | 'updated_at'>) => void;
}

export const ProductModal = ({ isOpen, onClose, product, onSave }: ProductModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    codigo: product?.codigo || '',
    nome: product?.nome || '',
    categoria: product?.categoria || '',
    tamanho: product?.tamanho || '',
    preco: product?.preco || 0,
    imagem_url: product?.imagem_url || '',
    ativo: product?.ativo ?? true
  });

  const categories = ["blusa", "short", "oversized", "longline", "vestido", "calça"];
  const sizes = ["PP", "P", "M", "G", "GG"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.categoria || !formData.preco) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Generate codigo if new product and no codigo provided
    if (!formData.codigo) {
      const prefix = formData.categoria.substring(0, 2).toUpperCase();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      formData.codigo = `${prefix}${random}`;
    }

    onSave(formData);
    onClose();
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Adicionar Produto'}</DialogTitle>
          <DialogDescription>
            {product ? 'Edite as informações do produto' : 'Adicione um novo produto ao catálogo'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código do Produto</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleChange('codigo', e.target.value)}
                placeholder="Ex: BL001 (deixe vazio para gerar automático)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Ex: Blusa Feminina Floral"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select value={formData.categoria} onValueChange={(value) => handleChange('categoria', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tamanho">Tamanho</Label>
              <Select value={formData.tamanho || ''} onValueChange={(value) => handleChange('tamanho', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tamanho" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco">Preço *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={formData.preco}
                onChange={(e) => handleChange('preco', parseFloat(e.target.value) || 0)}
                placeholder="89.90"
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
            <Label htmlFor="imagem_url">URL da Imagem</Label>
            <Input
              id="imagem_url"
              value={formData.imagem_url || ''}
              onChange={(e) => handleChange('imagem_url', e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {formData.imagem_url && (
              <div className="mt-2">
                <img 
                  src={formData.imagem_url} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="button-gradient">
              {product ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};