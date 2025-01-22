import React from 'react';
import { AIControlButton } from '../components/buttons/AIControlButton';
import { DocumentUploadButton } from '../components/buttons/DocumentUploadButton';

export function AIAgent() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">AI Agent Control Panel</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <AIControlButton isActive={false} onStatusChange={() => {}} />
        <DocumentUploadButton />
      </div>
    </div>
  );
}