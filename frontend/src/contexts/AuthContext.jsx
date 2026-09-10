import { createContext, useContext, useEffect, useState } from 'react';
import { loginAdmin } from '../api/client';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('idli_admin_user');
    const token = localStorage.getItem('idli_admin_token');
    if (storedUser && token) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('idli_admin_user');
        localStorage.removeItem('idli_admin_token');
      }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const data = await loginAdmin(email, password);
    localStorage.setItem('idli_admin_token', data.token);
    localStorage.setItem('idli_admin_user', JSON.stringify(data.user));
    setCurrentUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem('idli_admin_token');
    localStorage.removeItem('idli_admin_user');
    setCurrentUser(null);
    return Promise.resolve();
  }

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
