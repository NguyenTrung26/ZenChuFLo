// src/services/api/yogaApi.ts

import { Workout } from "../../types"; // Import Workout type của chúng ta

const API_URL = "https://yoga-api-nzy4.onrender.com/v1/poses";

// Một URL video mẫu để dùng cho tất cả các bài tập
const SAMPLE_VIDEO_URL =
  "https://videos.pexels.com/video-files/4754028/4754028-hd_1280_720_25fps.mp4";

// Hàm để fetch và biến đổi dữ liệu
export const getYogaWorkoutsFromApi = async (): Promise<Workout[]> => {
  try {
    console.log("Fetching yoga workouts from API...");
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Successfully fetched data.");

    // Biến đổi dữ liệu từ API thành cấu trúc Workout của chúng ta
    const workouts: Workout[] = data.map((pose: any) => ({
      id: `api-${pose.id}`, // Thêm tiền tố để phân biệt với dữ liệu Firestore
      title: pose.english_name,
      description: pose.pose_description,
      type: "Yoga", // Mặc định là Yoga
      durationMinutes: Math.floor(Math.random() * 10) + 5, // Random thời gian từ 5-14 phút
      level: "Beginner", // Mặc định
      thumbnailUrl: pose.url_png, // Sử dụng ảnh PNG từ API
      videoUrl: SAMPLE_VIDEO_URL, // Tạm thời dùng video mẫu
      rating: (Math.random() * 0.5 + 4.5).toFixed(1), // Random rating từ 4.5 - 5.0
      reviewCount: Math.floor(Math.random() * 2000) + 500, // Random review
    }));

    return workouts;
  } catch (error) {
    console.error("Failed to fetch yoga workouts:", error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};
