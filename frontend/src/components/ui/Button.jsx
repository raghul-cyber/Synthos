import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  type = 'button'
}) {
  const baseClasses = "relative px-8 py-4 rounded-tag font-display font-semibold text-lg transition-all duration-300 overflow-hidden group outline-none";
  
  const variants = {
    primary: "bg-surface text-text-primary border border-primary/30 hover:border-primary/60",
    glow: "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_20px_rgba(108,99,255,0.3)] hover:shadow-[0_0_40px_rgba(108,99,255,0.6)] animate-pulse-glow hover:animate-none",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary border border-transparent hover:border-border",
    danger: "bg-transparent text-accent border border-accent/30 hover:border-accent hover:bg-accent/10"
  };

  return (
    <motion.button
      type={type}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={clsx(
        baseClasses,
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed grayscale",
        className
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {variant === 'primary' && !disabled && (
        <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      )}
    </motion.button>
  );
}
