import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './hooks/useStore';
import Navbar from './components/layout/Navbar';
import Hero from './components/screens/Hero';
import SkillCapture from './components/screens/SkillCapture';
import KnowledgeGraph from './components/screens/KnowledgeGraph';
import MarketOverlay from './components/screens/MarketOverlay';
import CareerPaths from './components/screens/CareerPaths';

function App() {
  const { currentStep } = useStore();

  const steps = {
    1: <Hero />,
    2: <SkillCapture />,
    3: <KnowledgeGraph />,
    4: <MarketOverlay />,
    5: <CareerPaths />
  };

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-primary/30 font-sans">
      <Navbar />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {steps[currentStep]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
