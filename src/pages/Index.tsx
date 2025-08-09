import { useAuth } from "@/hooks/useAuth";
import { AdminDashboard } from "@/components/AdminDashboard";
import { ResellerDashboard } from "@/components/ResellerDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { profile, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      {profile?.role === 'admin' ? (
        <AdminDashboard onLogout={signOut} />
      ) : (
        <ResellerDashboard onLogout={signOut} />
      )}
    </ProtectedRoute>
  );
};

export default Index;
