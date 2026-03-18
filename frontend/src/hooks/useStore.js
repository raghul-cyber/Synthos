import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // User Profile
      userId: null,
      email: '',
      setUserId: (id) => set({ userId: id }),
      setUserEmail: (email) => set({ email }),
      
      // Global App State
      currentStep: 1,
      setStep: (step) => set({ currentStep: Math.min(5, Math.max(1, step)) }),
      nextStep: () => set((state) => ({ currentStep: Math.min(5, state.currentStep + 1) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
      
      // Skills Journey
      userSkills: [],
      setUserSkills: (skills) => set({ userSkills: skills }),
      addSkill: (skill) => set((state) => {
        // Prevent duplicates
        if (state.userSkills.some(s => s.name === skill.name)) return state;
        return { userSkills: [...state.userSkills, skill] };
      }),
      removeSkill: (skillName) => set((state) => ({
        userSkills: state.userSkills.filter(s => s.name !== skillName)
      })),
      updateSkillProficiency: (skillName, proficiency) => set((state) => ({
        userSkills: state.userSkills.map(s => 
          s.name === skillName ? { ...s, proficiency } : s
        )
      })),
      
      // Reset
      reset: () => set({ 
        currentStep: 1, 
        userSkills: [], 
      }),
      
      // Feature Flags (for demo)
      isDemoMode: true,
    }),
    {
      name: 'synthos-storage',
      partialize: (state) => ({ 
        userId: state.userId,
        email: state.email,
        currentStep: state.currentStep,
        userSkills: state.userSkills 
      }),
    }
  )
);
