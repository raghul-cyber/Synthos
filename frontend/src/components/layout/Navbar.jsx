import { motion } from 'framer-motion';
import { useStore } from '../../hooks/useStore';
import { Network, Database, BrainCircuit, Target, Zap } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
  const { currentStep, setStep } = useStore();

  const steps = [
    { id: 1, name: 'Identity', icon: Target },
    { id: 2, name: 'Inventory', icon: Database },
    { id: 3, name: 'Graph', icon: Network },
    { id: 4, name: 'Market', icon: Zap },
    { id: 5, name: 'Paths', icon: BrainCircuit }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 border-b border-border/50 bg-background/80 backdrop-blur-xl z-50">
      <div className="container mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setStep(1)}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
            <Network className="text-white" size={18} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">SYNTHOS</span>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-surface/50 border border-border rounded-full px-2 py-1.5 backdrop-blur-sm">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <button
                key={step.id}
                onClick={() => setStep(step.id)}
                disabled={step.id > 2 && currentStep < 2} // Prevent skipping ahead
                className={clsx(
                  "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  isActive ? "text-white" : 
                  isCompleted ? "text-text-secondary hover:text-text-primary" : 
                  "text-text-muted opacity-50 cursor-not-allowed"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10">{step.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-mono text-text-muted hidden sm:block">
            v1.0.0-prod
          </div>
          <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-primary font-bold">
            S
          </div>
        </div>
      </div>
    </nav>
  );
}
