// src/store/userStore.ts

import { create } from "zustand";
import { getUserDocument } from "../services/firebase/firestore";
// Chỉ còn lại MỘT nguồn cho UserProfile
import { UserProfile } from "../types";

// KHÔNG ĐỊNH NGHĨA LẠI UserProfile Ở ĐÂY NỮA

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  fetchProfile: (uid: string) => Promise<void>;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  // Bắt đầu với isLoading = true là đúng, vì khi app mở, chúng ta luôn phải fetch
  isLoading: true,
  fetchProfile: async (uid) => {
    // Không cần set isLoading ở đây nữa, vì AppRouter đã có màn hình chờ riêng
    // set({ isLoading: true });
    try {
      const userDoc = await getUserDocument(uid);
      if (userDoc) {
        // Ép kiểu userDoc thành UserProfile để đảm bảo type-safety
        set({ profile: userDoc as UserProfile, isLoading: false });
      } else {
        // Nếu không tìm thấy document, cũng kết thúc loading
        set({ profile: null, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      set({ profile: null, isLoading: false });
    }
  },
  clearProfile: () => set({ profile: null, isLoading: false }),
}));
