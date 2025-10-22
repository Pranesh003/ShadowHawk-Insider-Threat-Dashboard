
import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { Toast } from './Toast';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-5 right-5 z-50 w-full max-w-sm">
      <div className="flex flex-col-reverse space-y-4 space-y-reverse">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </div>
  );
};
