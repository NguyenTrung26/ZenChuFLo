// src/types/index.ts
import { ImageSourcePropType } from "react-native";
// Kiểu dữ liệu cho một bài tập
export interface Workout {
  id: string;
  title: string;
  description: string;
  type: "Yoga" | "Thiền" | "Hít thở" | string; // Thêm string để linh hoạt với API
  durationMinutes: number;
  level: "Beginner" | "Intermediate" | "Advanced" | string;
  thumbnailUrl: ImageSourcePropType;
  videoUrl?: string;
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
  avatar?: string; // Thêm avatar để đồng bộ với code sử dụng
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
  healthProfile?: HealthProfile; // Optional health profile for AI recommendations
}

// Health Profile for AI recommendations
export interface HealthProfile {
  weight?: number; // kg
  height?: number; // cm
  age?: number;
  gender?: "male" | "female" | "other";
  eatingHabits?: "healthy" | "normal" | "unhealthy";
  activityLevel?: "sedentary" | "light" | "moderate" | "active";
  goal?: "weight_loss" | "muscle_gain" | "flexibility" | "relaxation";
  updatedAt?: any; // Timestamp
}
