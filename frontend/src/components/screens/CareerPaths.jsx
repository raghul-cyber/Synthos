import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCareerPaths } from '../../hooks/useCareerPaths';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import Tag from '../ui/Tag';
import { Activity, Clock, Target, CheckCircle2, ChevronDown, Rocket, BookOpen } from 'lucide-react';

export default function CareerPaths() {
  const { paths, isLoading } = useCareerPaths();
  const [expandedId, setExpandedId] = useState(null);

  if (isLoading || !paths) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Activity className="w-12 h-12 text-primary animate-pulse mx-auto" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        
        <div className="text-center mb-16">
          <Tag variant="primary" label="Navigation Matrix Computed" className="mb-6 font-mono text-xs uppercase" />
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Execution Vectors</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            These trajectories offer the highest probabilistic return based on your current ontology context.
          </p>
        </div>

        <div className="space-y-8">
          {paths.map((path, index) => {
            const isExpanded = expandedId === path.id;
            
            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`transition-all duration-300 ${isExpanded ? 'scale-[1.02]' : ''}`}
              >
                <div 
                  className={`bg-surface border overflow-hidden transition-all duration-300 cursor-pointer ${
                    isExpanded 
                      ? 'border-primary shadow-[0_0_30px_rgba(108,99,255,0.15)] rounded-2xl' 
                      : 'border-border hover:border-text-muted rounded-xl hover:-translate-y-1'
                  }`}
                  onClick={() => setExpandedId(isExpanded ? null : path.id)}
                >
                  {/* Card Header & Summary */}
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                    
                    {/* Left: Score & Title */}
                    <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-border/50 pb-6 md:pb-0 md:pr-6">
                      <div className="flex justify-between items-start mb-2">
                        {path.badge && (
                          <div className={`text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded-sm border ${
                            path.badge_class === 'growth' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                            path.badge_class === 'safe' ? 'bg-success/10 text-success border-success/30' :
                            'bg-primary/10 text-primary border-primary/30'
                          }`}>
                            {path.badge}
                          </div>
                        )}
                        <span className="text-text-muted font-mono">{index + 1}</span>
                      </div>
                      
                      <h3 className="text-2xl lg:text-3xl font-display font-bold mb-4">{path.title}</h3>
                      
                      <div className="inline-block p-4 bg-background border border-border rounded-lg text-center w-full">
                        <div className="text-3xl font-mono font-bold text-white tracking-tight">
                          {path.transition_probability}%
                        </div>
                        <div className="text-[10px] text-text-muted uppercase tracking-wider mt-1">
                          Transition Probability
                        </div>
                      </div>
                    </div>
                    
                    {/* Middle: Metrics */}
                    <div className="md:w-1/3 flex flex-col justify-center space-y-4">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center shrink-0">
                          <Target size={14} className="text-primary"/>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">${path.salary_min/1000}k - ${path.salary_max/1000}k</div>
                          <div className="text-xs text-text-muted">Target Compensation</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center shrink-0">
                          <Clock size={14} className="text-secondary"/>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{path.time_months} Months</div>
                          <div className="text-xs text-text-muted">Est. Execution Time</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right: Gap Analysis */}
                    <div className="md:w-1/3 flex flex-col justify-center">
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span>Current Gap</span>
                        <span>{path.progress}% Match</span>
                      </div>
                      <ProgressBar 
                        progress={path.progress} 
                        height="h-3"
                        color={path.progress > 70 ? 'bg-success' : 'bg-primary'}
                      />
                      
                      <div className="mt-4 flex flex-wrap gap-1">
                        <div className="text-xs text-text-muted w-full mb-1">Missing Key Nodes:</div>
                        {path.skills_need.slice(0, 3).map(skill => (
                          <span key={skill} className="text-[10px] bg-background border border-border rounded px-1.5 py-0.5 text-text-secondary">
                            {skill}
                          </span>
                        ))}
                        {path.skills_need.length > 3 && (
                          <span className="text-[10px] text-text-muted ml-1 italic">+{path.skills_need.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Toggle Icon */}
                    <div className="hidden md:flex ml-2 h-10 w-10 text-text-muted shrink-0 items-center justify-center rounded-full bg-background border border-transparent group-hover:border-border transition-colors">
                      <ChevronDown size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
                    </div>
                  </div>
                  
                  {/* Expandable Details Area */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-border/50 bg-background/50 overflow-hidden"
                      >
                        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                          
                          {/* Execution Narrative */}
                          <div className="space-y-4">
                            <h4 className="flex items-center gap-2 font-bold text-lg mb-4 text-white">
                              <Sparkles size={16} className="text-primary" /> Synthos Analysis
                            </h4>
                            
                            {/* In a real app the text would be split by newlines into paragraphs */}
                            <div className="text-text-secondary text-sm leading-relaxed space-y-4">
                              <p>
                                Your existing proficiency in {path.skills_have.slice(0, 2).join(" and ")} provides a 
                                strong architectural foundation for {path.title}. The overlap between your current context 
                                and this target state reduces the typical acquisition friction by {path.progress}%.
                              </p>
                              <p className="border-l-2 border-primary pl-4 py-1 my-4">
                                The critical node missing from your ontology is <strong className="text-white">{path.skills_need[0]}</strong>. 
                                Achieving baseline competence here will exponentially unlock the remaining cluster dependencies.
                              </p>
                              <p>
                                Block 10 hours per week for execution. Begin by integrating {path.skills_need[0]} concepts 
                                into your current workflows before attempting decoupled side-projects.
                              </p>
                            </div>
                          </div>
                          
                          {/* Tactial Steps */}
                          <div>
                            <h4 className="flex items-center gap-2 font-bold text-lg mb-4 text-white">
                              <Rocket size={16} className="text-secondary" /> Acquisition Vectors
                            </h4>
                            
                            <div className="space-y-3">
                              {path.skills_need.slice(0, 4).map((skill, i) => (
                                <div key={skill} className="flex gap-4 p-3 bg-surface border border-border rounded-lg group hover:border-secondary/30 transition-colors">
                                  <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shrink-0 text-text-muted font-mono text-xs group-hover:text-secondary group-hover:border-secondary/50">
                                    0{i + 1}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-sm mb-1">{skill}</div>
                                    <div className="text-xs text-text-muted flex gap-3">
                                      <span className="flex items-center gap-1"><BookOpen size={10} /> 40 Hrs</span>
                                      <span className="text-primary hover:underline" onClick={e => e.stopPropagation()}>View Schema</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-6">
                              <Button variant="primary" className="w-full text-sm">
                                Initialize Learning Sequence
                              </Button>
                            </div>
                          </div>
                          
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
