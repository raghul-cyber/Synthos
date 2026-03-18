import { useState, useEffect } from 'react';
import { buildKnowledgeGraph } from '../services/api';
import { useStore } from './useStore';

export function useSkillGraph() {
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userSkills, userId } = useStore();

  useEffect(() => {
    let isMounted = true;
    
    async function loadGraphData() {
      // For demo mode or if no backend, we might simulate this
      // But we will try the API first
      if (userSkills.length === 0) return;
      
      setIsLoading(true);
      try {
        // Need IDs for actual API, but for demo we might just send names
        // If we don't have real IDs yet (running purely frontend), we'll mock it
        
        // Mock fallback check (we assume backend is running in production)
        const skillIds = userSkills.map(s => s.id || s.name);
        
        const data = await buildKnowledgeGraph(skillIds);
        if (isMounted) {
          setGraphData(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load graph data, using fallback", err);
          setError(err.message);
          // Fallback logic for demo without backend
          generateFallbackGraph();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    function generateFallbackGraph() {
      // Simulate backend response based on user skills
      const nodes = userSkills.map(s => ({
        id: s.name,
        name: s.name,
        owned: true,
        demand: Math.floor(Math.random() * 20) + 70, // Random 70-90
        category: s.category || "General",
        trend: "growing",
        radius: 24,
        hot: Math.random() > 0.6
      }));
      
      // Add some adjacent skills
      const categories = [...new Set(userSkills.map(s => s.category).filter(Boolean))];
      
      const adjacents = [
        { id: "adjacent-1", name: "Data Engineering", owned: false, demand: 88, category: "Data & AI", radius: 18, hot: true },
        { id: "adjacent-2", name: "MLOps", owned: false, demand: 85, category: "Data & AI", radius: 18, hot: true },
        { id: "adjacent-3", name: "AWS", owned: false, demand: 92, category: "Cloud & DevOps", radius: 18, hot: true },
        { id: "adjacent-4", name: "System Design", owned: false, demand: 80, category: "Architecture", radius: 18, hot: false },
      ];
      
      const allNodes = [...nodes, ...adjacents];
      
      const edges = [];
      userSkills.forEach((s) => {
        adjacents.forEach(a => {
          if (Math.random() > 0.5) {
            edges.push({
              source: s.name,
              target: a.id,
              strength: Math.random(),
              strong: Math.random() > 0.7
            });
          }
        });
      });
      
      // Link owned skills together
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          edges.push({
            source: nodes[i].id,
            target: nodes[j].id,
            strength: 0.8,
            strong: true
          });
        }
      }
      
      setGraphData({ nodes: allNodes, edges });
    }

    loadGraphData();
    
    return () => {
      isMounted = false;
    };
  }, [userSkills, userId]);

  return { graphData, isLoading, error };
}
