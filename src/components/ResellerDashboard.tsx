import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Scanner } from "./Scanner";
import { useEstoque } from "@/hooks/useEstoque";
import { useRevendedores } from "@/hooks/useRevendedores";
import { usePedidosRevendedor } from "@/hooks/usePedidosRevendedor";
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
  Ruler,
  Loader2,
  ShoppingCart,
  FileText
} from "lucide-react";

interface ResellerDashboardProps {
  onLogout: () => void;
}

export const ResellerDashboard = ({ onLogout }: ResellerDashboardProps) => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scannerInput, setScannerInput] = useState("");
  const [currentRevendedor, setCurrentRevendedor] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { revendedores } = useRevendedores();
  const { estoque, loading, marcarComoVendido, buscarPorCodigo, getEstatisticas } = useEstoque(currentRevendedor || undefined);
  const { pedidos, loading: loadingPedidos } = usePedidosRevendedor(currentRevendedor || undefined);

  // Simular login do primeiro revendedor (Maria Silva) - será substituído por autenticação real
  useEffect(() => {
    if (revendedores.length > 0 && !currentRevendedor) {
      const maria = revendedores.find(r => r.email === 'maria.silva@email.com');
      if (maria) {
        setCurrentRevendedor(maria.id);
      }
    }
  }, [revendedores, currentRevendedor]);

  const resellerInfo = currentRevendedor ? (() => {
    const revendedor = revendedores.find(r => r.id === currentRevendedor);
    const stats = getEstatisticas();
    return {
      name: revendedor?.nome || "Carregando...",
      email: revendedor?.email || "",
      totalItems: stats.total,
      availableItems: stats.disponiveis,
      soldItems: stats.vendidos,
      totalValue: `R$ ${stats.valorTotalCompra.toFixed(2).replace('.', ',')}`,
      thisMonthSales: `R$ ${stats.valorTotalVenda.toFixed(2).replace('.', ',')}`
    };
  })() : {
    name: "Carregando...",
    email: "",
    totalItems: 0,
    availableItems: 0,
    soldItems: 0,
    totalValue: "R$ 0,00",
    thisMonthSales: "R$ 0,00"
  };

  const filteredInventory = estoque.filter(item => {
    const nome = item.produto?.nome || '';
    const codigo = item.codigo_peca;
    const matchesSearch = nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "available" && item.status === "disponivel") ||
                         (statusFilter === "sold" && item.status === "vendido");
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'bg-success/10 text-success border-success/20';
      case 'vendido': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disponivel': return 'Disponível';
      case 'vendido': return 'Vendido';
      case 'reservado': return 'Reservado';
      default: return status;
    }
  };

  const handleViewItem = (item: typeof estoque[number]) => {
    toast({
      title: `Peça ${item.codigo_peca}`,
      description: `${item.produto?.nome} • R$ ${item.preco_compra.toFixed(2).replace('.', ',')} • ${getStatusLabel(item.status)}`
    });
  };

  const handleMarkSold = async (id: string) => {
    try {
      const item = estoque.find(i => i.id === id);
      if (!item || item.status !== "disponivel") return;
      
      // Por simplicidade, usar o preço de compra como preço de venda
      // Em produção, seria solicitado ao usuário
      await marcarComoVendido(id, item.preco_compra);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleScanSuccess = async (code: string) => {
    try {
      const item = await buscarPorCodigo(code);
      if (!item) {
        toast({
          title: "Código não encontrado",
          description: "Nenhuma peça encontrada com este código",
          variant: "destructive"
        });
        return;
      }

      if (item.status === "vendido") {
        toast({
          title: "Peça já vendida",
          description: "Esta peça já foi marcada como vendida",
          variant: "destructive"
        });
        return;
      }

      await handleMarkSold(item.id);
      toast({
        title: "Baixa realizada com sucesso!",
        description: `${item.produto?.nome} foi marcada como vendida`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar o código",
        variant: "destructive"
      });
    }
  };

  const handleScannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannerInput.trim()) {
      toast({
        title: "Erro",
        description: "Digite ou escaneie um código válido",
        variant: "destructive"
      });
      return;
    }

    try {
      const item = await buscarPorCodigo(scannerInput.trim());
      if (!item) {
        toast({
          title: "Código não encontrado",
          description: "Nenhuma peça encontrada com este código",
          variant: "destructive"
        });
        return;
      }

      if (item.status === "vendido") {
        toast({
          title: "Peça já vendida",
          description: "Esta peça já foi marcada como vendida",
          variant: "destructive"
        });
        return;
      }

      await handleMarkSold(item.id);
      setScannerInput("");
      toast({
        title: "Baixa realizada com sucesso!",
        description: `${item.produto?.nome} foi marcada como vendida`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar o código",
        variant: "destructive"
      });
    }
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
          <div className="space-y-4">
            {filteredInventory.map((item) => (
              <Card key={item.id} className="group hover:shadow-audaz-lg transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-accent/50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img 
                        src={item.produto?.imagem_url || "/placeholder.svg"} 
                        alt={item.produto?.nome || "Produto"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-caption">
                            {item.codigo_peca}
                          </Badge>
                          <h3 className="text-heading-3 truncate">{item.produto?.nome}</h3>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-heading-3 text-primary">
                            R$ {item.preco_compra.toFixed(2).replace('.', ',')}
                          </span>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status === 'disponivel' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {getStatusLabel(item.status)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3 text-body-small text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <span>{item.produto?.categoria}</span>
                        </div>
                        {item.produto?.tamanho && (
                          <div className="flex items-center gap-1">
                            <Ruler className="h-3 w-3" />
                            <span>{item.produto.tamanho}</span>
                          </div>
                        )}
                        {item.cor && (
                          <div className="flex items-center gap-1">
                            <Palette className="h-3 w-3" />
                            <span>{item.cor}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-body-small text-muted-foreground mb-3">
                        <span>Comprada: {new Date(item.data_compra).toLocaleDateString('pt-BR')}</span>
                        {item.data_venda && (
                          <span className="ml-4">Vendida: {new Date(item.data_venda).toLocaleDateString('pt-BR')}</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewItem(item)}>
                          <Eye className="h-3 w-3 mr-1" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
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
      <div className="mb-6">
        <h1 className="text-heading-1 mb-2">Dar Baixa</h1>
        <p className="text-body text-muted-foreground">
          Escaneie ou digite o código da peça para dar baixa
        </p>
      </div>
      
      {/* Scanner integrado */}
      <Scanner
        onClose={() => {}} // Não precisa fechar pois está integrado
        onScanSuccess={handleScanSuccess}
        inventory={estoque.map(item => ({
          id: item.codigo_peca,
          name: item.produto?.nome || '',
          price: `R$ ${item.preco_compra.toFixed(2).replace('.', ',')}`,
          category: item.produto?.categoria || '',
          status: item.status === 'disponivel' ? 'Disponível' : 'Vendida'
        }))}
        mode="baixa"
        recentSales={estoque.filter(i => i.status === "vendido").map(item => ({
          id: item.codigo_peca,
          name: item.produto?.nome || '',
          price: `R$ ${item.preco_venda?.toFixed(2).replace('.', ',') || '0,00'}`,
          category: item.produto?.categoria || '',
          status: 'Vendida',
          soldDate: item.data_venda || undefined
        }))}
        integrated={true} // Nova prop para modo integrado
      />
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-heading-1">Meus Pedidos</h1>
          <p className="text-body text-muted-foreground">
            Acompanhe seus pedidos e entregas
          </p>
        </div>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-heading-3 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Histórico de Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingPedidos ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando pedidos...</span>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum pedido encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <Card key={pedido.id} className="group hover:shadow-audaz-lg transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <ShoppingCart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-heading-3">{pedido.numero_pedido}</h3>
                          <p className="text-body-small text-muted-foreground">
                            {pedido.total_itens} {pedido.total_itens === 1 ? 'item' : 'itens'} • 
                            Pedido em {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-heading-3 text-primary">
                          R$ {pedido.valor_total.toFixed(2).replace('.', ',')}
                        </p>
                        <Badge className={
                          pedido.status === 'pendente' 
                            ? 'bg-warning/10 text-warning border-warning/20'
                            : pedido.status === 'entregue'
                            ? 'bg-success/10 text-success border-success/20' 
                            : 'bg-primary/10 text-primary border-primary/20'
                        }>
                          {pedido.status === 'pendente' && <Clock className="h-3 w-3 mr-1" />}
                          {pedido.status === 'entregue' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
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
                { id: 'orders', label: 'Pedidos' },
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
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'scanner' && renderScanner()}
        {activeTab === 'reports' && (
          <div className="text-center py-12">
            <h2 className="text-heading-2 mb-4">Relatórios</h2>
            <p className="text-muted-foreground">Funcionalidade em desenvolvimento...</p>
          </div>
        )}
      </main>

    </div>
  );
};