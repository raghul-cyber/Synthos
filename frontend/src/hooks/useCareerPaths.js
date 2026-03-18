import { useState, useEffect } from 'react';
import { getCareerPaths } from '../services/api';
import { useStore } from './useStore';

export function useCareerPaths() {
  const [paths, setPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userId, userSkills } = useStore();

  useEffect(() => {
    let isMounted = true;

    async function loadPaths() {
      if (userSkills.length === 0) return;
      
      setIsLoading(true);
      try {
        if (userId) {
          const data = await getCareerPaths(userId);
          if (isMounted) {
            setPaths(data);
            setError(null);
          }
          return;
        }
        throw new Error("No user ID, using fallback");
      } catch (err) {
        if (isMounted) {
          console.error("Path API failed", err);
          generateFallbackPaths();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    function generateFallbackPaths() {
      // Extract names to simulate overlap
      const ownedNames = userSkills.map(s => s.name);
      const isDataHeavy = ownedNames.some(n => ["Python", "SQL", "Data Analysis", "Machine Learning"].includes(n));
      const isFrontendHeavy = ownedNames.some(n => ["JavaScript", "React", "TypeScript", "HTML"].includes(n));
      
      let fallbackPaths = [];
      
      if (isDataHeavy) {
        fallbackPaths = [
          {
            id: "1", title: "ML Engineer", salary_min: 145000, salary_max: 185000,
            transition_probability: 78, time_months: 6, progress: 61,
            roi: 340, badge: 'Recommended', badge_class: '',
            skills_have: ownedNames.filter(n => ["Python", "SQL", "Statistics", "Data Analysis"].includes(n)),
            skills_need: ["Machine Learning", "TensorFlow", "MLOps", "PyTorch"]
          },
          {
            id: "2", title: "Data Engineer", salary_min: 130000, salary_max: 165000,
            transition_probability: 85, time_months: 4, progress: 55,
            roi: 280, badge: 'High Growth', badge_class: 'growth',
            skills_have: ownedNames.filter(n => ["Python", "SQL"].includes(n)),
            skills_need: ["Apache Spark", "dbt", "AWS", "Airflow"]
          },
          {
            id: "3", title: "Product Analytics Lead", salary_min: 115000, salary_max: 145000,
            transition_probability: 91, time_months: 2, progress: 72,
            roi: 210, badge: 'Safe Pivot', badge_class: 'safe',
            skills_have: ownedNames.filter(n => ["SQL", "Data Analysis", "Communication"].includes(n)),
            skills_need: ["Product Metrics", "A/B Testing", "Strategy"]
          }
        ];
      } else if (isFrontendHeavy) {
        fallbackPaths = [
          {
            id: "1", title: "Full-Stack Engineer", salary_min: 120000, salary_max: 160000,
            transition_probability: 75, time_months: 5, progress: 60,
            roi: 240, badge: 'Recommended', badge_class: '',
            skills_have: ownedNames.filter(n => ["JavaScript", "React", "TypeScript"].includes(n)),
            skills_need: ["Node.js", "SQL", "REST APIs", "Docker"]
          },
          {
            id: "2", title: "UX Engineer", salary_min: 110000, salary_max: 145000,
            transition_probability: 88, time_months: 3, progress: 70,
            roi: 180, badge: 'Safe Pivot', badge_class: 'safe',
            skills_have: ownedNames.filter(n => ["JavaScript", "React", "UX Design"].includes(n)),
            skills_need: ["Figma", "User Research", "A/B Testing"]
          },
          {
            id: "3", title: "Frontend Platform Engineer", salary_min: 135000, salary_max: 175000,
            transition_probability: 65, time_months: 8, progress: 45,
            roi: 310, badge: 'High Growth', badge_class: 'growth',
            skills_have: [...ownedNames.filter(n => ["JavaScript", "TypeScript"].includes(n))],
            skills_need: ["CI/CD", "Testing", "WebPack/Vite Configs", "Performance Optimization"]
          }
        ];
      } else {
        // Generic defaults
        fallbackPaths = [
          {
            id: "1", title: "Technical Product Manager", salary_min: 130000, salary_max: 170000,
            transition_probability: 60, time_months: 6, progress: 50,
            roi: 250, badge: 'High Growth', badge_class: 'growth',
            skills_have: [...ownedNames.slice(0, 2)],
            skills_need: ["Product Strategy", "Agile", "User Research", "A/B Testing"]
          },
          {
            id: "2", title: "Cloud Architect", salary_min: 155000, salary_max: 200000,
            transition_probability: 45, time_months: 12, progress: 30,
            roi: 420, badge: 'Recommended', badge_class: '',
            skills_have: [...ownedNames.slice(0, 1)],
            skills_need: ["AWS", "Docker", "Kubernetes", "Terraform", "Security"]
          },
          {
            id: "3", title: "Engineering Manager", salary_min: 160000, salary_max: 210000,
            transition_probability: 70, time_months: 8, progress: 65,
            roi: 190, badge: 'Safe Pivot', badge_class: 'safe',
            skills_have: [...ownedNames.slice(0, 3)],
            skills_need: ["Leadership", "Agile", "System Design", "Recruiting"]
          }
        ];
      }
      
      // Ensure skills_have doesn't include "undefined" missing names
      fallbackPaths.forEach(p => {
        p.skills_have = p.skills_have.filter(Boolean);
        if (p.skills_have.length === 0) p.skills_have = [ownedNames[0] || "Foundational Skills"];
      });
      
      setPaths(fallbackPaths);
    }

    loadPaths();
    return () => { isMounted = false; };
  }, [userId, userSkills]);

  return { paths, isLoading, error };
}
