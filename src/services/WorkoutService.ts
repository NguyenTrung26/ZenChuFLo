// src/services/WorkoutService.ts

import { Workout } from "../types";
import yogaPoses from "../data/yoga-poses.json";

// --- TẠO MAP ÁNH XẠ ĐẾN ẢNH CỤC BỘ ---
// 'ImageSourcePropType' là kiểu dữ liệu cho prop 'source' của component Image
import { ImageSourcePropType } from "react-native";

const poseImages: { [key: string]: ImageSourcePropType } = {
  // Key là 'english_name' trong tệp yoga-poses.json
  // Value là require() đến ảnh tương ứng
  "Warrior II": require("../../assets/poses/bing_images/bridge_yoga_pose/Warrior_II.jpg"),
  Tree: require("../../assets/poses/bing_images/bridge_yoga_pose/Tree_Pose.jpg"),
  "Downward-Facing Dog": require("../../assets/poses/bing_images/bridge_yoga_pose/Downward-Facing_Dog.jpg"),
  "Yogic Squat": require("../../assets/poses/bing_images/bridge_yoga_pose/Yogic_Squat.jpg"),
  // THÊM TẤT CẢ CÁC ẢNH CỦA BẠN VÀO ĐÂY
  // ...
};

const SAMPLE_VIDEO_URL =
  "https://videos.pexels.com/video-files/4754028/4754028-hd_1280_720_25fps.mp4";
const DEFAULT_THUMBNAIL = require("../../assets/poses/bing_images/bridge_yoga_pose/Yogic_Squat.jpg"); // Tạo một ảnh mặc định

// Biến đổi dữ liệu một lần và cache lại kết quả
const processedWorkouts: Workout[] = yogaPoses.map((pose: any) => ({
  id: `pose-${pose.id}`,
  title: pose.english_name,
  description:
    pose.pose_description ||
    "A beneficial yoga pose to improve strength and flexibility.",
  type: "Yoga",
  durationMinutes: Math.floor(Math.random() * 10) + 5,
  level: ["Beginner", "Intermediate", "Advanced"][
    Math.floor(Math.random() * 3)
  ] as Workout["level"],

  // --- THAY ĐỔI QUAN TRỌNG Ở ĐÂY ---
  // thumbnailUrl bây giờ sẽ là một số (kết quả của require) thay vì string
  thumbnailUrl: poseImages[pose.english_name] || DEFAULT_THUMBNAIL,

  videoUrl: SAMPLE_VIDEO_URL,
  rating: (Math.random() * 0.5 + 4.5).toFixed(1),
  reviewCount: Math.floor(Math.random() * 2000) + 500,
}));

// Hàm để lấy tất cả các bài tập đã được xử lý
export const getAllWorkouts = (): Workout[] => {
  return processedWorkouts;
};
