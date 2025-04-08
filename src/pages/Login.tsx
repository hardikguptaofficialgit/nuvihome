
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/community" />;
  }

  const handleLoginWithEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    setLoading(true);
    try {
      // This would need to be implemented in the AuthContext
      toast.info('Google login is not implemented yet');
    } catch (error) {
      toast.error('An error occurred during Google login');
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background py-12">
      <Card className="w-full max-w-md glass-card animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to login
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleLoginWithEmail}>
            <div className="grid gap-2">
              <Label htmlFor="email">
                <Mail className="mr-2 h-4 w-4 inline-block align-middle" />
                Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
                
            </div>
          
            <div className="grid gap-2 mt-8">
            
              <Label htmlFor="password">
                <Lock className="mr-2 h-4 w-4 inline-block align-middle" />
                Password
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button disabled={loading} className="w-full mt-4">
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" disabled={loading} className="w-full" onClick={handleLoginWithGoogle}>
            {loading ? 'Loading...' : 'Google'}
          </Button>
        </CardContent>
        <div className="p-6 pt-0 text-center">
          Don't have an account? <Link to="/signup" className="text-primary underline">Sign up</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
