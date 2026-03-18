import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../hooks/useStore';
import { SKILL_ONTOLOGY } from '../../data/skillOntology';
import Card from '../ui/Card';
import Tag from '../ui/Tag';
import Button from '../ui/Button';
import { Search, Plus, ArrowRight, Layers } from 'lucide-react';

export default function SkillCapture() {
  const { userSkills, addSkill, removeSkill, nextStep } = useStore();
  const [query, setQuery] = useState('');
  
  // Flatten ontology for search
  const allSkills = Object.values(SKILL_ONTOLOGY).flat();
  
  const searchResults = query.length > 0
    ? allSkills.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) && 
        !userSkills.some(us => us.name === s.name)
      ).slice(0, 8)
    : [];

  const handleAddSkill = (skill) => {
    addSkill({
      ...skill,
      category: Object.keys(SKILL_ONTOLOGY).find(k => 
        SKILL_ONTOLOGY[k].some(s => s.name === skill.name)
      ) || "General"
    });
    setQuery('');
  };

  const categories = Object.keys(SKILL_ONTOLOGY);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold mb-4">Skill Inventory Matrix</h2>
          <p className="text-text-secondary text-lg">
            Construct your baseline ontology. Add all technical and soft skills you possess.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Search & Add */}
          <div className="space-y-6">
            <Card className="relative z-20">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a skill (e.g. Python, Agile)..."
                  className="w-full bg-surface border border-border rounded-xl py-4 pl-12 pr-4 text-text-primary focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {query.length > 0 && (
                <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
                  <AnimatePresence>
                    {searchResults.length > 0 ? searchResults.map(skill => (
                      <motion.button
                        key={skill.name}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        onClick={() => handleAddSkill(skill)}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface border border-transparent hover:border-border flex items-center justify-between group transition-all"
                      >
                        <div>
                          <span className="font-medium block">{skill.name}</span>
                          <span className="text-xs text-text-muted">Demand Score: {skill.demand}/100</span>
                        </div>
                        <Plus size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    )) : (
                      <div className="text-center py-4 text-text-muted">No matching skills found in ontology.</div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="space-y-6">
                {categories.slice(0, 3).map(category => {
                  // Suggest 3 popular skills per category
                  const suggestions = SKILL_ONTOLOGY[category]
                    .filter(s => !userSkills.some(us => us.name === s.name))
                    .slice(0, 3);
                    
                  if (suggestions.length === 0) return null;

                  return (
                    <div key={category}>
                      <div className="text-xs font-semibold uppercase text-text-muted tracking-wider mb-3">
                        Suggested {category}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map(skill => (
                          <button
                            key={skill.name}
                            onClick={() => handleAddSkill(skill)}
                            className="px-3 py-1.5 rounded-full border border-border bg-background hover:border-primary/50 text-sm transition-colors flex items-center gap-1"
                          >
                            <Plus size={14} className="text-text-muted" />
                            {skill.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right Column: Built Ontology */}
          <div className="flex flex-col h-full">
            <Card className="flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Layers className="text-primary" size={20} />
                  <h3 className="font-semibold text-lg">Your Ontology</h3>
                </div>
                <div className="text-sm font-mono bg-surface px-2 py-1 rounded">
                  {userSkills.length} Nodes
                </div>
              </div>

              <div className="flex-grow overflow-y-auto min-h-[300px] content-start">
                <AnimatePresence>
                  {userSkills.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="h-full flex flex-col items-center justify-center text-text-muted text-center p-6 space-y-4"
                    >
                      <Database size={48} className="opacity-20" />
                      <p>Your inventory is empty.<br/>Add at least 3 skills to initialize connection mapping.</p>
                    </motion.div>
                  ) : (
                    <div className="flex flex-wrap gap-3 p-1">
                      {userSkills.map((skill, i) => (
                        <Tag 
                          key={skill.name}
                          label={skill.name}
                          variant="primary"
                          onRemove={() => removeSkill(skill.name)}
                          icon="check"
                        />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50 flex justify-end">
                <Button 
                  onClick={nextStep} 
                  disabled={userSkills.length < 3}
                  variant="primary"
                >
                  Generate Graph <ArrowRight size={18} />
                </Button>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
