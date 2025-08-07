import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

export const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = [
    {
      id: "BL001",
      name: "Blusa Feminina Floral",
      category: "Blusas",
      size: "M",
      color: "Azul",
      price: "R$ 89,90",
      description: "Blusa feminina estampada com flores",
      image: "/placeholder.svg",
      status: "Disponível",
      stock: 25
    },
    {
      id: "CA002", 
      name: "Calça Jeans Skinny",
      category: "Calças",
      size: "38",
      color: "Azul Escuro",
      price: "R$ 159,90",
      description: "Calça jeans skinny com elastano",
      image: "/placeholder.svg",
      status: "Disponível",
      stock: 18
    },
    {
      id: "VE003",
      name: "Vestido Longo Estampado",
      category: "Vestidos",
      size: "P",
      color: "Vermelho",
      price: "R$ 199,90",
      description: "Vestido longo com estampa tropical",
      image: "/placeholder.svg",
      status: "Baixo Estoque",
      stock: 3
    },
    {
      id: "BL004",
      name: "Blazer Social",
      category: "Blazers",
      size: "G",
      color: "Preto",
      price: "R$ 249,90",
      description: "Blazer social feminino",
      image: "/placeholder.svg",
      status: "Disponível",
      stock: 12
    }
  ];

  const categories = ["all", "Blusas", "Calças", "Vestidos", "Blazers"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível': return 'bg-success/10 text-success border-success/20';
      case 'Baixo Estoque': return 'bg-warning/10 text-warning border-warning/20';
      case 'Esgotado': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
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
        <Button className="button-gradient">
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
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-heading-3 mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-body-small text-muted-foreground">
                      <Tag className="h-3 w-3" />
                      <span>{product.category}</span>
                    </div>
                    <div className="flex items-center gap-4 text-body-small text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Ruler className="h-3 w-3" />
                        <span>{product.size}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Palette className="h-3 w-3" />
                        <span>{product.color}</span>
                      </div>
                    </div>
                    <p className="text-body-small text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-heading-3 text-primary">{product.price}</span>
                    <span className="text-body-small text-muted-foreground">
                      Estoque: {product.stock}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
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
    </div>
  );
};