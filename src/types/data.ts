// src/types/data.ts
export interface Workout {
  id: string;
  title: string;
  description: string;
  type: 'Yoga' | 'Thiền' | 'Hít thở';
  durationMinutes: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnailUrl: string; // Sẽ dùng ảnh từ internet cho mock data
  videoUrl: string; 
  rating: number;
  reviewCount: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Emoji hoặc tên icon
}