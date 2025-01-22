import React from 'react';

export function Conversations() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <iframe
        src="https://chatview.zenoon.com.br"
        className="w-full h-full border-0"
        allow="camera; microphone; fullscreen; display-capture; picture-in-picture"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
      />
    </div>
  );
}
