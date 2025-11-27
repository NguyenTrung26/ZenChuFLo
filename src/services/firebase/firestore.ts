// src/services/firebase/firestore.ts
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  Timestamp,
  increment,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  deleteField
} from "firebase/firestore";
import { db } from "./config";
import { Goal, Level } from "../../store/onboardingStore";
import { MoodValue } from "../../types";
export type Mood = "awesome" | "good" | "neutral" | "bad" | "terrible";
import { Workout } from "../../types";

// Hàm lấy chi tiết các bài tập dựa trên một mảng các ID
export const getWorkoutsByIds = async (ids: string[]): Promise<Workout[]> => {
  if (ids.length === 0) {
    return [];
  }
  try {
    const workoutsCollectionRef = collection(db, "workouts");
    const q = query(
      workoutsCollectionRef,
      where(
        "__name__",
        "in",
        ids
      )
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Workout[];
  } catch (error) {
    console.error("Error getting workouts by IDs:", error);
    return [];
  }
};

// --- HÀM MỚI: THÊM BÀI TẬP VÀO COLLECTION 'workouts' NẾU CHƯA TỒN TẠI ---
export const addWorkoutIfNotExists = async (workout: Workout) => {
  try {
    // Chúng ta sử dụng ID từ workout (ví dụ: 'api-45') làm ID cho document
    const workoutDocRef = doc(db, "workouts", workout.id);
    const docSnap = await getDoc(workoutDocRef);

    // Nếu document chưa tồn tại, hãy tạo nó
    if (!docSnap.exists()) {
      await setDoc(workoutDocRef, workout);
      console.log(`Workout ${workout.id} added to Firestore.`);
    }
  } catch (error) {
    console.error("Error ensuring workout exists in Firestore:", error);
  }
};

// --- HÀM MỚI ---
export const createUserMood = async (
  uid: string,
  mood: MoodValue,
  notes?: string | null
) => {
  if (!uid) return { success: false, error: "No user ID provided" };
  try {
    const moodsCollectionRef = collection(db, "moods");
    await addDoc(moodsCollectionRef, {
      userId: uid,
      mood: mood,
      createdAt: Timestamp.now(),
      notes: notes,
    });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error creating user mood:", error);
    return { success: false, error: error.message };
  }
};

// --- HÀM MỚI ---
export const updateHealthProfile = async (
  uid: string,
  healthData: any
) => {
  if (!uid) return { success: false, error: "No user ID provided" };
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      healthProfile: {
        ...healthData,
        updatedAt: Timestamp.now(),
      },
    });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error updating health profile:", error);
    return { success: false, error: error.message };
  }
};

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
export const createSession = async (
  uid: string,
  workout: any,
  notes: string | null
) => {
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
      notes: notes,
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

// Tạo document người dùng mới (dùng cho sync hoặc sign up)
export const createUserDocument = async (user: any) => {
  if (!user) return;
  try {
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Người dùng",
      photoURL: user.photoURL || null,
      createdAt: Timestamp.now(),
      onboarding: {
        completed: false,
      },
      stats: {
        totalMinutes: 0,
        totalSessions: 0,
        currentStreak: 0,
        longestStreak: 0,
      },
    });
    console.log("User document created for:", user.uid);
  } catch (error) {
    console.error("Error creating user document:", error);
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

// --- CÁC HÀM MỚI CHO TÍNH NĂNG YÊU THÍCH ---

// Kiểm tra xem một bài tập có được yêu thích hay không
export const isWorkoutFavorited = async (
  uid: string,
  workoutId: string
): Promise<boolean> => {
  const docRef = doc(db, "users", uid, "favorites", workoutId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

// Thêm một bài tập vào danh sách yêu thích (Lưu toàn bộ object)
export const addFavorite = async (uid: string, workout: Workout) => {
  const docRef = doc(db, "users", uid, "favorites", workout.id);
  await setDoc(docRef, {
    ...workout,
    addedAt: Timestamp.now(),
  });
};

// Xóa một bài tập khỏi danh sách yêu thích
export const removeFavorite = async (uid: string, workoutId: string) => {
  const docRef = doc(db, "users", uid, "favorites", workoutId);
  await deleteDoc(docRef);
};

// Lấy danh sách bài tập yêu thích (Trả về full Workout objects)
export const getFavoriteWorkouts = async (uid: string): Promise<Workout[]> => {
  const favoritesRef = collection(db, "users", uid, "favorites");
  const q = query(favoritesRef, orderBy("addedAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    // Loại bỏ trường addedAt trước khi trả về nếu cần, hoặc giữ lại
    const { addedAt, ...workoutData } = data;
    return { id: doc.id, ...workoutData } as Workout;
  });
};

// --- WORKOUT COMPLETION TRACKING ---

/**
 * Mark a workout as completed
 */
export const markWorkoutComplete = async (
  uid: string,
  workoutId: string,
  day?: number,
  planId?: string
) => {
  if (!uid) return { success: false, error: "No user ID provided" };

  try {
    const completionRef = collection(db, "users", uid, "completedWorkouts");
    await addDoc(completionRef, {
      workoutId,
      day: day || null,
      planId: planId || null,
      completedAt: Timestamp.now(),
    });

    // Update user stats
    await updateUserStats(uid, 0); // Duration will be tracked separately

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error marking workout complete:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if a workout is completed
 */
export const isWorkoutCompleted = async (
  uid: string,
  workoutId: string,
  day?: number
): Promise<boolean> => {
  if (!uid) return false;

  try {
    const completionRef = collection(db, "users", uid, "completedWorkouts");
    let q = query(completionRef, where("workoutId", "==", workoutId));

    if (day !== undefined) {
      q = query(q, where("day", "==", day));
    }

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking workout completion:", error);
    return false;
  }
};

/**
 * Get all completed workouts for a user
 */
export const getCompletedWorkouts = async (uid: string, planId?: string) => {
  if (!uid) return [];

  try {
    const completionRef = collection(db, "users", uid, "completedWorkouts");
    let q = query(completionRef, orderBy("completedAt", "desc"));

    if (planId) {
      q = query(completionRef, where("planId", "==", planId), orderBy("completedAt", "desc"));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting completed workouts:", error);
    return [];
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async (uid: string) => {
  if (!uid) return null;

  try {
    const userDoc = await getUserDocument(uid);
    return userDoc?.stats || {
      totalMinutes: 0,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return null;
  }
};

/**
 * Calculate and update streak
 */
export const calculateStreak = async (uid: string) => {
  if (!uid) return { currentStreak: 0, longestStreak: 0 };

  try {
    const sessionsRef = collection(db, "sessions");
    const q = query(
      sessionsRef,
      where("userId", "==", uid),
      orderBy("completedAt", "desc")
    );

    const snapshot = await getDocs(q);
    const sessions = snapshot.docs.map(doc => doc.data());

    if (sessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    sessions.forEach((session: any) => {
      const sessionDate = session.completedAt.toDate();
      const sessionDay = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());

      if (!lastDate) {
        // First session
        const today = new Date();
        const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const diffDays = Math.floor((todayDay.getTime() - sessionDay.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) {
          currentStreak = 1;
          tempStreak = 1;
        }
        lastDate = sessionDay;
      } else {
        const diffDays = Math.floor((lastDate.getTime() - sessionDay.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day
          if (currentStreak > 0) currentStreak++;
          tempStreak++;
        } else if (diffDays > 1) {
          // Streak broken
          currentStreak = 0;
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
        // diffDays === 0 means same day, don't increment

        lastDate = sessionDay;
      }
    });

    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    // Update in Firestore
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      "stats.currentStreak": currentStreak,
      "stats.longestStreak": longestStreak,
    });

    return { currentStreak, longestStreak };
  } catch (error) {
    console.error("Error calculating streak:", error);
    return { currentStreak: 0, longestStreak: 0 };
  }
};

/**
 * Get weekly sessions for charts
 */
export const getWeeklySessions = async (uid: string) => {
  if (!uid) return [];

  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const sessionsRef = collection(db, "sessions");
    const q = query(
      sessionsRef,
      where("userId", "==", uid),
      where("completedAt", ">=", Timestamp.fromDate(sevenDaysAgo)),
      orderBy("completedAt", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting weekly sessions:", error);
    return [];
  }
};


// Deprecated: Giữ lại để tương thích ngược tạm thời hoặc xóa nếu không dùng
export const getFavoriteWorkoutIds = async (uid: string): Promise<string[]> => {
  const workouts = await getFavoriteWorkouts(uid);
  return workouts.map(w => w.id);
};

// Kiểu dữ liệu cho session và mood
type SessionEntry = {
  type: "session";
  completedAt: Timestamp;
  workoutTitle?: string;
  notes?: string;
};

type MoodEntry = {
  type: "mood";
  createdAt: Timestamp;
  notes?: string;
};
export type JournalEntry = SessionEntry | MoodEntry;

export const getUserJournalEntries = async (
  uid: string
): Promise<JournalEntry[]> => {
  if (!uid) return [];

  try {
    // Lấy sessions có ghi chú
    const sessionsQuery = query(
      collection(db, "sessions"),
      where("userId", "==", uid),
      where("notes", "!=", null),
      orderBy("completedAt", "desc")
    );

    // Lấy moods có ghi chú
    const moodsQuery = query(
      collection(db, "moods"),
      where("userId", "==", uid),
      where("notes", "!=", null),
      orderBy("createdAt", "desc")
    );

    const [sessionsSnapshot, moodsSnapshot] = await Promise.all([
      getDocs(sessionsQuery),
      getDocs(moodsQuery),
    ]);

    // Map về kiểu SessionEntry
    const sessions: SessionEntry[] = sessionsSnapshot.docs.map((doc) => ({
      type: "session",
      ...(doc.data() as Omit<SessionEntry, "type">),
    }));

    // Map về kiểu MoodEntry
    const moods: MoodEntry[] = moodsSnapshot.docs.map((doc) => ({
      type: "mood",
      ...(doc.data() as Omit<MoodEntry, "type">),
    }));

    // Gộp lại và sắp xếp theo ngày giảm dần
    const allEntries: JournalEntry[] = [...sessions, ...moods].sort((a, b) => {
      const dateA =
        a.type === "session" ? a.completedAt.toDate() : a.createdAt.toDate();
      const dateB =
        b.type === "session" ? b.completedAt.toDate() : b.createdAt.toDate();
      return dateB.getTime() - dateA.getTime();
    });

    return allEntries;
  } catch (error) {
    console.error("Error getting journal entries:", error);
    return [];
  }
};

// --- WORKOUT PLAN MANAGEMENT ---

/**
 * Save AI-generated workout plan to Firestore
 */
export const saveWorkoutPlan = async (
  uid: string,
  planData: {
    recommendation: any;
    healthProfile: any;
  }
) => {
  if (!uid) {
    console.error("❌ saveWorkoutPlan: No user ID provided");
    return { success: false, error: "No user ID provided" };
  }

  // Helper to convert undefined to null (Firestore doesn't support undefined)
  const sanitizeData = (data: any): any => {
    if (data === undefined) return null;
    if (data === null) return null;
    if (Array.isArray(data)) return data.map(sanitizeData);
    if (typeof data === 'object') {
      const sanitized: any = {};
      for (const key in data) {
        sanitized[key] = sanitizeData(data[key]);
      }
      return sanitized;
    }
    return data;
  };

  try {
    console.log("💾 Saving workout plan for user:", uid);
    const sanitizedPlanData = sanitizeData(planData);
    console.log("📊 Plan data (sanitized):", JSON.stringify(sanitizedPlanData, null, 2));

    // Save directly to user document to avoid permission issues with sub-collections
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      workoutPlan: {
        ...sanitizedPlanData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }
    });

    console.log("✅ Workout plan saved successfully to user profile!");
    return { success: true, error: null };
  } catch (error: any) {
    console.error("❌ Error saving workout plan:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user's saved workout plan
 */
export const getWorkoutPlan = async (uid: string) => {
  if (!uid) {
    console.error("❌ getWorkoutPlan: No user ID provided");
    return null;
  }

  try {
    console.log("📖 Loading workout plan for user:", uid);
    // Read from user document
    const userDocRef = doc(db, "users", uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData.workoutPlan) {
        console.log("✅ Workout plan loaded successfully from user profile!");
        console.log("📊 Plan data:", JSON.stringify(userData.workoutPlan, null, 2));
        return userData.workoutPlan;
      }
    }

    console.log("⚠️ No workout plan found in user profile");
    return null;
  } catch (error) {
    console.error("❌ Error getting workout plan:", error);
    return null;
  }
};

/**
 * Delete user's saved workout plan
 */
export const deleteWorkoutPlan = async (uid: string) => {
  if (!uid) return { success: false, error: "No user ID provided" };

  try {
    const userDocRef = doc(db, "users", uid);
    // Remove the workoutPlan field
    await updateDoc(userDocRef, {
      workoutPlan: deleteField()
    });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error deleting workout plan:", error);
    return { success: false, error: error.message };
  }
};
