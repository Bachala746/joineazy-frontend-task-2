import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from './Icons';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl text-white text-sm font-medium transition-all transform duration-300 translate-y-0 ${
              isError
                ? 'bg-rose-600'
                : isInfo
                ? 'bg-sky-600'
                : 'bg-emerald-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon name={isError ? 'alert' : 'check'} className="w-5 h-5 flex-shrink-0" />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-white/80 hover:text-white text-lg font-bold"
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
};