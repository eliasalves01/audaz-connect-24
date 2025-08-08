import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Scanner } from "./Scanner";
import { 
  Package, 
  TrendingUp, 
  Search, 
  Filter,
  ScanLine,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Tag,
  Palette,
  Ruler
} from "lucide-react";

interface ResellerDashboardProps {
  onLogout: () => void;
}

export const ResellerDashboard = ({ onLogout }: ResellerDashboardProps) => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scannerInput, setScannerInput] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const { toast } = useToast();

  const resellerInfo = {
    name: "Maria Silva",
    email: "maria.silva@email.com",
    totalItems: 156,
    availableItems: 98,
    soldItems: 58,
    totalValue: "R$ 18.450",
    thisMonthSales: "R$ 3.240"
  };

  const [inventory, setInventory] = useState([
    {
      id: "BL001",
      name: "Blusa Feminina Floral",
      category: "Blusas",
      size: "M",
      color: "Azul",
      price: "R$ 89,90",
      purchaseDate: "2024-07-15",
      status: "Disponível",
      image: "/placeholder.svg"
    },
    {
      id: "CA002",
      name: "Calça Jeans Skinny", 
      category: "Calças",
      size: "38",
      color: "Azul Escuro",
      price: "R$ 159,90",
      purchaseDate: "2024-07-15",
      status: "Vendida",
      soldDate: "2024-08-02",
      image: "/placeholder.svg"
    },
    {
      id: "VE003",
      name: "Vestido Longo Estampado",
      category: "Vestidos", 
      size: "P",
      color: "Vermelho",
      price: "R$ 199,90",
      purchaseDate: "2024-07-20",
      status: "Disponível",
      image: "/placeholder.svg"
    },
    {
      id: "BL004",
      name: "Blazer Social",
      category: "Blazers",
      size: "G", 
      color: "Preto",
      price: "R$ 249,90",
      purchaseDate: "2024-07-20",
      status: "Vendida",
      soldDate: "2024-07-28",
      image: "/placeholder.svg"
    }
  ]);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "available" && item.status === "Disponível") ||
                         (statusFilter === "sold" && item.status === "Vendida");
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível': return 'bg-success/10 text-success border-success/20';
      case 'Vendida': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const handleViewItem = (item: typeof inventory[number]) => {
    toast({
      title: `Peça ${item.id}`,
      description: `${item.name} • ${item.price} • ${item.status}`
    });
  };

  const handleMarkSold = (id: string) => {
    setInventory(prev => prev.map(i =>
      i.id === id && i.status === "Disponível"
        ? { ...i, status: "Vendida", soldDate: new Date().toISOString().split('T')[0] }
        : i
    ));
    toast({ title: "Baixa realizada", description: "Peça marcada como vendida." });
  };

  const handleScanSuccess = (code: string) => {
    const item = inventory.find(i => i.id.toLowerCase() === code.toLowerCase());
    if (!item) {
      toast({
        title: "Código não encontrado",
        description: "Nenhuma peça encontrada com este código",
        variant: "destructive"
      });
      return;
    }

    if (item.status === "Vendida") {
      toast({
        title: "Peça já vendida",
        description: "Esta peça já foi marcada como vendida",
        variant: "destructive"
      });
      return;
    }

    handleMarkSold(item.id);
    setShowScanner(false);
    toast({
      title: "Baixa realizada com sucesso!",
      description: `${item.name} foi marcada como vendida`
    });
  };

  const handleScannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannerInput.trim()) {
      toast({
        title: "Erro",
        description: "Digite ou escaneie um código válido",
        variant: "destructive"
      });
      return;
    }

    const item = inventory.find(i => i.id.toLowerCase() === scannerInput.toLowerCase().trim());
    if (!item) {
      toast({
        title: "Código não encontrado",
        description: "Nenhuma peça encontrada com este código",
        variant: "destructive"
      });
      return;
    }

    if (item.status === "Vendida") {
      toast({
        title: "Peça já vendida",
        description: "Esta peça já foi marcada como vendida",
        variant: "destructive"
      });
      return;
    }

    handleMarkSold(item.id);
    setScannerInput("");
    toast({
      title: "Baixa realizada com sucesso!",
      description: `${item.name} foi marcada como vendida`
    });
  };

  const renderInventory = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-heading-1">Meu Estoque</h1>
          <p className="text-body text-muted-foreground">
            Gerencie suas peças e acompanhe vendas
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="button-gradient" onClick={() => setShowScanner(true)}>
            <ScanLine className="h-4 w-4 mr-2" />
            Dar Baixa
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-body-small font-medium">Total de Peças</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellerInfo.totalItems}</div>
            <p className="text-xs text-muted-foreground">Compradas</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-body-small font-medium">Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{resellerInfo.availableItems}</div>
            <p className="text-xs text-muted-foreground">Para venda</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-body-small font-medium">Vendidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{resellerInfo.soldItems}</div>
            <p className="text-xs text-muted-foreground">Este período</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-body-small font-medium">Faturamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellerInfo.thisMonthSales}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-heading-3">Catálogo de Peças</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar peças..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex gap-1">
                {[
                  { id: 'all', label: 'Todas' },
                  { id: 'available', label: 'Disponíveis' },
                  { id: 'sold', label: 'Vendidas' }
                ].map((filter) => (
                  <Button
                    key={filter.id}
                    variant={statusFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(filter.id)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((item) => (
              <Card key={item.id} className="group hover:shadow-audaz-lg transition-all duration-200">
                <div className="aspect-square bg-accent/50 rounded-t-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-caption">
                      {item.id}
                    </Badge>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status === 'Disponível' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {item.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-heading-3 mb-2 line-clamp-2">{item.name}</h3>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-body-small text-muted-foreground">
                      <Tag className="h-3 w-3" />
                      <span>{item.category}</span>
                    </div>
                    <div className="flex items-center gap-4 text-body-small text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Ruler className="h-3 w-3" />
                        <span>{item.size}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Palette className="h-3 w-3" />
                        <span>{item.color}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-heading-3 text-primary">{item.price}</span>
                  </div>

                  <div className="text-body-small text-muted-foreground mb-3">
                    <p>Comprada: {new Date(item.purchaseDate).toLocaleDateString('pt-BR')}</p>
                    {item.soldDate && (
                      <p>Vendida: {new Date(item.soldDate).toLocaleDateString('pt-BR')}</p>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewItem(item)}>
                      <Eye className="h-3 w-3 mr-1" />
                      Detalhes
                    </Button>
                    {item.status === 'Disponível' && (
                      <Button size="sm" className="flex-1" onClick={() => setShowScanner(true)}>
                        <ScanLine className="h-3 w-3 mr-1" />
                        Baixar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma peça encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderScanner = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-heading-1">Dar Baixa</h1>
          <p className="text-body text-muted-foreground">
            Escaneie ou digite o código da peça para dar baixa
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="card-elevated">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="bg-primary/10 p-6 rounded-xl max-w-md mx-auto mb-6">
                <ScanLine className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-heading-2 mb-2">Scanner de Código</h2>
                <p className="text-muted-foreground">
                  Digite ou escaneie o código da etiqueta para dar baixa na peça vendida
                </p>
              </div>
            </div>

            <form onSubmit={handleScannerSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="scanner-input">Código da Peça</Label>
                <div className="relative">
                  <Input
                    id="scanner-input"
                    type="text"
                    placeholder="Digite ou escaneie o código (ex: BL001)"
                    value={scannerInput}
                    onChange={(e) => setScannerInput(e.target.value)}
                    className="h-14 text-lg text-center font-mono uppercase"
                    autoFocus
                  />
                  <ScanLine className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <Button type="submit" className="button-gradient w-full h-12 text-lg">
                <ScanLine className="h-5 w-5 mr-2" />
                Dar Baixa
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-heading-3 mb-4">Últimas Baixas</h3>
              <div className="space-y-2">
                {inventory
                  .filter(item => item.status === "Vendida")
                  .slice(0, 3)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{item.id}</Badge>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-body-small text-success">Vendida</p>
                        {item.soldDate && (
                          <p className="text-body-small text-muted-foreground">
                            {new Date(item.soldDate).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border shadow-audaz-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-primary p-2 rounded-lg">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-heading-3 text-primary">Portal do Revendedor</h1>
                <p className="text-body-small text-muted-foreground">{resellerInfo.name}</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-1">
              {[
                { id: 'inventory', label: 'Estoque' },
                { id: 'scanner', label: 'Dar Baixa' },
                { id: 'reports', label: 'Relatórios' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-md text-body-small font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <Button variant="outline" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'scanner' && renderScanner()}
        {activeTab === 'reports' && (
          <div className="text-center py-12">
            <h2 className="text-heading-2 mb-4">Relatórios</h2>
            <p className="text-muted-foreground">Funcionalidade em desenvolvimento...</p>
          </div>
        )}
      </main>

      {/* Scanner Modal */}
      {showScanner && (
        <Scanner
          onClose={() => setShowScanner(false)}
          onScanSuccess={handleScanSuccess}
          recentSales={inventory.filter(i => i.status === "Vendida")}
        />
      )}
    </div>
  );
};