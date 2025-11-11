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
  orderBy,
  deleteDoc, // Thêm
} from "firebase/firestore";
import { db } from "./config";
import { Goal, Level } from "../../store/onboardingStore";
import { MoodValue } from "../../types";
export type Mood = "awesome" | "good" | "neutral" | "bad" | "terrible";
import { Workout } from "../../types";
// Hàm lấy chi tiết các bài tập dựa trên một mảng các ID
// src/services/firebase/firestore.ts

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
        ids // <-- SỬA LẠI: Dùng trực tiếp mảng ids
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
  const q = query(
    collection(db, "favorites"),
    where("userId", "==", uid),
    where("workoutId", "==", workoutId)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Thêm một bài tập vào danh sách yêu thích
export const addFavorite = async (uid: string, workoutId: string) => {
  await addDoc(collection(db, "favorites"), {
    userId: uid,
    workoutId: workoutId,
    addedAt: Timestamp.now(),
  });
};

// Xóa một bài tập khỏi danh sách yêu thích
export const removeFavorite = async (uid: string, workoutId: string) => {
  const q = query(
    collection(db, "favorites"),
    where("userId", "==", uid),
    where("workoutId", "==", workoutId)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (document) => {
    await deleteDoc(doc(db, "favorites", document.id));
  });
};

// Lấy danh sách ID các bài tập yêu thích
export const getFavoriteWorkoutIds = async (uid: string): Promise<string[]> => {
  const q = query(collection(db, "favorites"), where("userId", "==", uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data().workoutId);
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
