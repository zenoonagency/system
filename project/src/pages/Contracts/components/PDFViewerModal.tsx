import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName?: string;
}

export function PDFViewerModal({ isOpen, onClose, fileUrl, fileName }: PDFViewerModalProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    if (isOpen) {
      setPageNumber(1);
      setScale(1.0);
      setLoading(true);
      setError(null);
    }
  }, [isOpen]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setLoading(false);
    setError('Não foi possível carregar o PDF. Por favor, tente novamente mais tarde.');
  }

  const handleDownload = async () => {
    try {
      setError(null);
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Erro ao baixar o arquivo');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'documento.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      setError('Erro ao baixar o arquivo. Por favor, tente novamente.');
    }
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2.0));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-[90vw] h-[90vh] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Visualizar Documento
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                title="Diminuir zoom"
              >
                <ZoomOut size={20} />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                title="Aumentar zoom"
              >
                <ZoomIn size={20} />
              </button>
            </div>
            <button
              onClick={handleDownload}
              className="text-[#7f00ff] hover:text-[#7f00ff]/80 transition-colors"
              title="Download"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center h-[calc(90vh-8rem)] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f00ff]"></div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                }}
                className="px-4 py-2 bg-[#7f00ff] text-white rounded-md hover:bg-[#7f00ff]/90"
              >
                Tentar Novamente
              </button>
            </div>
          )}
          
          {!error && (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={null}
              className="max-h-full"
              options={{
                cMapUrl: 'https://unpkg.com/pdfjs-dist@4.0.379/cmaps/',
                cMapPacked: true,
                standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@4.0.379/standard_fonts/'
              }}
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="max-w-full shadow-lg"
                scale={scale}
                loading={
                  <div className="flex items-center justify-center h-[600px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f00ff]"></div>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center h-[600px]">
                    <p className="text-red-500">Erro ao carregar a página</p>
                  </div>
                }
              />
            </Document>
          )}
        </div>

        {numPages && !error && (
          <div className="flex items-center justify-center space-x-4 mt-4">
            <button
              onClick={() => setPageNumber(page => Math.max(page - 1, 1))}
              disabled={pageNumber <= 1}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Página {pageNumber} de {numPages}
            </span>
            <button
              onClick={() => setPageNumber(page => Math.min(page + 1, numPages))}
              disabled={pageNumber >= numPages}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}