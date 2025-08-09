import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Local minimal type to avoid dependency on external types
// Matches the fields used across the app
type ProdutoLike = {
  id: string;
  nome: string;
  codigo: string;
  categoria: string;
  tamanho?: string | null;
  preco: number;
  imagem_url?: string | null;
  ativo?: boolean;
};

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProdutoLike | null;
  onSave: (data: Partial<ProdutoLike>) => Promise<void> | void;
  uploadImage?: (file: File) => Promise<string>;
  isLoading?: boolean;
}

export const ProductModal = ({ isOpen, onClose, product, onSave, uploadImage, isLoading }: ProductModalProps) => {
  const [form, setForm] = useState({
    nome: product?.nome ?? "",
    codigo: product?.codigo ?? "",
    categoria: product?.categoria ?? "short",
    tamanho: product?.tamanho ?? "",
    preco: product?.preco != null ? String(product.preco).replace(".", ",") : "",
    imagem_url: product?.imagem_url ?? "",
  });

  useEffect(() => {
    setForm({
      nome: product?.nome ?? "",
      codigo: product?.codigo ?? "",
      categoria: product?.categoria ?? "short",
      tamanho: product?.tamanho ?? "",
      preco: product?.preco != null ? String(product.preco).replace(".", ",") : "",
      imagem_url: product?.imagem_url ?? "",
    });
  }, [product, isOpen]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImage = async (file: File | null) => {
    if (!file) return;
    if (!uploadImage) {
      // Fallback: just preview locally if no uploader provided
      const url = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, imagem_url: url }));
      return;
    }
    try {
      const url = await uploadImage(file);
      setForm(prev => ({ ...prev, imagem_url: url }));
    } catch (e) {
      console.error("Erro ao enviar imagem", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!form.nome || !form.codigo || !form.preco) return;

    const precoNumber = parseFloat(form.preco.replace(".", "").replace(",", "."));

    const payload: Partial<ProdutoLike> = {
      nome: form.nome,
      codigo: form.codigo,
      categoria: form.categoria,
      tamanho: form.tamanho || null,
      preco: isNaN(precoNumber) ? 0 : precoNumber,
      imagem_url: form.imagem_url || null,
      ativo: product?.ativo ?? true,
    };

    await onSave(payload);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          <DialogDescription>
            {product ? "Atualize as informações do produto" : "Cadastre um novo produto no catálogo"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input id="nome" value={form.nome} onChange={(e) => handleChange("nome", e.target.value)} placeholder="Ex: Camiseta Audaz" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input id="codigo" value={form.codigo} onChange={(e) => handleChange("codigo", e.target.value)} placeholder="Ex: AUD-001" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={form.categoria} onValueChange={(v) => handleChange("categoria", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">short</SelectItem>
                  <SelectItem value="oversized">oversized</SelectItem>
                  <SelectItem value="longline">longline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tamanho">Tamanho</Label>
              <Input id="tamanho" value={form.tamanho} onChange={(e) => handleChange("tamanho", e.target.value)} placeholder="Ex: M" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco">Preço *</Label>
              <Input id="preco" inputMode="decimal" value={form.preco} onChange={(e) => handleChange("preco", e.target.value)} placeholder="Ex: 49,90" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagem">Imagem</Label>
              <Input id="imagem" type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0] || null)} />
              {form.imagem_url && (
                <img src={form.imagem_url} alt={`Pré-visualização de ${form.nome}`} className="mt-2 h-24 w-24 object-cover rounded-md" loading="lazy" />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={!!isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="button-gradient" disabled={!!isLoading}>
              {product ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};