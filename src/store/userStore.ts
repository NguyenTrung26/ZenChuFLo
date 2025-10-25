// src/store/userStore.ts
import { create } from 'zustand';
import { getUserDocument } from '../services/firebase/firestore';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  onboarding: {
    completed: boolean;
  };
  // Thêm các trường khác từ Firestore vào đây khi cần
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  fetchProfile: (uid: string) => Promise<void>;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: true,
  fetchProfile: async (uid) => {
    set({ isLoading: true });
    try {
      const userDoc = await getUserDocument(uid);
      if (userDoc) {
        set({ profile: userDoc as UserProfile, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      set({ isLoading: false });
    }
  },
  clearProfile: () => set({ profile: null }),
}));