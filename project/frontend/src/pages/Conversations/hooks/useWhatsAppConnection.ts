import { useEffect, useState } from 'react';
import { useConversationStore } from '../store/conversationStore';

export function useWhatsAppConnection() {
  const { setWhatsAppStatus, setQRCode } = useConversationStore();
  const [showQRCode, setShowQRCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connectWhatsApp = async (userName: string) => {
    if (!userName.trim()) {
      setError('Nome é obrigatório');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://zenoon-agency-n8n.htm57w.easypanel.host/webhook-test/getqrcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          userName: userName.trim(),
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar QR Code');
      }

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Resposta inválida do servidor');
      }

      if (data.qrCode) {
        setQRCode(data.qrCode);
        setShowQRCode(true);
        return true;
      } else {
        throw new Error('QR Code não recebido');
      }
    } catch (error) {
      console.error('WhatsApp connection error:', error);
      setError(error instanceof Error ? error.message : 'Erro ao conectar WhatsApp');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Poll for connection status
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (showQRCode) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch('https://zenoon-agency-n8n.htm57w.easypanel.host/webhook-test/status');
          const data = await response.json();
          
          if (data.connected) {
            setWhatsAppStatus(true);
            setShowQRCode(false);
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error('Failed to check WhatsApp status:', error);
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [showQRCode, setWhatsAppStatus]);

  return {
    showQRCode,
    setShowQRCode,
    error,
    loading,
    connectWhatsApp
  };
}