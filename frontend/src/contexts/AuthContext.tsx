import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { apiService } from '@/services/api';
import { signIn, signUp, logOut } from '@/services/auth.service';

interface User {
  id: number;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser && token !== "undefined" && savedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        // Corrupted data - clear it
        console.error('Failed to parse user from localStorage:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      }
    } else {
      // Clear any partial/corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await signIn(email, password) as any;
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
    // Note: token is stored in auth.service.ts via setToken
  };

  const signup = async (email: string, password: string, name?: string) => {
    const response = await signUp(email, password, name) as any;
    // Signup returns {user: {...}} but doesn't include token
    // User needs to sign in after signup
    if (response?.user) {
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
  };

  const logout = () => {
    logOut();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

