import { motion } from 'framer-motion';

export default function ProgressBar({ 
  progress = 0, 
  height = 'h-2', 
  color = 'bg-gradient-to-r from-primary to-secondary',
  delay = 0,
  showValue = false,
  label = null
}) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-end mb-2 text-sm">
          {label && <span className="text-text-secondary">{label}</span>}
          {showValue && <span className="font-mono text-text-primary">{safeProgress}%</span>}
        </div>
      )}
      <div className={`w-full bg-border rounded-full overflow-hidden ${height}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeProgress}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}
