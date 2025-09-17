import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Droplets, Shield, User } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: 'policymaker' | 'researcher', username: string) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [role, setRole] = useState<'policymaker' | 'researcher'>('policymaker');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(role, username);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Droplets className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            AquaWatch DWLR
          </h1>
          <p className="text-primary-foreground/80">
            Groundwater Monitoring & Analysis System
          </p>
        </div>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Access the groundwater monitoring dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Role</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value as 'policymaker' | 'researcher')}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="policymaker" id="policymaker" />
                    <Label htmlFor="policymaker" className="flex items-center gap-2 cursor-pointer">
                      <Shield className="h-4 w-4" />
                      Policymaker
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="researcher" id="researcher" />
                    <Label htmlFor="researcher" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Researcher
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={!username.trim() || !password.trim()}
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-primary-foreground/60 text-sm mt-6">
          Demo credentials: Any username/password combination
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;