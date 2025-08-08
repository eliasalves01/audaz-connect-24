import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Camera, 
  ScanLine, 
  X, 
  Keyboard,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface ScannerProps {
  onClose: () => void;
  onScanSuccess: (code: string) => void;
  inventory?: Array<{
    id: string;
    name: string;
    price: string;
    category: string;
    status: string;
    soldDate?: string;
  }>;
  mode?: 'info' | 'baixa';
  recentSales?: Array<{
    id: string;
    name: string;
    soldDate?: string;
  }>;
  integrated?: boolean;
}

export const Scanner = ({ 
  onClose, 
  onScanSuccess, 
  inventory = [], 
  mode = 'info',
  recentSales = [],
  integrated = false
}: ScannerProps) => {
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState("");
  const [scannedItem, setScannedItem] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Sempre inicia com a câmera
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Auto-scan effect
  useEffect(() => {
    if (isCameraActive && !isManualMode) {
      const interval = setInterval(() => {
        handleAutoScan();
      }, 3000); // Tenta escanear automaticamente a cada 3 segundos
      
      return () => clearInterval(interval);
    }
  }, [isCameraActive, isManualMode, inventory]);

  const startCamera = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      setError("Câmera não disponível. Tente o modo manual.");
      toast({
        title: "Câmera não disponível",
        description: "Use o modo manual para inserir o código",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) {
      toast({
        title: "Código inválido",
        description: "Digite um código válido",
        variant: "destructive"
      });
      return;
    }
    handleCodeScanned(manualInput.trim().toUpperCase());
  };

  const handleCodeScanned = (code: string) => {
    const item = inventory.find(i => i.id.toLowerCase() === code.toLowerCase());
    
    if (!item) {
      toast({
        title: "Código não encontrado",
        description: "Nenhuma peça encontrada com este código",
        variant: "destructive"
      });
      setScannedItem(null);
      return;
    }

    setScannedItem(item);
    setManualInput("");
    
    if (mode === 'baixa') {
      onScanSuccess(code);
    } else {
      toast({
        title: "Peça encontrada!",
        description: `${item.name} - ${item.price || 'Preço não definido'}`,
      });
    }
  };

  const handleAutoScan = () => {
    // Simula detecção automática de códigos
    // Em produção, seria integrado com uma biblioteca de detecção de QR/barcode
    const availableCodes = inventory
      .filter(item => item.status === 'Disponível')
      .map(item => item.id);
    
    if (availableCodes.length > 0) {
      // Simula a detecção do primeiro código disponível
      const detectedCode = availableCodes[0];
      handleCodeScanned(detectedCode);
    }
  };

  if (integrated) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          {!isManualMode ? (
            <div className="space-y-4">
              {/* Camera View */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-primary/20">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Scanner Overlay */}
                <div className="absolute inset-0 bg-black/40">
                  {/* Scanner Frame */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Scanning Area */}
                      <div className="w-80 h-48 border-2 border-primary rounded-lg bg-transparent">
                        {/* Corner indicators */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-primary rounded-tl-lg"></div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-primary rounded-tr-lg"></div>
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-primary rounded-bl-lg"></div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-primary rounded-br-lg"></div>
                        
                        {/* Scanning Line */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
                        </div>
                      </div>
                      
                      {/* Instructions */}
                      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                        <p className="text-white text-sm font-medium mb-1">
                          Posicione o código dentro da área
                        </p>
                        <div className="flex items-center justify-center gap-2 text-primary">
                          <ScanLine className="h-4 w-4 animate-pulse" />
                          <span className="text-xs">Escaneando...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                    <div className="text-center text-white p-6 rounded-lg bg-black/50">
                      <AlertCircle className="h-12 w-12 mx-auto mb-3 text-destructive" />
                      <p className="mb-4">{error}</p>
                      <Button variant="outline" onClick={() => setIsManualMode(true)}>
                        Usar Modo Manual
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Scanner Info */}
              <div className="text-center mt-4">
                <p className="text-white text-sm font-medium mb-2">
                  Scanner automático ativo
                </p>
                <Button variant="outline" onClick={() => setIsManualMode(true)}>
                  <Keyboard className="h-4 w-4 mr-2" />
                  Inserir Código Manualmente
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Manual Input */}
              <div className="text-center">
                <div className="bg-primary/10 p-4 rounded-xl max-w-sm mx-auto mb-4">
                  <Keyboard className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h3 className="text-heading-3 mb-1">Modo Manual</h3>
                  <p className="text-body-small text-muted-foreground">
                    Digite o código da etiqueta
                  </p>
                </div>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manual-input">Código da Peça</Label>
                  <Input
                    id="manual-input"
                    type="text"
                    placeholder="Ex: BL001, CA002, VE003"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="h-14 text-lg text-center font-mono uppercase"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="button-gradient flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {mode === 'baixa' ? 'Confirmar Baixa' : 'Buscar Peça'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsManualMode(false)}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Usar Câmera
                  </Button>
                </div>
              </form>

              {/* Scanned Item Display */}
              {scannedItem && (
                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">{scannedItem.id}</Badge>
                    <Badge className={scannedItem.status === 'Disponível' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}>
                      {scannedItem.status}
                    </Badge>
                  </div>
                  <h3 className="text-heading-3 mb-2">{scannedItem.name}</h3>
                  <p className="text-heading-3 text-primary mb-2">{scannedItem.price}</p>
                  <p className="text-body-small text-muted-foreground">{scannedItem.category}</p>
                  
                  {mode === 'baixa' && scannedItem.status === 'Disponível' && (
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => onScanSuccess(scannedItem.id)}
                    >
                      <ScanLine className="h-4 w-4 mr-2" />
                      Confirmar Baixa
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Recent Sales */}
          {recentSales.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-heading-3 mb-3">Últimas Baixas</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {recentSales.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/30">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{item.id}</Badge>
                      <span className="text-body-small">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <CheckCircle className="h-3 w-3 text-success inline mr-1" />
                      <span className="text-caption text-success">Vendida</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 bg-background">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <ScanLine className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-heading-2">
                  {mode === 'baixa' ? 'Dar Baixa' : 'Scanner de Código'}
                </h2>
                <p className="text-body-small text-muted-foreground">
                  {isManualMode 
                    ? "Digite o código da peça" 
                    : mode === 'baixa' 
                      ? "Escaneie para dar baixa" 
                      : "Escaneie para ver informações"
                  }
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Scanner Content */}
          <div className="p-6">
            {!isManualMode ? (
              <div className="space-y-4">
                {/* Camera View */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-primary/20">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Scanner Overlay */}
                  <div className="absolute inset-0 bg-black/40">
                    {/* Scanner Frame */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {/* Scanning Area */}
                        <div className="w-80 h-48 border-2 border-primary rounded-lg bg-transparent">
                          {/* Corner indicators */}
                          <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-primary rounded-tl-lg"></div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-primary rounded-tr-lg"></div>
                          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-primary rounded-bl-lg"></div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-primary rounded-br-lg"></div>
                          
                          {/* Scanning Line */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
                          </div>
                        </div>
                        
                        {/* Instructions */}
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                          <p className="text-white text-sm font-medium mb-1">
                            Posicione o código dentro da área
                          </p>
                          <div className="flex items-center justify-center gap-2 text-primary">
                            <ScanLine className="h-4 w-4 animate-pulse" />
                            <span className="text-xs">Escaneando...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <div className="text-center text-white p-6 rounded-lg bg-black/50">
                        <AlertCircle className="h-12 w-12 mx-auto mb-3 text-destructive" />
                        <p className="mb-4">{error}</p>
                        <Button variant="outline" onClick={() => setIsManualMode(true)}>
                          Usar Modo Manual
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scanner Info */}
                <div className="text-center mt-4">
                  <p className="text-muted-foreground text-sm font-medium mb-2">
                    Scanner automático ativo
                  </p>
                  <Button variant="outline" onClick={() => setIsManualMode(true)}>
                    <Keyboard className="h-4 w-4 mr-2" />
                    Inserir Código Manualmente
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Manual Input */}
                <div className="text-center">
                  <div className="bg-primary/10 p-4 rounded-xl max-w-sm mx-auto mb-4">
                    <Keyboard className="h-12 w-12 text-primary mx-auto mb-2" />
                    <h3 className="text-heading-3 mb-1">Modo Manual</h3>
                    <p className="text-body-small text-muted-foreground">
                      Digite o código da etiqueta
                    </p>
                  </div>
                </div>

                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="manual-input">Código da Peça</Label>
                    <Input
                      id="manual-input"
                      type="text"
                      placeholder="Ex: BL001, CA002, VE003"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      className="h-14 text-lg text-center font-mono uppercase"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="button-gradient flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {mode === 'baixa' ? 'Confirmar Baixa' : 'Buscar Peça'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsManualMode(false)}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Usar Câmera
                    </Button>
                  </div>
                </form>

                {/* Scanned Item Display */}
                {scannedItem && (
                  <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">{scannedItem.id}</Badge>
                      <Badge className={scannedItem.status === 'Disponível' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}>
                        {scannedItem.status}
                      </Badge>
                    </div>
                    <h3 className="text-heading-3 mb-2">{scannedItem.name}</h3>
                    <p className="text-heading-3 text-primary mb-2">{scannedItem.price}</p>
                    <p className="text-body-small text-muted-foreground">{scannedItem.category}</p>
                    
                    {mode === 'baixa' && scannedItem.status === 'Disponível' && (
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => onScanSuccess(scannedItem.id)}
                      >
                        <ScanLine className="h-4 w-4 mr-2" />
                        Confirmar Baixa
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Recent Sales */}
            {recentSales.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-heading-3 mb-3">Últimas Baixas</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {recentSales.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/30">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{item.id}</Badge>
                        <span className="text-body-small">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <CheckCircle className="h-3 w-3 text-success inline mr-1" />
                        <span className="text-caption text-success">Vendida</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};