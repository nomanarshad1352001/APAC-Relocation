import { motion } from 'framer-motion';

interface AddButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export default function AddButton({ onClick, label = 'Add New', className = '' }: AddButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 text-amber-700 font-semibold text-sm hover:bg-amber-100 hover:border-amber-500 transition-all ${className}`}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      {label}
    </motion.button>
  );
}
