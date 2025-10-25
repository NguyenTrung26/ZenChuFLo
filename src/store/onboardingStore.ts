// src/store/onboardingStore.ts
import { create } from 'zustand';

export type Goal = 'stress' | 'health' | 'sleep' | 'flexibility';
export type Level = 'beginner' | 'intermediate' | 'advanced';

interface OnboardingState {
  goal: Goal | null;
  level: Level | null;
  dailyDuration: number;
  setGoal: (goal: Goal) => void;
  setLevel: (level: Level) => void;
  setDailyDuration: (duration: number) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  goal: null,
  level: null,
  dailyDuration: 15, // Giá trị mặc định
  setGoal: (goal) => set({ goal }),
  setLevel: (level) => set({ level }),
  setDailyDuration: (duration) => set({ dailyDuration: duration }),
  reset: () => set({ goal: null, level: null, dailyDuration: 15 }),
}));