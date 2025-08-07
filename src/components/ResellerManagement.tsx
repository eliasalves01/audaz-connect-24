import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ResellerModal } from "@/components/modals/ResellerModal";
import { ResellerDetailModal } from "@/components/modals/ResellerDetailModal";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Calendar
} from "lucide-react";

interface Reseller {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  totalPurchases: string;
  lastOrder: string;
  status: string;
  ordersCount: number;
  joinDate: string;
}

export const ResellerManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isResellerModalOpen, setIsResellerModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState<Reseller | null>(null);
  const [editingReseller, setEditingReseller] = useState<Reseller | null>(null);

  const [resellers, setResellers] = useState<Reseller[]>([
    {
      id: 1,
      name: "Maria Silva",
      email: "maria.silva@email.com",
      phone: "(11) 98765-4321",
      city: "São Paulo",
      state: "SP",
      totalPurchases: "R$ 12.450",
      lastOrder: "2024-08-05",
      status: "Ativo",
      ordersCount: 28,
      joinDate: "2024-01-15"
    },
    {
      id: 2,
      name: "João Santos",
      email: "joao.santos@email.com", 
      phone: "(21) 99876-5432",
      city: "Rio de Janeiro",
      state: "RJ",
      totalPurchases: "R$ 8.920",
      lastOrder: "2024-08-03",
      status: "Ativo",
      ordersCount: 15,
      joinDate: "2024-02-20"
    },
    {
      id: 3,
      name: "Ana Costa",
      email: "ana.costa@email.com",
      phone: "(85) 99654-3210",
      city: "Fortaleza",
      state: "CE",
      totalPurchases: "R$ 15.780",
      lastOrder: "2024-08-07",
      status: "Ativo",
      ordersCount: 42,
      joinDate: "2023-11-10"
    },
    {
      id: 4,
      name: "Carlos Lima",
      email: "carlos.lima@email.com",
      phone: "(31) 98321-6543",
      city: "Belo Horizonte",
      state: "MG",
      totalPurchases: "R$ 6.340",
      lastOrder: "2024-07-28",
      status: "Inativo",
      ordersCount: 12,
      joinDate: "2024-03-05"
    }
  ]);

  const filteredResellers = resellers.filter(reseller =>
    reseller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reseller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reseller.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddReseller = () => {
    setEditingReseller(null);
    setIsResellerModalOpen(true);
  };

  const handleEditReseller = (reseller: Reseller) => {
    setEditingReseller(reseller);
    setIsResellerModalOpen(true);
  };

  const handleViewReseller = (reseller: Reseller) => {
    setSelectedReseller(reseller);
    setIsDetailModalOpen(true);
  };

  const handleDeleteReseller = (reseller: Reseller) => {
    setSelectedReseller(reseller);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveReseller = (resellerData: Reseller) => {
    if (editingReseller) {
      setResellers(prev => prev.map(r => r.id === editingReseller.id ? resellerData : r));
    } else {
      setResellers(prev => [...prev, resellerData]);
    }
    setIsResellerModalOpen(false);
    setEditingReseller(null);
  };

  const confirmDeleteReseller = () => {
    if (selectedReseller) {
      setResellers(prev => prev.filter(r => r.id !== selectedReseller.id));
      toast({
        title: "Revendedor removido",
        description: "O revendedor foi removido com sucesso do sistema"
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedReseller(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-success/10 text-success border-success/20';
      case 'Inativo': return 'bg-muted/10 text-muted-foreground border-muted/20';
      case 'Suspenso': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-heading-1">Gestão de Revendedores</h1>
          <p className="text-body text-muted-foreground">
            Gerencie todos os revendedores cadastrados no sistema
          </p>
        </div>
        <Button className="button-gradient" onClick={handleAddReseller}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Revendedor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-body-small font-medium">Total de Revendedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">24</div>
            <p className="text-xs text-muted-foreground">+3 este mês</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-body-small font-medium">Revendedores Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">21</div>
            <p className="text-xs text-muted-foreground">87.5% do total</p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-body-small font-medium">Volume Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 156.8K</div>
            <p className="text-xs text-muted-foreground">Total de vendas</p>
          </CardContent>
        </Card>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-heading-3">Lista de Revendedores</CardTitle>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar revendedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResellers.map((reseller) => (
              <Card key={reseller.id} className="group hover:shadow-audaz-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-heading-3 mb-1">{reseller.name}</h3>
                      <Badge className={getStatusColor(reseller.status)}>
                        {reseller.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewReseller(reseller)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditReseller(reseller)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteReseller(reseller)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-body-small text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{reseller.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-body-small text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{reseller.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-body-small text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{reseller.city}, {reseller.state}</span>
                    </div>

                    <div className="flex items-center gap-2 text-body-small text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Cliente desde {new Date(reseller.joinDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-body-small text-muted-foreground">Total de Compras</p>
                      <p className="text-heading-3 text-primary">{reseller.totalPurchases}</p>
                    </div>
                    <div>
                      <p className="text-body-small text-muted-foreground">Pedidos</p>
                      <p className="text-heading-3">{reseller.ordersCount}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-body-small text-muted-foreground">Último Pedido</p>
                      <p className="text-body">{new Date(reseller.lastOrder).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleViewReseller(reseller)}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Ver Relatório Completo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResellers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum revendedor encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ResellerModal
        isOpen={isResellerModalOpen}
        onClose={() => setIsResellerModalOpen(false)}
        reseller={editingReseller}
        onSave={handleSaveReseller}
      />

      <ResellerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        reseller={selectedReseller}
        onEdit={handleEditReseller}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteReseller}
        title="Remover Revendedor"
        description={`Tem certeza que deseja remover o revendedor "${selectedReseller?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Remover"
      />
    </div>
  );
};