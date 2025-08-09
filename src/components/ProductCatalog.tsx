import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ProductModal } from "@/components/modals/ProductModal";
import { ProductDetailModal } from "@/components/modals/ProductDetailModal";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { useProdutos } from "@/hooks/useProdutos";
import type { Produto } from "@/hooks/useProdutos";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Tag,
  Palette,
  Ruler,
  Loader2
} from "lucide-react";

export const ProductCatalog = () => {
  const { toast } = useToast();
  const { 
    produtos, 
    loading, 
    adicionarProduto, 
    atualizarProduto, 
    removerProduto, 
    uploadImage,
    isAdding,
    isUpdating,
    isRemoving
  } = useProdutos();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);

  const categories = ["all", "short", "oversized", "longline"];

  const filteredProducts = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || produto.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (produto: Produto) => {
    setEditingProduct(produto);
    setIsProductModalOpen(true);
  };

  const handleViewProduct = (produto: Produto) => {
    setSelectedProduct(produto);
    setIsDetailModalOpen(true);
  };

  const handleDeleteProduct = (produto: Produto) => {
    setSelectedProduct(produto);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await atualizarProduto(editingProduct.id, productData);
      } else {
        await adicionarProduto(productData);
      }
      
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const confirmDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        await removerProduto(selectedProduct.id);
      } catch (error) {
        // Erro já tratado no hook
      }
    }
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-heading-1">Catálogo de Produtos</h1>
          <p className="text-body text-muted-foreground">
            Gerencie o catálogo completo de peças
          </p>
        </div>
        <Button className="button-gradient" onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-1">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" ? "Todos" : category}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Carregando produtos...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((produto) => (
                <Card key={produto.id} className="group hover:shadow-audaz-lg transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-accent/50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img 
                          src={produto.imagem_url || "/placeholder.svg"} 
                          alt={produto.nome}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-caption">
                              {produto.codigo}
                            </Badge>
                            <h3 className="text-heading-3 truncate">{produto.nome}</h3>
                          </div>
                          <span className="text-heading-3 text-primary ml-4">
                            R$ {produto.preco.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-4 text-body-small text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span>{produto.categoria}</span>
                          </div>
                          {produto.tamanho && (
                            <div className="flex items-center gap-1">
                              <Ruler className="h-3 w-3" />
                              <span>{produto.tamanho}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewProduct(produto)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProduct(produto)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProduct(produto)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
        uploadImage={uploadImage}
        isLoading={isAdding || isUpdating}
      />

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={selectedProduct ? {
          id: selectedProduct.codigo,
          name: selectedProduct.nome,
          category: selectedProduct.categoria,
          size: selectedProduct.tamanho || '',
          price: `R$ ${selectedProduct.preco.toFixed(2).replace('.', ',')}`,
          image: selectedProduct.imagem_url
        } : null}
        onEdit={(product) => {
          if (selectedProduct) {
            handleEditProduct(selectedProduct);
          }
        }}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteProduct}
        title="Remover Produto"
        description={`Tem certeza que deseja remover o produto "${selectedProduct?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Remover"
      />
    </div>
  );
};