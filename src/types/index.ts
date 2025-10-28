// src/types/index.ts

// Kiểu dữ liệu cho một bài tập
export interface Workout {
  id: string;
  title: string;
  description: string;
  type: "Yoga" | "Thiền" | "Hít thở" | string; // Thêm string để linh hoạt với API
  durationMinutes: number;
  level: "Beginner" | "Intermediate" | "Advanced" | string;
  thumbnailUrl: string;
  videoUrl?: string; // Optional vì không phải bài nào cũng có video
  rating: number | string;
  reviewCount: number;
}

// Kiểu dữ liệu cho một danh mục
export interface Category {
  id: string;
  name: string;
  icon: string;
}

// Kiểu dữ liệu cho một lựa chọn tâm trạng
export type MoodValue = "awesome" | "good" | "neutral" | "bad" | "terrible";

// Kiểu dữ liệu cho document Mood trong Firestore
export interface Mood {
  id?: string; // Optional vì Firestore tự tạo
  userId: string;
  mood: MoodValue;
  createdAt: any; // Có thể là Timestamp của Firebase
}

// Kiểu dữ liệu cho User Profile trong store (dữ liệu từ Firestore)
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  onboarding: {
    completed: boolean;
    goal?: string;
    level?: string;
    dailyDuration?: number;
  };
  stats: {
    totalMinutes: number;
    totalSessions: number;
    currentStreak: number;
  };
}
