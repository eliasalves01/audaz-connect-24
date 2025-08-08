import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Calendar, TrendingUp, ShoppingCart, Package } from "lucide-react";
import { type Revendedor } from "@/hooks/useRevendedores";

interface ResellerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reseller: Revendedor | null;
  onEdit: (reseller: Revendedor) => void;
}

export const ResellerDetailModal = ({ isOpen, onClose, reseller, onEdit }: ResellerDetailModalProps) => {
  if (!reseller) return null;

  const getStatusColor = (ativo: boolean) => {
    return ativo 
      ? 'bg-success/10 text-success border-success/20'
      : 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Perfil do Revendedor</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-heading-2 mb-2">{reseller.nome}</h3>
              <Badge className={getStatusColor(reseller.ativo)}>
                {reseller.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-body-small text-muted-foreground">ID: {reseller.id.substring(0, 8)}</p>
              <p className="text-body-small text-muted-foreground">
                Cliente desde {new Date(reseller.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-body-small font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-body">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{reseller.email}</span>
                </div>
                {reseller.telefone && (
                  <div className="flex items-center gap-2 text-body">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{reseller.telefone}</span>
                  </div>
                )}
                {reseller.endereco && (
                  <div className="flex items-center gap-2 text-body">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{reseller.endereco}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-body-small font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Estatísticas de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-body-small text-muted-foreground">Revendedor desde</span>
                  <span className="text-heading-3 text-primary">{new Date(reseller.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body-small text-muted-foreground">Status</span>
                  <span className="text-heading-3">{reseller.ativo ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body-small text-muted-foreground">Última atualização</span>
                  <span className="text-body">{new Date(reseller.updated_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-heading-3 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Histórico Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border">
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Pedido #001</p>
                      <p className="text-body-small text-muted-foreground">15 itens • R$ 2.340</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                      Pendente
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border">
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Pedido #002</p>
                      <p className="text-body-small text-muted-foreground">8 itens • R$ 1.120</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                      Entregue
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button 
              onClick={() => onEdit(reseller)}
              className="button-gradient flex-1"
            >
              Editar Revendedor
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};