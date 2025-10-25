import { Workout, Category } from "../types/data";

export const workouts: Workout[] = [
  {
    id: "w1",
    title: "Morning Yoga Flow",
    description:
      "Bài tập yoga buổi sáng giúp đánh thức cơ thể, tăng năng lượng...",
    type: "Yoga",
    durationMinutes: 10,
    level: "Beginner",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop",
    videoUrl: "https://www.pexels.com/download/video/3327808/",
    rating: 4.8,
    reviewCount: 1200,
  },
  {
    id: "w2",
    title: "Thiền Định 5 Phút",
    description: "Tìm lại sự bình yên và tập trung chỉ trong 5 phút.",
    type: "Thiền",
    durationMinutes: 5,
    level: "Beginner",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1506126613408-4e05960274e5?q=80&w=2070&auto=format&fit=crop",
    videoUrl:
      "https://videos.pexels.com/video-files/856162/856162-hd_1280_720_25fps.mp4", // ví dụ thêm
    rating: 4.9,
    reviewCount: 2500,
  },
];

export const categories: Category[] = [
  { id: "c1", name: "Yoga Buổi Sáng", icon: "☀️" },
  { id: "c2", name: "Thiền 5 phút", icon: "🧘" },
  { id: "c3", name: "Hít thở sâu", icon: "🌬️" },
  { id: "c4", name: "Giãn cơ", icon: "🤸" },
  { id: "c5", name: "Giúp ngủ ngon", icon: "😴" },
];
