// src/services/WorkoutService.ts

import { Workout } from "../types";
import yogaPoses from "../data/yoga-poses.json";

// --- TẠO MAP ÁNH XẠ ĐẾN ẢNH CỤC BỘ ---
// 'ImageSourcePropType' là kiểu dữ liệu cho prop 'source' của component Image
import { ImageSourcePropType } from "react-native";

const IMG_PATH = "../../assets/poses/bing_images/bridge_yoga_pose/";

const poseImages: { [key: string]: ImageSourcePropType } = {
  // A-C
  "Boat": require(`${IMG_PATH}Boat.jpg`),
  "Bow": require(`${IMG_PATH}Bow.png`),
  "Bridge": require(`${IMG_PATH}4-Bridge-Pose.jpg`),
  "Butterfly": require(`${IMG_PATH}Butterfly.jpg`),
  "Camel": require(`${IMG_PATH}Camel.jpg`),
  "Cat": require(`${IMG_PATH}Cat.jpg`),
  "Chair": require(`${IMG_PATH}Chair.jpg`),
  "Child's Pose": require(`${IMG_PATH}Child-pose.jpg`),
  "Corpse": require(`${IMG_PATH}Corpse.jpg`),
  "Cow": require(`${IMG_PATH}Cow.jpeg`),
  "Crescent Lunge": require(`${IMG_PATH}Crescent_lunge.jpg`),
  "Crescent Moon": require(`${IMG_PATH}Crescent_Moon.jpg`),
  "Crow": require(`${IMG_PATH}Crow.png`),

  // D-F
  "Dolphin": require(`${IMG_PATH}Dolphin.jpg`),
  "Downward-Facing Dog": require(`${IMG_PATH}Downward-Facing-Dog.jpg`),
  "Eagle": require(`${IMG_PATH}Eagle.jpg`),
  "Extended Hand to Toe": require(`${IMG_PATH}Extended_Hand_to_Toe.webp`),
  "Extended Side Angle": require(`${IMG_PATH}Extended_Side_Angle.webp`),
  "Forearm Stand": require(`${IMG_PATH}Forearm_Stand.jpg`),
  "Forward Bend with Shoulder Opener": require(`${IMG_PATH}Forward_Bend_with_Shoulder_Opener.webp`),

  // G-L
  "Garland Pose": require(`${IMG_PATH}Garland_Pose.jpg`),
  "Half Boat": require(`${IMG_PATH}Half_Boat.jpg`),
  "Half Lord of the Fishes": require(`${IMG_PATH}Half_Lord_of_the_Fishes.jpg`),
  "Half-Moon": require(`${IMG_PATH}Half_Moon.jpeg`),
  "Handstand": require(`${IMG_PATH}handsand.jpg`),
  "King Pigeon": require(`${IMG_PATH}King_pigeon.jpg`),
  "Lotus": require(`${IMG_PATH}Lotus.jpg`),
  "Low Lunge": require(`${IMG_PATH}Low_Lunge.jpg`),

  // P-S
  "Pigeon": require(`${IMG_PATH}Pigeon.webp`),
  "Plank": require(`${IMG_PATH}Plank.jpg`),
  "Plow": require(`${IMG_PATH}Plow.webp`),
  "Pyramid": require(`${IMG_PATH}Pyramid.jpg`),
  "Reverse Warrior": require(`${IMG_PATH}reverse-warrior.jpg`),
  "Seated Forward Bend": require(`${IMG_PATH}Seated-Forward-Bend.jpg`),
  "Shoulder Stand": require(`${IMG_PATH}shoulderstand.jpg`),
  "Side Plank": require(`${IMG_PATH}Side_Plank.webp`),
  "Side Splits": require(`${IMG_PATH}Side_Splits.jpg`),
  "Sphinx": require(`${IMG_PATH}Sphinx.jpeg`),
  "Splits": require(`${IMG_PATH}Splits.webp`),
  "Standing Forward Bend": require(`${IMG_PATH}Standing-Forward-Bend.jpg`),

  // T-Z
  "Tree": require(`${IMG_PATH}Tree_Pose.jpg`),
  "Triangle": require(`${IMG_PATH}triangle.png`),
  "Upward-Facing Dog": require(`${IMG_PATH}Upward-Facing_Dog.jpg`),
  "Warrior One": require(`${IMG_PATH}warrior-one.jpeg`),
  "Warrior Two": require(`${IMG_PATH}Warrior_II.jpg`),
  "Warrior Three": require(`${IMG_PATH}warrior-three.jpeg`),
  "Wheel": require(`${IMG_PATH}wheel.jpg`),
  "Wild Thing": require(`${IMG_PATH}wild_thing.jpg`),
};

// Default video nếu pose không có video
const DEFAULT_VIDEO_URL =
  "https://videos.pexels.com/video-files/4595677/4595677-hd_1920_1080_30fps.mp4";
const DEFAULT_THUMBNAIL = require("../../assets/poses/bing_images/bridge_yoga_pose/Yogic_Squat.jpg");

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

  // Sử dụng ảnh từ map hoặc default
  thumbnailUrl: poseImages[pose.english_name] || DEFAULT_THUMBNAIL,

  // Sử dụng video từ JSON, nếu không có thì dùng default
  videoUrl: pose.video && pose.video.trim() !== "" ? pose.video : DEFAULT_VIDEO_URL,

  rating: (Math.random() * 0.5 + 4.5).toFixed(1),
  reviewCount: Math.floor(Math.random() * 2000) + 500,
}));

// Hàm để lấy tất cả các bài tập đã được xử lý
export const getAllWorkouts = (): Workout[] => {
  return processedWorkouts;
};
