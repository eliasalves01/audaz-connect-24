import { useState } from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, Loader2 } from "lucide-react";
import type { Produto, ProdutoInsert } from "@/integrations/supabase/types";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Produto;
  onSave: (product: ProdutoInsert, imageFile?: File) => void;
  uploadImage?: (file: File) => Promise<string>;
  isLoading?: boolean;
}

export const ProductModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onSave, 
  uploadImage,
  isLoading = false 
}: ProductModalProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    codigo: product?.codigo || '',
    nome: product?.nome || '',
    categoria: product?.categoria || '',
    tamanho: product?.tamanho || '',
    preco: product?.preco || 0,
    imagem_url: product?.imagem_url || '',
    ativo: product?.ativo ?? true
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive"
      });
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const categories = ["blusa", "short", "oversized", "longline", "vestido", "calça"];
  const sizes = ["PP", "P", "M", "G", "GG"];

  const handleSubmit = async (e: React.FormEvent) => {
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

    let finalFormData = { ...formData };

    // Upload image if selected
    if (imageFile && uploadImage) {
      try {
        setUploading(true);
        const imageUrl = await uploadImage(imageFile);
        finalFormData.imagem_url = imageUrl;
      } catch (error) {
        toast({
          title: "Erro no upload",
          description: "Não foi possível fazer upload da imagem",
          variant: "destructive"
        });
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    onSave(finalFormData);
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

          <div className="space-y-4">
            <Label>Imagem do Produto</Label>
            
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-6">
              {imagePreview || formData.imagem_url ? (
                <div className="relative">
                  <img 
                    src={imagePreview || formData.imagem_url || ''} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Clique para selecionar uma imagem
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP até 5MB
                  </p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            {/* URL Input as fallback */}
            <div className="space-y-2">
              <Label htmlFor="imagem_url" className="text-sm text-muted-foreground">
                Ou insira uma URL da imagem
              </Label>
              <Input
                id="imagem_url"
                value={formData.imagem_url || ''}
                onChange={(e) => handleChange('imagem_url', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                className="text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="button-gradient"
              disabled={isLoading || uploading}
            >
              {isLoading || uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {uploading ? 'Enviando imagem...' : 'Salvando...'}
                </>
              ) : (
                product ? 'Atualizar' : 'Adicionar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
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