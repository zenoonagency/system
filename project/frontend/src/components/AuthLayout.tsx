import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function AuthLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);

  // Auto-login para desenvolvimento
  React.useEffect(() => {
    if (!isAuthenticated) {
      login({
        id: '1',
        name: 'Usuário Teste',
        email: 'dev@example.com'
      });
    }
  }, [isAuthenticated, login]);

  // Aguarda um pequeno delay para o auto-login
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}