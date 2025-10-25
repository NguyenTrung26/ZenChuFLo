// src/services/firebase/firestore.ts
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { Goal, Level } from '../../store/onboardingStore';

// Lấy thông tin người dùng từ Firestore
export const getUserDocument = async (uid: string) => {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return userDocSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user document:", error);
    return null;
  }
};

// Cập nhật dữ liệu onboarding
export const updateUserOnboarding = async (
  uid: string,
  data: { goal: Goal; level: Level; dailyDuration: number }
) => {
  if (!uid) return { success: false, error: 'No user ID provided' };
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      onboarding: { // Gửi cả object onboarding
        completed: true,
        goal: data.goal,
        level: data.level,
        dailyDuration: data.dailyDuration,
      }
    }, { merge: true }); // Tùy chọn merge này là chìa khóa
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error updating onboarding data:", error);
    return { success: false, error: error.message };
  }
};