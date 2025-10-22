
import React, { useEffect } from 'react';
import { ToastMessage } from '../../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: () => void;
}

const ICONS: { [key in ToastMessage['type']]: React.ReactNode } = {
    info: (
        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    success: (
        <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    warning: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    ),
    critical: (
        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
};

const BORDER_COLORS: { [key in ToastMessage['type']]: string } = {
  info: 'border-blue-500',
  success: 'border-green-500',
  warning: 'border-yellow-500',
  critical: 'border-red-500',
};


export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onDismiss]);

  return (
    <div 
        className={`relative bg-gray-800 border-l-4 ${BORDER_COLORS[toast.type]} rounded-r-lg shadow-2xl p-4 flex items-start space-x-4 animate-fade-in-right`}
        role="alert"
    >
      <div className="flex-shrink-0">{ICONS[toast.type]}</div>
      <div className="flex-1">
        <p className="font-bold text-white">{toast.title}</p>
        <p className="text-sm text-gray-300">{toast.description}</p>
      </div>
      <button onClick={onDismiss} className="p-1 rounded-full hover:bg-gray-700 transition-colors" aria-label="Dismiss">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <style>{`
        @keyframes fade-in-right {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right {
            animation: fade-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
