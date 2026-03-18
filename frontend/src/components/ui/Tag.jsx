import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import clsx from 'clsx';

export default function Tag({ 
  label, 
  onRemove, 
  variant = 'default',
  icon = null,
  className = ''
}) {
  const variants = {
    default: "bg-surface border-border text-text-primary",
    success: "bg-success/10 border-success/30 text-success",
    warning: "bg-accent/10 border-accent/30 text-accent",
    primary: "bg-primary/10 border-primary/30 text-primary"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-tag border text-sm font-medium",
        variants[variant],
        className
      )}
    >
      {icon === 'check' && <Check size={14} />}
      {icon && typeof icon !== 'string' && icon}
      
      {label}
      
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 opacity-60 hover:opacity-100 transition-opacity focus:outline-none"
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  );
}
