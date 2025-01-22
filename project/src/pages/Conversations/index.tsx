import React, { useEffect } from 'react';

export function Conversations() {
  useEffect(() => {
    // Tenta detectar login direto no navegador antes de carregar o iframe
    const isLoggedIn = document.cookie.includes('chatwoot_session');
    if (!isLoggedIn) {
      window.location.href = 'https://chatview.zenoon.com.br/app/1/';
    }
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900">
      <iframe
        src="https://chatview.zenoon.com.br"
        className="w-full h-full border-none"
        allow="camera; microphone; fullscreen; display-capture; picture-in-picture"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
      />
    </div>
  );
}
