import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, Trash2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface DocumentUploadButtonProps {
  webhook: string;
}

export function DocumentUploadButton({ webhook }: DocumentUploadButtonProps) {
  const { showToast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!webhook) {
      showToast('Por favor, insira o webhook do arquivo.', 'error');
      return;
    }

    if (!selectedFile) {
      showToast('Por favor, selecione um arquivo primeiro.', 'error');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('timestamp', new Date().toISOString());

      const response = await fetch(webhook, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Falha ao enviar arquivo');

      showToast('Arquivo enviado com sucesso!', 'success');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      showToast('Erro ao enviar arquivo.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAllFiles = async () => {
    if (!webhook) {
      showToast('Por favor, insira o webhook do arquivo.', 'error');
      return;
    }

    try {
      const response = await fetch(webhook, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_all',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Falha ao deletar arquivos');

      showToast('Todos os arquivos foram deletados com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao deletar arquivos:', error);
      showToast('Erro ao deletar arquivos.', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Upload de Documentos
        </h3>
        <button
          onClick={handleDeleteAllFiles}
          disabled={!webhook}
          className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Deletar Todos Arquivos
        </button>
      </div>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-[#7f00ff] dark:hover:border-[#7f00ff] transition-colors">
        <FileSpreadsheet className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Arraste um arquivo aqui ou
        </p>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={!webhook}
          className="px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Selecionar Arquivo
        </button>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div className="flex items-center">
            <FileSpreadsheet className="w-5 h-5 text-[#7f00ff] mr-2" />
            <span className="text-gray-700 dark:text-gray-300">{selectedFile.name}</span>
          </div>
          <button
            onClick={handleFileUpload}
            disabled={uploading || !webhook}
            className="px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      )}
    </div>
  );
}