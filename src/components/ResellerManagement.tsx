import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ResellerModal } from "@/components/modals/ResellerModal";
import { ResellerDetailModal } from "@/components/modals/ResellerDetailModal";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { useRevendedores, type Revendedor } from "@/hooks/useRevendedores";
import { useDashboard } from "@/hooks/useDashboard";
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
  Calendar,
  Loader2
} from "lucide-react";

export const ResellerManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isResellerModalOpen, setIsResellerModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState<Revendedor | null>(null);
  const [editingReseller, setEditingReseller] = useState<Revendedor | null>(null);
  
  const { revendedores, loading, adicionarRevendedor, atualizarRevendedor, removerRevendedor } = useRevendedores();
  const { stats } = useDashboard();

  const filteredRevendedores = revendedores.filter(revendedor =>
    revendedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    revendedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (revendedor.endereco && revendedor.endereco.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddReseller = () => {
    setEditingReseller(null);
    setIsResellerModalOpen(true);
  };

  const handleEditReseller = (revendedor: Revendedor) => {
    setEditingReseller(revendedor);
    setIsResellerModalOpen(true);
  };

  const handleViewReseller = (revendedor: Revendedor) => {
    setSelectedReseller(revendedor);
    setIsDetailModalOpen(true);
  };

  const handleDeleteReseller = (revendedor: Revendedor) => {
    setSelectedReseller(revendedor);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveReseller = async (resellerData: Partial<Revendedor>) => {
    try {
      if (editingReseller) {
        await atualizarRevendedor(editingReseller.id, resellerData);
      } else {
        await adicionarRevendedor({
          nome: resellerData.nome!,
          email: resellerData.email!,
          telefone: resellerData.telefone,
          endereco: resellerData.endereco,
          ativo: true
        });
      }
      setIsResellerModalOpen(false);
      setEditingReseller(null);
    } catch (error) {
      console.error('Erro ao salvar revendedor:', error);
    }
  };

  const confirmDeleteReseller = async () => {
    if (selectedReseller) {
      try {
        await removerRevendedor(selectedReseller.id);
      } catch (error) {
        console.error('Erro ao remover revendedor:', error);
      }
    }
    setIsDeleteDialogOpen(false);
    setSelectedReseller(null);
  };

  const getStatusColor = (ativo: boolean) => {
    return ativo 
      ? 'bg-success/10 text-success border-success/20'
      : 'bg-muted/10 text-muted-foreground border-muted/20';
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando dados...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-body-small font-medium">Total de Revendedores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalRevendedores}</div>
              <p className="text-xs text-muted-foreground">{stats.revendedoresAtivos} ativos</p>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-body-small font-medium">Revendedores Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.revendedoresAtivos}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalRevendedores > 0 
                  ? `${Math.round((stats.revendedoresAtivos / stats.totalRevendedores) * 100)}% do total`
                  : '0% do total'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-body-small font-medium">Volume Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.valorVendasMes.toFixed(2).replace('.', ',')}</div>
              <p className="text-xs text-muted-foreground">Total de vendas do mês</p>
            </CardContent>
          </Card>
        </div>
      )}

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
            {filteredRevendedores.map((revendedor) => (
              <Card key={revendedor.id} className="group hover:shadow-audaz-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-heading-3 mb-1">{revendedor.nome}</h3>
                      <Badge className={getStatusColor(revendedor.ativo)}>
                        {revendedor.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewReseller(revendedor)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditReseller(revendedor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteReseller(revendedor)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-body-small text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{revendedor.email}</span>
                    </div>
                    
                    {revendedor.telefone && (
                      <div className="flex items-center gap-2 text-body-small text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{revendedor.telefone}</span>
                      </div>
                    )}
                    
                    {revendedor.endereco && (
                      <div className="flex items-center gap-2 text-body-small text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{revendedor.endereco}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-body-small text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Cliente desde {new Date(revendedor.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleViewReseller(revendedor)}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Ver Detalhes Completos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRevendedores.length === 0 && (
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
        description={`Tem certeza que deseja remover o revendedor "${selectedReseller?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Remover"
      />
    </div>
  );
};