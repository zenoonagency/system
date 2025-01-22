import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#7f00ff] to-[#e100ff] rounded-lg opacity-50"></div>
        <input
          {...props}
          className={`relative w-full px-3 py-2 bg-gray-50 dark:bg-dark-700 rounded-lg text-gray-900 dark:text-white focus:outline-none ${className}`}
        />
      </div>
    </div>
  );
} 