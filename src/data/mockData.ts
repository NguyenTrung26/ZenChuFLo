import { Workout, Category } from "../types";

// Bạn cần có sẵn các ảnh này trong assets/images/poses
const defaultPose1 = require("../../assets/poses/bing_images/bridge_yoga_pose/Warrior_II.jpg");
const defaultPose2 = require("../../assets/poses/bing_images/bridge_yoga_pose/Yogic_Squat.jpg");

export const workouts: Workout[] = [
  {
    id: "w1",
    title: "Morning Yoga Flow (Mock)",
    description:
      "Bài tập yoga buổi sáng giúp đánh thức cơ thể, tăng năng lượng...",
    type: "Yoga",
    durationMinutes: 10,
    level: "Beginner",
    // --- SỬA LỖI Ở ĐÂY ---
    thumbnailUrl: defaultPose1, // Sử dụng require()
    rating: 4.8,
    reviewCount: 1200,
    videoUrl:
      "https://videos.pexels.com/video-files/4754028/475402-hd_1280_720_25fps.mp4",
  },
  {
    id: "w2",
    title: "Thiền Định 5 Phút (Mock)",
    description: "Tìm lại sự bình yên và tập trung chỉ trong 5 phút.",
    type: "Thiền",
    durationMinutes: 5,
    level: "Beginner",
    // --- SỬA LỖI Ở ĐÂY ---
    thumbnailUrl: defaultPose2, // Sử dụng require()
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
