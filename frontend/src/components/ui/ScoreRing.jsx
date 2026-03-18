import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ScoreRing({ 
  score = 0, 
  size = 120, 
  strokeWidth = 10,
  label = "Score",
  delay = 0
}) {
  const [displayScore, setDisplayScore] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  useEffect(() => {
    let startTime;
    const duration = 1500;
    
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = (time - startTime) / duration;
      
      if (progress < 1) {
        setDisplayScore(Math.floor(safeScore * easeOutQuart(progress)));
        requestAnimationFrame(animate);
      } else {
        setDisplayScore(safeScore);
      }
    };
    
    const timer = setTimeout(() => requestAnimationFrame(animate), delay * 1000);
    return () => clearTimeout(timer);
  }, [safeScore, delay]);

  // Easing function
  const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border, #1E1E2E)"
          strokeWidth={strokeWidth}
        />
        {/* Animated tracking ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#score-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, delay, ease: "easeOut" }}
          style={{ dropShadow: '0 0 8px rgba(108, 99, 255, 0.5)' }}
        />
        <defs>
          <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6C63FF" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display font-bold text-4xl text-text-primary tracking-tighter">
          {displayScore}
        </span>
        <span className="text-xs text-text-secondary uppercase tracking-wider mt-1">
          {label}
        </span>
      </div>
    </div>
  );
}
