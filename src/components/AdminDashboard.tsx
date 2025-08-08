import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useDashboard } from "@/hooks/useDashboard";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCatalog } from "./ProductCatalog";
import { ResellerManagement } from "./ResellerManagement";
import { OrderModal } from "./modals/OrderModal";

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { toast } = useToast();
  const { stats, pedidosRecentes, topRevendedores, loading } = useDashboard();
  
  const dashboardStats = [
    {
      title: "Revendedores Ativos",
      value: stats.revendedoresAtivos.toString(),
      description: `${stats.totalRevendedores} total`,
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Produtos Cadastrados", 
      value: stats.totalProdutos.toString(),
      description: "Produtos ativos",
      icon: Package,
      color: "text-success"
    },
    {
      title: "Vendas do Mês",
      value: `R$ ${stats.valorVendasMes.toFixed(2).replace('.', ',')}`,
      description: `${stats.vendasMes} vendas realizadas`,
      icon: TrendingUp,
      color: "text-primary"
    }
  ];

  const handleAddOrder = (newOrder: any) => {
    toast({
      title: "Pedido adicionado",
      description: "Funcionalidade em desenvolvimento"
    });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-heading-1">Dashboard Audaz</h1>
          <p className="text-body text-muted-foreground">Visão geral do sistema de gestão</p>
        </div>
        <Button className="button-gradient" onClick={() => setShowOrderModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando dados...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="card-elevated">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-body-small font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-heading-3">Pedidos Recentes</CardTitle>
            <CardDescription>Últimos pedidos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pedidosRecentes.length > 0 ? (
                pedidosRecentes.map((pedido) => (
                  <div key={pedido.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">#{pedido.numero_pedido}</span>
                      </div>
                      <p className="text-body-small text-muted-foreground">{pedido.revendedor_nome}</p>
                      <p className="text-body-small">
                        {pedido.total_itens} itens • R$ {pedido.valor_total.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-body-small text-muted-foreground">
                        {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast({
                          title: `Pedido #${pedido.numero_pedido}`,
                          description: `${pedido.total_itens} itens • R$ ${pedido.valor_total.toFixed(2).replace('.', ',')}`
                        })}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum pedido encontrado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-heading-3">Top Revendedores</CardTitle>
            <CardDescription>Maiores volumes este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRevendedores.length > 0 ? (
                topRevendedores.map((revendedor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border">
                    <div>
                      <p className="font-medium">{revendedor.nome}</p>
                      <p className="text-body-small text-muted-foreground">
                        R$ {revendedor.valor_vendas.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                      {revendedor.crescimento}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum revendedor encontrado</p>
                </div>
              )}
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
              <h1 className="text-heading-3 text-primary">Audaz ERP</h1>
            </div>
            <nav className="hidden md:flex space-x-1">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'products', label: 'Produtos' },
                { id: 'resellers', label: 'Revendedores' },
                { id: 'orders', label: 'Pedidos' },
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
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'products' && <ProductCatalog />}
        {activeTab === 'resellers' && <ResellerManagement />}
        {activeTab === 'orders' && (
          <div className="text-center py-12">
            <h2 className="text-heading-2 mb-4">Gestão de Pedidos</h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        )}
        {activeTab === 'reports' && (
          <div className="text-center py-12">
            <h2 className="text-heading-2 mb-4">Relatórios</h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        )}
      </main>

      {/* Order Modal */}
      {showOrderModal && (
        <OrderModal
          onClose={() => setShowOrderModal(false)}
          onSave={handleAddOrder}
        />
      )}
    </div>
  );
};