import { ZenoonAPI } from '../services/api-zenoon';
import { useToast } from '../hooks/useToast';

// Exemplo de como criar um board usando a API
async function createBoardExample() {
  const api = ZenoonAPI.getInstance();
  const { showToast } = useToast();

  try {
    // Dados do board a ser criado
    const boardData = {
      title: 'Novo Projeto',
      description: 'Board para gerenciar tarefas do novo projeto',
      color: '#7f00ff', // Cor roxa
      order: 1 // Posição do board
    };

    // Fazendo a requisição para criar o board
    const newBoard = await api.createBoard(boardData);

    // Mostrando mensagem de sucesso
    showToast('Board criado com sucesso!', 'success');

    // Logando os dados do board criado
    console.log('Board criado:', {
      id: newBoard.id,
      title: newBoard.title,
      description: newBoard.description,
      color: newBoard.color,
      order: newBoard.order,
      createdAt: new Date(newBoard.createdAt).toLocaleString(),
      updatedAt: new Date(newBoard.updatedAt).toLocaleString()
    });

    return newBoard;

  } catch (error) {
    // Tratando erros
    console.error('Erro ao criar board:', error);
    showToast('Erro ao criar board. Tente novamente.', 'error');
    throw error;
  }
}

// Exemplo de como usar em um componente React
export function CreateBoardButton() {
  const handleClick = async () => {
    try {
      const board = await createBoardExample();
      console.log('Board criado com sucesso:', board);
    } catch (error) {
      console.error('Falha ao criar board:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90"
    >
      Criar Novo Board
    </button>
  );
}

// Exemplo de como usar com fetch diretamente
async function createBoardWithFetch() {
  const token = localStorage.getItem('auth_token');
  
  try {
    const response = await fetch('https://zenoon-agency-n8n.htm57w.easypanel.host/webhook/boards/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Novo Projeto',
        description: 'Board para gerenciar tarefas do novo projeto',
        color: '#7f00ff',
        order: 1
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao criar board');
    }

    const data = await response.json();
    console.log('Board criado:', data);
    return data;

  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// Exemplo de como usar com axios diretamente
async function createBoardWithAxios() {
  const token = localStorage.getItem('auth_token');
  
  try {
    const response = await axios.post(
      'https://zenoon-agency-n8n.htm57w.easypanel.host/webhook/boards/create',
      {
        title: 'Novo Projeto',
        description: 'Board para gerenciar tarefas do novo projeto',
        color: '#7f00ff',
        order: 1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Board criado:', response.data);
    return response.data;

  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
} 