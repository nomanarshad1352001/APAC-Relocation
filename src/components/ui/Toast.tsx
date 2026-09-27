import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

const STYLES = {
  success: { bg: 'bg-emerald-600', icon: 'check' as const },
  error: { bg: 'bg-red-600', icon: 'x' as const },
  info: { bg: 'bg-gray-900', icon: 'bell' as const },
};

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-24 right-6 z-[110] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3200);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const style = STYLES[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${style.bg} min-w-[260px]`}
    >
      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <Icon name={style.icon} size={11} />
      </span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        <Icon name="x" size={10} />
      </button>
    </motion.div>
  );
}
