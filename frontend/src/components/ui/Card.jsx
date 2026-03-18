import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Card({ 
  children, 
  className = '', 
  delay = 0, 
  hover = false,
  glass = true
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={hover ? { y: -4, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' } : {}}
      className={clsx(
        "rounded-card p-6 border transition-all duration-300",
        glass ? "glass-panel border-border/50" : "bg-surface border-border",
        hover && "cursor-pointer hover:border-primary/50",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
