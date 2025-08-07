import { useState } from "react";
import { Login } from "@/components/Login";
import { AdminDashboard } from "@/components/AdminDashboard";
import { ResellerDashboard } from "@/components/ResellerDashboard";

const Index = () => {
  const [user, setUser] = useState<{ type: 'admin' | 'reseller' } | null>(null);

  const handleLogin = (userType: 'admin' | 'reseller') => {
    setUser({ type: userType });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (user.type === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <ResellerDashboard onLogout={handleLogout} />;
};

export default Index;
