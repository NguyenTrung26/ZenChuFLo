// src/constants/workoutVideos.ts
// File chứa các link video giả cho từng bài tập

/**
 * Map chứa video URL cho mỗi workout ID
 * Key: workout ID
 * Value: video URL (mock data)
 */
export const WORKOUT_VIDEOS: Record<string, string> = {
    // Yoga Poses - Direct video URLs from Pexels
    "pose-1": "https://videos.pexels.com/video-files/4595677/4595677-hd_1920_1080_30fps.mp4",
    "pose-2": "https://videos.pexels.com/video-files/5473739/5473739-hd_1280_720_25fps.mp4",
    "pose-3": "https://videos.pexels.com/video-files/4752836/4752836-hd_1280_720_25fps.mp4",
    "pose-4": "https://videos.pexels.com/video-files/5473740/5473740-hd_1280_720_25fps.mp4",
    "pose-5": "https://videos.pexels.com/video-files/4754028/4754028-hd_1280_720_25fps.mp4",
    "pose-6": "https://videos.pexels.com/video-files/5473739/5473739-hd_1280_720_25fps.mp4",
    "pose-7": "https://videos.pexels.com/video-files/4752836/4752836-hd_1280_720_25fps.mp4",
    "pose-8": "https://videos.pexels.com/video-files/5473740/5473740-hd_1280_720_25fps.mp4",
    "pose-9": "https://videos.pexels.com/video-files/4754028/4754028-hd_1280_720_25fps.mp4",
    "pose-10": "https://videos.pexels.com/video-files/5473739/5473739-hd_1280_720_25fps.mp4",
    "pose-11": "https://videos.pexels.com/video-files/4752836/4752836-hd_1280_720_25fps.mp4",
    "pose-12": "https://videos.pexels.com/video-files/5473740/5473740-hd_1280_720_25fps.mp4",
    "pose-13": "https://videos.pexels.com/video-files/4754028/4754028-hd_1280_720_25fps.mp4",
    "pose-14": "https://videos.pexels.com/video-files/5473739/5473739-hd_1280_720_25fps.mp4",
    "pose-15": "https://videos.pexels.com/video-files/4752836/4752836-hd_1280_720_25fps.mp4",
    "pose-16": "https://videos.pexels.com/video-files/5473740/5473740-hd_1280_720_25fps.mp4",
    "pose-17": "https://videos.pexels.com/video-files/4754028/4754028-hd_1280_720_25fps.mp4",
    "pose-18": "https://videos.pexels.com/video-files/5473739/5473739-hd_1280_720_25fps.mp4",
    "pose-19": "https://videos.pexels.com/video-files/4752836/4752836-hd_1280_720_25fps.mp4",
    "pose-20": "https://videos.pexels.com/video-files/5473740/5473740-hd_1280_720_25fps.mp4",

    // Meditation Sessions
    "meditation-1": "https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_25fps.mp4",
    "meditation-2": "https://videos.pexels.com/video-files/3209829/3209829-hd_1280_720_25fps.mp4",
    "meditation-3": "https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_25fps.mp4",
    "meditation-4": "https://videos.pexels.com/video-files/3209829/3209829-hd_1280_720_25fps.mp4",
    "meditation-5": "https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_25fps.mp4",

    // Breathing Exercises
    "breathing-1": "https://videos.pexels.com/video-files/4754028/4754028-hd_1280_720_25fps.mp4",
    "breathing-2": "https://videos.pexels.com/video-files/4752836/4752836-hd_1280_720_25fps.mp4",
    "breathing-3": "https://videos.pexels.com/video-files/5473740/5473740-hd_1280_720_25fps.mp4",
    "breathing-4": "https://videos.pexels.com/video-files/4754028/4754028-hd_1280_720_25fps.mp4",
    "breathing-5": "https://videos.pexels.com/video-files/4752836/4752836-hd_1280_720_25fps.mp4",

    // AI Generated Workouts (dynamic IDs)
    // These will use a fallback video
};

/**
 * Default video URL khi không tìm thấy video cho workout cụ thể
 */
export const DEFAULT_WORKOUT_VIDEO = "https://videos.pexels.com/video-files/4595677/4595677-hd_1920_1080_30fps.mp4";

/**
 * Lấy video URL cho một workout
 * @param workoutId - ID của workout
 * @returns Video URL hoặc default video nếu không tìm thấy
 */
export const getWorkoutVideoUrl = (workoutId: string): string => {
    return WORKOUT_VIDEOS[workoutId] || DEFAULT_WORKOUT_VIDEO;
};

/**
 * Kiểm tra xem workout có video hay không
 * @param workoutId - ID của workout
 * @returns true nếu có video, false nếu không
 */
export const hasWorkoutVideo = (workoutId: string): boolean => {
    return workoutId in WORKOUT_VIDEOS;
};

/**
 * Thêm hoặc cập nhật video cho một workout
 * @param workoutId - ID của workout
 * @param videoUrl - URL của video
 */
export const setWorkoutVideo = (workoutId: string, videoUrl: string): void => {
    WORKOUT_VIDEOS[workoutId] = videoUrl;
};
