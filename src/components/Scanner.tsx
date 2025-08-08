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
  recentSales?: Array<{
    id: string;
    name: string;
    soldDate?: string;
  }>;
}

export const Scanner = ({ onClose, onScanSuccess, recentSales = [] }: ScannerProps) => {
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isManualMode) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isManualMode]);

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
      setError("Não foi possível acessar a câmera. Use o modo manual.");
      setIsManualMode(true);
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
    onScanSuccess(manualInput.trim().toUpperCase());
  };

  const handleScanCapture = () => {
    // Simula um scan bem-sucedido para demonstração
    // Em produção, aqui seria integrado com uma biblioteca de QR/barcode
    const simulatedCode = "BL001";
    onScanSuccess(simulatedCode);
  };

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
                <h2 className="text-heading-2">Scanner de Código</h2>
                <p className="text-body-small text-muted-foreground">
                  {isManualMode ? "Digite o código da peça" : "Aponte para o código da peça"}
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
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {isCameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-2 border-primary rounded-lg w-64 h-40 flex items-center justify-center">
                        <div className="border border-primary/50 rounded w-56 h-32 flex items-center justify-center">
                          <ScanLine className="h-8 w-8 text-primary animate-pulse" />
                        </div>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center text-white">
                        <AlertCircle className="h-12 w-12 mx-auto mb-2 text-destructive" />
                        <p>{error}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="flex gap-2 justify-center">
                  <Button 
                    className="button-gradient" 
                    onClick={handleScanCapture}
                    disabled={!isCameraActive}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Capturar Código
                  </Button>
                  <Button variant="outline" onClick={() => setIsManualMode(true)}>
                    <Keyboard className="h-4 w-4 mr-2" />
                    Modo Manual
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
                      Confirmar Baixa
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