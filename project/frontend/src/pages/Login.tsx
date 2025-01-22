import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../hooks/useToast';
import { Loader2 } from 'lucide-react';
import { Notification } from '../components/Notification';

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await api.login({ email, password });
      login(user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex items-center justify-center mb-6">
          <img
            src="https://zenoon.com.br/wp-content/uploads/2024/12/logo-black-inteira.png"
            alt="Login"
            className="w-24"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-[#7f00ff] focus:ring focus:ring-[#7f00ff]/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-[#7f00ff] focus:ring focus:ring-[#7f00ff]/20"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7f00ff] text-white py-2 px-4 rounded-md hover:bg-[#7f00ff]/90 focus:outline-none focus:ring-2 focus:ring-[#7f00ff] focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Carregando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-[#7f00ff] hover:text-[#7f00ff]/80">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}