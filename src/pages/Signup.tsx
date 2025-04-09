import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, UserPlus } from 'lucide-react';

// Add email validation function
const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim()) return toast.error('Please enter your email') && false;
    if (!isValidEmail(email)) return toast.error('Please enter a valid email address') && false;
    if (!password.trim()) return toast.error('Please enter a password') && false;
    if (password.length < 6) return toast.error('Password must be at least 6 characters long') && false;
    if (password !== confirmPassword) return toast.error('Passwords do not match') && false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signup(email, password, name);
      toast.success('Signup successful. Please check your email for verification.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center pt-20 pb-16 px-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 rounded-2xl animate-fade-in shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Create Your Account</h1>
            <p className="text-muted-foreground mt-2">Join Nuvibrainz Now !!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Hardik Gupta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="hardikgupta8792@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-lg pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Must be at least 6 characters long</p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <Button
  type="submit"
  className="w-full 
             bg-black text-white hover:bg-accent hover:text-black 
             dark:bg-white dark:text-black dark:hover:bg-accent 
             transition-all duration-200 
             rounded-lg flex items-center justify-center gap-2"
  disabled={isLoading}
>
  {isLoading ? (
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
  ) : (
    <>
      <UserPlus size={18} />
      Create Account
    </>
  )}
</Button>

            {/* Footer link */}
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
  to="/login"
  className="text-black dark:text-accent hover:underline"
>
  Sign in
</Link>

              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
