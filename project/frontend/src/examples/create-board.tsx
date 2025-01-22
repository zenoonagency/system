import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Board {
  id: string;
  title: string;
  description: string;
}

export function CreateBoard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);

      const response = await api.post<Board>('/api/boards', {
        title: 'Novo Board',
        description: 'Descrição do novo board'
      });

      navigate(`/boards/${response.data.id}`);
    } catch (error) {
      console.error('Erro ao criar board:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-primary"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? 'Criando...' : 'Criar Novo Board'}
    </button>
  );
} 