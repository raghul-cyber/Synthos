import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../hooks/useStore';
import { useMarketData } from '../../hooks/useMarketData';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ScoreRing from '../ui/ScoreRing';
import Tag from '../ui/Tag';
import { ArrowRight, AlertTriangle, TrendingUp, Sparkles, Activity, ShieldAlert } from 'lucide-react';

export default function MarketOverlay() {
  const { nextStep } = useStore();
  const { marketData, isLoading } = useMarketData();
  const [activeTab, setActiveTab] = useState('demand');

  if (isLoading || !marketData) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <Activity className="w-12 h-12 text-secondary animate-pulse mx-auto" />
          <p className="text-text-secondary font-mono tracking-wider">Aggregating Market Signals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Market Intelligence</h2>
            <p className="text-text-secondary text-lg">
              Macro-level valuation of your current portfolio against real-time global demand metrics.
            </p>
          </div>
          <Button variant="glow" onClick={nextStep}>
            Generate Career Vectors <ArrowRight size={18} />
          </Button>
        </div>

        {/* Global Insight Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 border border-primary/20 rounded-xl p-6 mb-8 flex items-start sm:items-center gap-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary/10 to-transparent skew-x-12 transform translate-x-10"></div>
          
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 shadow-[0_0_15px_rgba(108,99,255,0.4)]">
            <Sparkles className="text-primary" size={24} />
          </div>
          <div className="relative z-10 flex-grow">
            <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-1">Synthos AI Insight</h4>
            <div className="text-lg font-medium leading-relaxed" id="typewriter-insight">
              {marketData.insight || 
                "Your primary + secondary combinations put you in the top 18% of the ecosystem. Adding one cross-domain skill (e.g. DevOps) could increase compensation by $25K+ per annum."}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Nav Tabs */}
            <div className="flex gap-2 p-1 bg-surface border border-border rounded-lg inline-flex mb-2">
              <button 
                onClick={() => setActiveTab('demand')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'demand' ? 'bg-primary/20 text-white' : 'text-text-muted hover:text-text-primary'}`}
              >
                Demand Heatmap
              </button>
              <button 
                onClick={() => setActiveTab('risk')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'risk' ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text-primary'}`}
              >
                Obsolescence Monitor
              </button>
              <button 
                onClick={() => setActiveTab('roi')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'roi' ? 'bg-success/20 text-success' : 'text-text-muted hover:text-text-primary'}`}
              >
                ROI Vectors
              </button>
            </div>

            <Card glass={false} className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'demand' && (
                  <motion.div 
                    key="demand"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Activity className="text-primary" /> Current Portfolio Demand
                    </h3>
                    <div className="space-y-5">
                      {marketData.demand.map((item, i) => (
                        <div key={i} className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg bg-background border border-border hover:border-text-muted transition-colors">
                          <div className="w-48 font-semibold text-lg">{item.skill}</div>
                          
                          <div className="flex-grow flex items-center gap-4">
                            <div className="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.score}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={`h-full ${item.score > 80 ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-primary'}`}
                              />
                            </div>
                            <div className="w-12 text-right font-mono font-bold">{item.score}</div>
                          </div>
                          
                          <div className="w-24 sm:w-auto">
                            {item.trend === 'growing' ? (
                              <Tag variant="success" label={`+${item.yoy_change}% YoY`} className="text-xs whitespace-nowrap" />
                            ) : item.trend === 'declining' ? (
                              <Tag variant="warning" label={`${item.yoy_change}% YoY`} className="text-xs whitespace-nowrap" />
                            ) : (
                              <Tag variant="default" label="Stable" className="text-xs whitespace-nowrap" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'risk' && (
                  <motion.div 
                    key="risk"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <ShieldAlert className="text-accent" /> Vulnerability Assessment
                    </h3>
                    
                    {marketData.risks && marketData.risks.length > 0 ? (
                      <div className="space-y-4">
                        {marketData.risks.map((risk, i) => (
                          <div key={i} className="p-5 bg-accent/5 border border-accent/20 rounded-lg flex items-start gap-4">
                            <AlertTriangle className="text-accent shrink-0 mt-1" />
                            <div>
                              <h4 className="text-lg font-bold text-white mb-1">{risk.skill}</h4>
                              <p className="text-text-secondary text-sm mb-4">{risk.decline}</p>
                              <div className="bg-background px-4 py-2 border border-border rounded inline-flex items-center gap-2 text-sm">
                                <span>Suggested Action:</span>
                                <span className="font-semibold text-primary">{risk.pivot_action}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-xl">
                        <ShieldCheck className="text-success w-16 h-16 mb-4 opacity-50" />
                        <h4 className="text-lg font-bold">No Immediate Obsolescence Risks</h4>
                        <p className="text-text-muted">Your current ontology vectors are aligned with stable or growing market demand segments.</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'roi' && (
                  <motion.div 
                    key="roi"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                       <TrendingUp className="text-success" /> Maximum Upside Targets
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {marketData.roi.map((roi, i) => (
                        <div key={i} className="p-5 border border-border bg-surface rounded-xl hover:border-success/50 transition-colors group relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="text-xl font-bold">{roi.skill?.name || roi.skill}</h4>
                              <div className="bg-success/20 text-success text-xs font-bold px-2 py-1 rounded">
                                {roi.roi_score} ROI
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-text-muted">Expected Salary Lift</span>
                                <span className="font-mono text-success">+{roi.expected_value ? `$${roi.expected_value}` : "$25,000"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-muted">Est. Effort</span>
                                <span className="text-text-secondary">{roi.learning_hours || 150} hrs</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Right Sidebar - Scores */}
          <div className="lg:col-span-4 space-y-6">
            <Card delay={0.2} className="relative overflow-hidden text-center flex flex-col items-center py-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 blur-[50px] rounded-full" />
              
              <ScoreRing 
                score={marketData.portfolio?.synthos_score || 0} 
                size={220} 
                strokeWidth={12} 
                label="Synthos Capital Score" 
              />
              
              <div className="mt-8 text-sm text-text-secondary max-w-xs mx-auto px-4">
                Proprietary metric combining market alignment, future readiness, and skill depth rarity.
              </div>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <Card delay={0.3} className="text-center p-4">
                <div className="text-3xl font-mono font-bold text-white mb-2">{marketData.portfolio?.market_alignment || 0}%</div>
                <div className="text-xs text-text-muted leading-tight">Market Alignment Vector</div>
              </Card>
              <Card delay={0.4} className="text-center p-4">
                <div className="text-3xl font-mono font-bold text-white mb-2">{marketData.portfolio?.future_readiness || 0}%</div>
                <div className="text-xs text-text-muted leading-tight">12Mo Future Readiness</div>
              </Card>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
