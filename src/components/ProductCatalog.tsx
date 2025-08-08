import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ProductModal } from "@/components/modals/ProductModal";
import { ProductDetailModal } from "@/components/modals/ProductDetailModal";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Tag,
  Palette,
  Ruler
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  size: string;
  price: string;
  image?: string;
}

export const ProductCatalog = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([
    {
      id: "SH001",
      name: "Camiseta Short Básica",
      category: "short",
      size: "M",
      price: "R$ 89,90",
      image: "/placeholder.svg"
    },
    {
      id: "OV002", 
      name: "Moletom Oversized",
      category: "oversized",
      size: "G",
      price: "R$ 159,90",
      image: "/placeholder.svg"
    },
    {
      id: "LO003",
      name: "Blusa Longline Listrada",
      category: "longline",
      size: "P",
      price: "R$ 199,90",
      image: "/placeholder.svg"
    }
  ]);

  const categories = ["all", "short", "oversized", "longline"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveProduct = (productData: Product) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? productData : p));
    } else {
      setProducts(prev => [...prev, productData]);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const confirmDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      toast({
        title: "Produto removido",
        description: "O produto foi removido com sucesso do catálogo"
      });
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-audaz-lg transition-all duration-200">
                <div className="aspect-square bg-accent/50 rounded-t-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-caption">
                      {product.id}
                    </Badge>
                  </div>
                  
                  <h3 className="text-heading-3 mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-body-small text-muted-foreground">
                      <Tag className="h-3 w-3" />
                      <span>{product.category}</span>
                    </div>
                    <div className="flex items-center gap-1 text-body-small text-muted-foreground">
                      <Ruler className="h-3 w-3" />
                      <span>{product.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-heading-3 text-primary">{product.price}</span>
                  </div>

                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewProduct(product)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
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
      />

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={selectedProduct}
        onEdit={handleEditProduct}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteProduct}
        title="Remover Produto"
        description={`Tem certeza que deseja remover o produto "${selectedProduct?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Remover"
      />
    </div>
  );
};