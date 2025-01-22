import React from 'react';
import { Search } from 'lucide-react';

interface ContractSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ContractSearch({ value, onChange }: ContractSearchProps) {
  return (
    <div className="relative max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Search contracts..."
      />
    </div>
  );
}