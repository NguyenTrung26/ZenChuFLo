// src/services/firebase/firestore.ts
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection, // Thêm import
  addDoc, // Thêm import
  Timestamp, // Thêm import
  increment, // Thêm import
  query, // Thêm
  where, // Thêm
  getDocs, // Thêm
  orderBy, // Thêm
} from "firebase/firestore";
import { db } from "./config";
import { Goal, Level } from "../../store/onboardingStore";

// --- HÀM MỚI ---
export const updateUserProfile = async (
  uid: string,
  data: { displayName?: string; photoURL?: string }
) => {
  if (!uid) return { success: false, error: "No user ID provided" };
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, data); // data có thể là { displayName: 'New Name' } hoặc { photoURL: 'new.url' }
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return { success: false, error: error.message };
  }
};

// --- HÀM MỚI ---
// Lấy các phiên tập của người dùng trong 7 ngày qua
export const getUserSessionsLast7Days = async (uid: string) => {
  if (!uid) return [];
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));

    const sessionsCollectionRef = collection(db, "sessions");
    const q = query(
      sessionsCollectionRef,
      where("userId", "==", uid),
      where("completedAt", ">=", sevenDaysAgo),
      orderBy("completedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return sessions;
  } catch (error) {
    console.error("Error getting user sessions:", error);
    return [];
  }
};

// --- HÀM MỚI: TẠO MỘT BẢN GHI PHIÊN TẬP ---
export const createSession = async (uid: string, workout: any) => {
  if (!uid) return { success: false, error: "No user ID provided" };
  try {
    const sessionsCollectionRef = collection(db, "sessions");
    await addDoc(sessionsCollectionRef, {
      userId: uid,
      workoutId: workout.id,
      workoutTitle: workout.title,
      durationMinutes: workout.durationMinutes,
      completedAt: Timestamp.now(),
      type: workout.type.toLowerCase(), // 'yoga', 'thiền', v.v.
    });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error creating session:", error);
    return { success: false, error: error.message };
  }
};

// --- HÀM MỚI: CẬP NHẬT CHỈ SỐ THỐNG KÊ CỦA NGƯỜI DÙNG ---
export const updateUserStats = async (uid: string, durationMinutes: number) => {
  if (!uid) return { success: false, error: "No user ID provided" };
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      "stats.totalMinutes": increment(durationMinutes), // Tăng tổng số phút
      "stats.totalSessions": increment(1), // Tăng tổng số buổi tập
      // Logic cập nhật chuỗi (streak) sẽ phức tạp hơn và có thể thêm sau
    });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error updating user stats:", error);
    return { success: false, error: error.message };
  }
};
// Lấy thông tin người dùng từ Firestore
export const getUserDocument = async (uid: string) => {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, "users", uid);
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
  if (!uid) return { success: false, error: "No user ID provided" };
  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(
      userDocRef,
      {
        onboarding: {
          // Gửi cả object onboarding
          completed: true,
          goal: data.goal,
          level: data.level,
          dailyDuration: data.dailyDuration,
        },
      },
      { merge: true }
    ); // Tùy chọn merge này là chìa khóa
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error updating onboarding data:", error);
    return { success: false, error: error.message };
  }
};
