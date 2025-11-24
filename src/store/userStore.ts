// src/store/userStore.ts

import { create } from "zustand";
import { getUserDocument, createUserDocument } from "../services/firebase/firestore";
import { auth, db } from "../services/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
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
    try {
      let userDoc = await getUserDocument(uid);

      // Auto-sync: Nếu không tìm thấy trong Firestore nhưng có trong Auth
      if (!userDoc && auth.currentUser && auth.currentUser.uid === uid) {
        console.log("Profile missing in Firestore, syncing from Auth...");
        await createUserDocument(auth.currentUser);
        userDoc = await getUserDocument(uid);
      }

      // Email sync: Nếu email bị thiếu trong Firestore nhưng có trong Auth
      if (userDoc && !userDoc.email && auth.currentUser?.email) {
        console.log("Email missing in Firestore, updating from Auth...");
        await updateDoc(doc(db, "users", uid), { email: auth.currentUser.email });
        userDoc.email = auth.currentUser.email;
      }

      if (userDoc) {
        set({ profile: userDoc as UserProfile, isLoading: false });
      } else {
        set({ profile: null, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      set({ profile: null, isLoading: false });
    }
  },
  clearProfile: () => set({ profile: null, isLoading: false }),
}));
