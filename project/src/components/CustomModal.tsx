import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  type: 'alert' | 'confirm' | 'prompt';
  onConfirm?: () => void;
  onCancel?: () => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  message,
  type,
  onConfirm,
  onCancel,
  inputValue,
  onInputChange,
}: CustomModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-dark-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {type === 'confirm' && (
                      <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                    )}
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      {title}
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    className="rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {message && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-300">{message}</p>
                  </div>
                )}

                {type === 'prompt' && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => onInputChange?.(e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-dark-700 dark:text-white"
                      autoFocus
                    />
                  </div>
                )}

                <div className="mt-4 flex justify-end gap-3">
                  {(type === 'confirm' || type === 'prompt') && (
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none"
                      onClick={() => {
                        onCancel?.();
                        onClose();
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none"
                    onClick={() => {
                      onConfirm?.();
                      onClose();
                    }}
                  >
                    {type === 'alert' ? 'OK' : 'Confirmar'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// Funções utilitárias para usar o modal como substituto dos métodos nativos
export function useCustomModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [modalConfig, setModalConfig] = React.useState<Omit<CustomModalProps, 'isOpen' | 'onClose'>>({
    title: '',
    type: 'alert',
  });
  const [resolvePromise, setResolvePromise] = React.useState<((value: any) => void) | null>(null);
  const [inputValue, setInputValue] = React.useState('');

  const showModal = (config: Omit<CustomModalProps, 'isOpen' | 'onClose'>) => {
    return new Promise((resolve) => {
      setModalConfig(config);
      setResolvePromise(() => resolve);
      setIsOpen(true);
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    resolvePromise?.(null);
    setResolvePromise(null);
    setInputValue('');
  };

  const handleConfirm = () => {
    if (modalConfig.type === 'prompt') {
      resolvePromise?.(inputValue);
    } else {
      resolvePromise?.(true);
    }
    handleClose();
  };

  const handleCancel = () => {
    resolvePromise?.(null);
    handleClose();
  };

  const modal = (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      {...modalConfig}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      inputValue={inputValue}
      onInputChange={setInputValue}
    />
  );

  const customAlert = (title: string, message?: string) =>
    showModal({ title, message, type: 'alert' });

  const customConfirm = (title: string, message?: string) =>
    showModal({ title, message, type: 'confirm' });

  const customPrompt = (title: string, message?: string) =>
    showModal({ title, message, type: 'prompt' });

  return {
    modal,
    customAlert,
    customConfirm,
    customPrompt,
  };
} 