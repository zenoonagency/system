import React from 'react';
import { Edit2, Trash2, UserCheck, UserX } from 'lucide-react';
import { Client } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCustomModal } from '../../../components/CustomModal';

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

export function ClientList({ clients, onEdit, onDelete }: ClientListProps) {
  const { modal, customConfirm } = useCustomModal();

  const handleDelete = async (id: string) => {
    const confirmed = await customConfirm(
      'Excluir cliente',
      'Tem certeza que deseja excluir este cliente?'
    );
    
    if (confirmed) {
      try {
        await api.delete(`/clients/${id}`);
        mutate('/clients');
        showToast('success', 'Cliente excluído com sucesso!');
      } catch (error) {
        showToast('error', 'Erro ao excluir cliente');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-dar-200 dark:divide-dark-700">
        <thead className="bg-dark-50 dark:bg-dark-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Nome
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Telefone
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Data de Cadastro
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-800 divide-y divide-dark-200 dark:divide-dark-700">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-dark-50 dark:hover:bg-dark-700/50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{client.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">{client.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  client.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {client.status === 'active' ? (
                    <>
                      <UserCheck className="w-4 h-4 mr-1" />
                      Ativo
                    </>
                  ) : (
                    <>
                      <UserX className="w-4 h-4 mr-1" />
                      Inativo
                    </>
                  )}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(client.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(client)}
                  className="text-[#7f00ff] hover:text-[#7f00ff]/80 mr-3"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modal}
    </div>
  );
}