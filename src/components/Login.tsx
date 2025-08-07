import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Building2 } from "lucide-react";

interface LoginProps {
  onLogin: (userType: 'admin' | 'reseller') => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'reseller'>('admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(userType);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary p-3 rounded-xl shadow-audaz-lg">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-display text-primary mb-2">Audaz ERP</h1>
          <p className="text-body text-muted-foreground">Sistema de Gestão de Revenda</p>
        </div>

        <Card className="card-elevated">
          <CardHeader className="space-y-1">
            <CardTitle className="text-heading-2 text-center">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  type="button"
                  variant={userType === 'admin' ? 'default' : 'outline'}
                  onClick={() => setUserType('admin')}
                  className="w-full"
                >
                  Audaz
                </Button>
                <Button
                  type="button"
                  variant={userType === 'reseller' ? 'default' : 'outline'}
                  onClick={() => setUserType('reseller')}
                  className="w-full"
                >
                  Revendedor
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-body-large button-gradient"
                disabled={!email || !password}
              >
                Entrar no {userType === 'admin' ? 'Painel Audaz' : 'Portal do Revendedor'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-body-small text-muted-foreground">
            © 2024 Audaz. Sistema ERP de Gestão de Revenda.
          </p>
        </div>
      </div>
    </div>
  );
};