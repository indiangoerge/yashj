import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    const storedRole = localStorage.getItem('currentRole') as UserRole;
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedRole) {
      setCurrentRole(storedRole);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate authentication - in real app, this would call an API
    if (email && password) {
      const mockUser: User = {
        id: '1',
        email,
        role: 'admin',
        name: email.split('@')[0]
      };
      
      setUser(mockUser);
      setCurrentRole('admin');
      
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      localStorage.setItem('currentRole', 'admin');
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentRole('admin');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRole');
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('currentRole', role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        setCurrentRole: handleRoleChange,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};