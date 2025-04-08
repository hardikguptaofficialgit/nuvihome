
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'student@example.com',
    password: 'password123',
    name: 'John Student',
    role: 'student',
    avatar: '',
    courses: ['JEE Advanced', 'NEET Prep'],
    progress: 67,
    joinedOn: '2023-10-15',
  },
  {
    id: '2',
    email: 'test@example.com',
    password: 'test123',
    name: 'Test User',
    role: 'student',
    avatar: '',
    courses: ['Physics 101', 'Chemistry Basics'],
    progress: 45,
    joinedOn: '2023-11-20',
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved auth in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      setIsLoading(false);
      throw new Error('User already exists');
    }
    
    // In a real app, we would save this to a database
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      role: 'student',
      courses: [],
      progress: 0,
      joinedOn: new Date().toISOString().split('T')[0],
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem('user');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
