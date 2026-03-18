import { motion } from 'framer-motion';
import { useStore } from '../../hooks/useStore';
import Button from '../ui/Button';
import { ArrowRight, Activity, ShieldCheck, Cpu } from 'lucide-react';
import ParticlesBackground from '../ParticlesBackground';

export default function Hero() {
  const { nextStep } = useStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <ParticlesBackground />
      
      <div className="relative z-10 container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Synthos Engine Online
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 tracking-tight">
            Navigate Your <br />
            <span className="text-gradient">Human Capital</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-text-secondary leading-relaxed mb-10 max-w-xl">
            Stop guessing your market value. Map your skills against real-time 
            demand, calculate your capital score, and execute high-ROI career pivots 
            backed by deterministic data.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Button variant="glow" onClick={nextStep}>
              Initialize Scan <ArrowRight size={18} />
            </Button>
            <Button variant="ghost">
              View Methodology
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-16 grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
            <div>
              <div className="text-3xl font-display font-bold text-white mb-1">80+</div>
              <div className="text-sm text-text-muted">Skills Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-white mb-1">100+</div>
              <div className="text-sm text-text-muted">Adjacency Edges</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-white mb-1">10</div>
              <div className="text-sm text-text-muted">Career Vectors</div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Right side abstract visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden lg:block relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-[100px] animate-pulse-glow" />
          
          <div className="relative glass-panel p-8 w-full max-w-lg ml-auto border-border/50 aspect-square flex items-center justify-center">
            {/* Concentric rotating rings */}
            <div className="absolute inset-4 rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-16 rounded-full border border-secondary/20 border-dashed animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-28 rounded-full border border-primary/30 animate-[spin_10s_linear_infinite]" />
            
            {/* Center Core */}
            <div className="w-32 h-32 rounded-full bg-surface border border-primary/50 flex items-center justify-center shadow-[0_0_30px_rgba(108,99,255,0.2)]">
              <Network size={48} className="text-primary" />
            </div>
            
            {/* Orbiting nodes */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute inset-4"
            >
              <div className="absolute -top-3 left-1/2 w-6 h-6 rounded-full bg-surface border border-primary flex items-center justify-center -translate-x-1/2">
                <Activity size={12} className="text-primary" />
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute inset-16"
            >
              <div className="absolute top-1/4 -right-3 w-6 h-6 rounded-full bg-surface border border-secondary flex items-center justify-center transform translate-y-1/2">
                <ShieldCheck size={12} className="text-secondary" />
              </div>
            </motion.div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
