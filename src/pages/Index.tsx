import { useState } from 'react';
import LoginScreen from '@/components/LoginScreen';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [user, setUser] = useState<{ role: 'policymaker' | 'researcher'; username: string } | null>(null);

  const handleLogin = (role: 'policymaker' | 'researcher', username: string) => {
    setUser({ role, username });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default Index;
