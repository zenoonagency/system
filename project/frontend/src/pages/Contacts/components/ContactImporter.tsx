// src/pages/Contacts/components/ContactImporter.tsx
import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, Trash2 } from 'lucide-react';
import { useContactsStore } from '../store/contactsStore';
import { read, utils } from 'xlsx';
import { useToast } from '../../../hooks/useToast';

export function ContactImporter() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { addContact, deleteAllContacts } = useContactsStore();
  const { showToast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      
      // Read file as array buffer
      const buffer = await file.arrayBuffer();
      const workbook = read(buffer);
      
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        throw new Error('Arquivo vazio ou inválido');
      }

      const sheet = workbook.Sheets[sheetName];
      const data = utils.sheet_to_json(sheet) as Record<string, any>[];

      let importCount = 0;
      const processedContacts = new Set(); // Track duplicates

      data.forEach(row => {
        // Find name field (case insensitive)
        const nameField = Object.keys(row).find(key => 
          key.toLowerCase().replace(/\s+/g, '') === 'nome' || 
          key.toLowerCase().replace(/\s+/g, '') === 'name'
        );
        
        // Find phone field (case insensitive)
        const phoneField = Object.keys(row).find(key => 
          key.toLowerCase().replace(/\s+/g, '') === 'telefone' || 
          key.toLowerCase().replace(/\s+/g, '') === 'phone'
        );

        if (nameField && phoneField) {
          const name = String(row[nameField]).trim();
          const phone = String(row[phoneField]).replace(/\D/g, '');
          
          // Skip empty or invalid entries
          if (!name || !phone) return;
          
          // Skip duplicates
          const key = `${name}-${phone}`;
          if (processedContacts.has(key)) return;
          processedContacts.add(key);

          // Create contact
          addContact({
            name,
            phone,
            tagIds: [],
            customFields: {},
          });

          importCount++;
        }
      });

      if (importCount > 0) {
        showToast(`${importCount} contatos importados com sucesso!`, 'success');
      } else {
        showToast('Nenhum contato válido encontrado no arquivo.', 'error');
      }

    } catch (err) {
      console.error('File import error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Erro ao processar arquivo. Verifique o formato e tente novamente.'
      );
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteAll = () => {
    if (confirm('Tem certeza que deseja excluir todos os contatos? Esta ação não pode ser desfeita.')) {
      deleteAllContacts();
      showToast('Todos os contatos foram excluídos com sucesso!', 'success');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Importar Contatos
        </h2>
        <button
          onClick={handleDeleteAll}
          className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Excluir Todos
        </button>
      </div>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-[#7f00ff] dark:hover:border-[#7f00ff] transition-colors">
        <FileSpreadsheet className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Arraste um arquivo .csv ou .xlsx aqui ou
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90 transition-colors"
        >
          Selecionar Arquivo
        </button>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Formatos aceitos: CSV, XLSX. Colunas necessárias: Nome/Name, Telefone/Phone
        </p>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
