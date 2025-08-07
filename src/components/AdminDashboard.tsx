import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCatalog } from "./ProductCatalog";
import { ResellerManagement } from "./ResellerManagement";

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const dashboardStats = [
    {
      title: "Revendedores Ativos",
      value: "24",
      description: "3 novos este mês",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Produtos Cadastrados",
      value: "1,247",
      description: "156 adicionados este mês",
      icon: Package,
      color: "text-success"
    },
    {
      title: "Pedidos Pendentes",
      value: "18",
      description: "Para entregar",
      icon: ShoppingCart,
      color: "text-warning"
    },
    {
      title: "Vendas do Mês",
      value: "R$ 45.670",
      description: "+12% vs. mês anterior",
      icon: TrendingUp,
      color: "text-primary"
    }
  ];

  const recentOrders = [
    { id: "001", reseller: "Maria Silva", items: 15, value: "R$ 2.340", status: "Pendente", date: "2024-08-07" },
    { id: "002", reseller: "João Santos", items: 8, value: "R$ 1.120", status: "Entregue", date: "2024-08-06" },
    { id: "003", reseller: "Ana Costa", items: 22, value: "R$ 3.560", status: "Preparando", date: "2024-08-06" },
    { id: "004", reseller: "Carlos Lima", items: 12, value: "R$ 1.890", status: "Entregue", date: "2024-08-05" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return 'bg-warning/10 text-warning border-warning/20';
      case 'Preparando': return 'bg-primary/10 text-primary border-primary/20';
      case 'Entregue': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-heading-1">Dashboard Audaz</h1>
          <p className="text-body text-muted-foreground">Visão geral do sistema de gestão</p>
        </div>
        <Button className="button-gradient">
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-heading-3">Pedidos Recentes</CardTitle>
            <CardDescription>Últimos pedidos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">#{order.id}</span>
                      <Badge variant="secondary" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-body-small text-muted-foreground">{order.reseller}</p>
                    <p className="text-body-small">{order.items} itens • {order.value}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-body-small text-muted-foreground">{order.date}</p>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
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
              {[
                { name: "Maria Silva", sales: "R$ 8.450", growth: "+15%" },
                { name: "João Santos", sales: "R$ 6.780", growth: "+8%" },
                { name: "Ana Costa", sales: "R$ 5.920", growth: "+22%" },
                { name: "Carlos Lima", sales: "R$ 4.560", growth: "+5%" },
              ].map((reseller, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border">
                  <div>
                    <p className="font-medium">{reseller.name}</p>
                    <p className="text-body-small text-muted-foreground">{reseller.sales}</p>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    {reseller.growth}
                  </Badge>
                </div>
              ))}
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
    </div>
  );
};