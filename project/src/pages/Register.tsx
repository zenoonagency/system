import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../hooks/useToast';
import { useNotification } from '../hooks/useNotification';
import { getErrorMessage } from '../utils/error.handler';
import { Notification } from '../components/Notification';

export function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { showToast } = useToast();
  const { notification, showNotification, hideNotification } = useNotification();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    
    try {
      const { user, message } = await api.register({ name, email, password });
      login(user);
      showNotification(message, 'success');
      setTimeout(() => {
        navigate('/dashboard/ai-agent');
      }, 2000);
    } catch (error) {
      const message = getErrorMessage(error);
      showToast(message, 'error');
      console.error('Erro ao cadastrar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
      <div className="bg-white dark:bg-dark-800 p-8 rounded-lg shadow-md w-96">
        <div className="flex items-center justify-center mb-6">
          <img
            src="https://zenoon.com.br/wp-content/uploads/2024/12/logo-black-inteira.png"
            alt="Cadastro"
            className="w-24"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Cadastro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Nome"
            required
            disabled={loading}
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            required
            disabled={loading}
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Senha"
            required
            disabled={loading}
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7f00ff] text-white py-2 px-4 rounded-md hover:bg-[#7f00ff]/90 focus:outline-none focus:ring-2 focus:ring-[#7f00ff] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Registrando...
              </span>
            ) : (
              'Cadastrar'
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-[#7f00ff] hover:text-[#7f00ff]/80">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}